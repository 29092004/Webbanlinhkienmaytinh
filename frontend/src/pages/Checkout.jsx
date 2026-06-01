/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

// Sub-components
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutPayment from "@/components/checkout/CheckoutPayment";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import { api } from "@/lib/api";
import { getStoredUser, isAuthenticated } from "@/lib/auth";
import { mapCartEntriesToItems, mapGuestCartItems } from "@/lib/cartMappers";
import {
  clearGuestCart,
  clearServerCart,
  fetchServerCartEntries,
  getGuestCartItems,
  notifyCartStateChanged,
} from "@/lib/cartStore";
import { showToast } from "@/lib/toast";

const LAST_ORDER_SNAPSHOT_KEY = "last_order_snapshot";
const PENDING_VNPAY_ORDER_KEY = "pending_vnpay_order";
const VOUCHER_DATE_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function normalizeVoucherRecord(voucher) {
  return {
    id: voucher.id,
    voucherCode: voucher.voucherCode ?? voucher.voucher_code ?? "",
    discountType: String(voucher.discountType ?? voucher.discount_type ?? "").trim().toUpperCase(),
    discountValue: Number(voucher.discountValue ?? voucher.discount_value ?? 0),
    minOrderValue: Number(voucher.minOrderValue ?? voucher.min_order_value ?? 0),
    maxDiscountValue:
      voucher.maxDiscountValue === null || voucher.maxDiscountValue === undefined
        ? (voucher.max_discount_value === null || voucher.max_discount_value === undefined
            ? null
            : Number(voucher.max_discount_value))
        : Number(voucher.maxDiscountValue),
    startDate: voucher.startDate ?? voucher.start_date ?? "",
    expiredDate: voucher.expiredDate ?? voucher.expired_date ?? "",
    usageLimit: Number(voucher.usageLimit ?? voucher.usage_limit ?? 0),
    usedCount: Number(voucher.usedCount ?? voucher.used_count ?? 0),
    usagePerCustomer: Number(voucher.usagePerCustomer ?? voucher.usage_per_customer ?? 0),
    isActive: Number(voucher.isActive ?? voucher.is_active ?? 0),
  };
}

function isVoucherActive(voucher, referenceDate = new Date()) {
  const start = voucher.startDate ? new Date(voucher.startDate) : null;
  const end = voucher.expiredDate ? new Date(voucher.expiredDate) : null;
  const hasRemainingUsage = voucher.usageLimit <= 0 || voucher.usedCount < voucher.usageLimit;

  return (
    voucher.isActive === 1 &&
    hasRemainingUsage &&
    (!start || start <= referenceDate) &&
    (!end || end >= referenceDate)
  );
}

function calculateVoucherDiscount(voucher, orderAmount) {
  if (!voucher || orderAmount <= 0) {
    return 0;
  }

  const rawDiscount =
    voucher.discountType === "PERCENT"
      ? Math.round((orderAmount * Number(voucher.discountValue || 0)) / 100)
      : Math.round(Number(voucher.discountValue || 0));

  const cappedDiscount =
    voucher.maxDiscountValue === null || voucher.maxDiscountValue === undefined
      ? rawDiscount
      : Math.min(rawDiscount, Number(voucher.maxDiscountValue || 0));

  return Math.max(0, Math.min(orderAmount, cappedDiscount));
}

function formatVoucherSummary(voucher) {
  const valueLabel =
    voucher.discountType === "PERCENT"
      ? `${Number(voucher.discountValue).toLocaleString("vi-VN")}%`
      : `${Number(voucher.discountValue).toLocaleString("vi-VN")}đ`;

  return `${voucher.voucherCode} - Giảm ${valueLabel} - Đơn từ ${Number(voucher.minOrderValue).toLocaleString(
    "vi-VN"
  )}đ - HSD ${voucher.expiredDate ? VOUCHER_DATE_FORMATTER.format(new Date(voucher.expiredDate)) : "không giới hạn"}`;
}

function isVoucherEligible(voucher, orderAmount) {
  return orderAmount >= Number(voucher.minOrderValue || 0);
}

function buildVoucherProgressHint(vouchers, orderAmount) {
  const now = new Date();
  const upcomingVoucher = [...vouchers]
    .filter((voucher) => isVoucherActive(voucher, now) && voucher.minOrderValue > orderAmount)
    .sort((left, right) => left.minOrderValue - right.minOrderValue)[0];

  if (!upcomingVoucher) {
    return "";
  }

  const missingAmount = Math.max(0, upcomingVoucher.minOrderValue - orderAmount);
  if (missingAmount <= 0) {
    return "";
  }

  return `Mua thêm ${missingAmount.toLocaleString("vi-VN")}đ để dùng mã ${upcomingVoucher.voucherCode}.`;
}

function normalizeCheckoutAddress(value) {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    return "";
  }

  const loweredValue = normalizedValue.toLowerCase();

  if (loweredValue === "chưa cập nhật" || loweredValue === "chua cap nhat") {
    return "";
  }

  return normalizedValue;
}

function buildCheckoutFullName(user, customer) {
  const profileLastName = String(customer?.firstName || user?.lastName || "").trim();
  const profileFirstName = String(customer?.lastName || user?.firstName || "").trim();
  const fullName = [profileLastName, profileFirstName].filter(Boolean).join(" ").trim();

  return fullName;
}

export default function Checkout() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const customerId = Number(user?.id || 0);
  const userEmail = user?.email || "";
  const userUsername = user?.username || "";
  const userPhone = user?.phone || "";
  const userLastName = user?.lastName || "";
  const userFirstName = user?.firstName || "";
  const isLoggedIn = isAuthenticated() && customerId > 0;

  // State Management
  const [products, setProducts] = useState([]);
  const [cartEntries, setCartEntries] = useState([]);
  const [guestCartEntries, setGuestCartEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("cod"); // Default COD
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(true);
  const [selectedVoucherId, setSelectedVoucherId] = useState("");

  // Form Fields State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: userEmail || userUsername || "",
    address: "",
    city: "Hồ Chí Minh",
    district: "",
    ward: "",
    note: "",
  });

  const cartItems = useMemo(
    () => (isLoggedIn ? mapCartEntriesToItems(cartEntries, products) : mapGuestCartItems(guestCartEntries, products)),
    [cartEntries, guestCartEntries, isLoggedIn, products]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchCheckoutData = async () => {
      try {
        setIsLoading(true);
        setIsLoadingVouchers(true);
        const productResponse = await api.get("/products");
        const voucherResponse = await api.get("/vouchers").catch(() => ({ data: { data: [] } }));
        const productRows = Array.isArray(productResponse.data?.data) ? productResponse.data.data : [];
        const voucherRows = Array.isArray(voucherResponse.data?.data) ? voucherResponse.data.data : [];

        if (!isMounted) {
          return;
        }

        setProducts(productRows);
        setVouchers(voucherRows.map(normalizeVoucherRecord));

        if (isLoggedIn) {
          const nextCartEntries = await fetchServerCartEntries(customerId);
          const customerResponse = await api.get(`/customers/${customerId}`).catch(() => null);
          const customer = customerResponse?.data?.data || null;

          if (!isMounted) {
            return;
          }

          setCartEntries(nextCartEntries);
          setGuestCartEntries([]);
          setFormData((current) => ({
            ...current,
            fullName: buildCheckoutFullName(
              {
                lastName: userLastName,
                firstName: userFirstName,
                email: userEmail,
                username: userUsername,
                phone: userPhone,
              },
              customer,
            ),
            phone: customer?.phone || userPhone || current.phone,
            email: customer?.email || userEmail || userUsername || current.email,
            address: normalizeCheckoutAddress(customer?.address) || current.address,
          }));
        } else {
          setCartEntries([]);
          setGuestCartEntries(getGuestCartItems());
          setFormData((current) => ({
            ...current,
            fullName: "",
            email: userEmail || userUsername || current.email,
          }));
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to fetch checkout data", error);
        setProducts([]);
        setCartEntries([]);
        setGuestCartEntries([]);
        setVouchers([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsLoadingVouchers(false);
        }
      }
    };

    fetchCheckoutData();

    return () => {
      isMounted = false;
    };
  }, [customerId, isLoggedIn, userEmail, userFirstName, userLastName, userPhone, userUsername]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Pricing calculations
  const itemsSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const shippingCost = 0; // Free shipping
  const orderAmountBeforeDiscount = useMemo(() => itemsSubtotal + shippingCost, [itemsSubtotal, shippingCost]);

  const activeVouchers = useMemo(() => {
    const now = new Date();

    return vouchers.filter((voucher) => isVoucherActive(voucher, now));
  }, [vouchers]);

  const availableVouchers = useMemo(() => {
    return activeVouchers.filter((voucher) => isVoucherEligible(voucher, orderAmountBeforeDiscount));
  }, [activeVouchers, orderAmountBeforeDiscount]);

  const voucherProgressHint = useMemo(() => {
    return buildVoucherProgressHint(vouchers, orderAmountBeforeDiscount);
  }, [orderAmountBeforeDiscount, vouchers]);

  const selectedVoucher = useMemo(
    () => availableVouchers.find((voucher) => String(voucher.id) === String(selectedVoucherId)) || null,
    [availableVouchers, selectedVoucherId]
  );

  useEffect(() => {
    if (!selectedVoucherId) {
      return;
    }

    const stillAvailable = availableVouchers.some((voucher) => String(voucher.id) === String(selectedVoucherId));
    if (!stillAvailable) {
      setSelectedVoucherId("");
    }
  }, [availableVouchers, selectedVoucherId]);

  const voucherDiscount = useMemo(() => {
    return calculateVoucherDiscount(selectedVoucher, orderAmountBeforeDiscount);
  }, [orderAmountBeforeDiscount, selectedVoucher]);

  const totalPayment = useMemo(() => {
    return Math.max(0, orderAmountBeforeDiscount - voucherDiscount);
  }, [orderAmountBeforeDiscount, voucherDiscount]);

  const clearCurrentServerCart = async () => {
    await clearServerCart(customerId);
    notifyCartStateChanged();
  };

  const handleOrderSubmit = async () => {
    if (!cartItems.length) {
      showToast({ message: "Giỏ hàng của bạn đang trống.", type: "error" });
      return;
    }

    if (!formData.fullName.trim() || !formData.phone.trim()) {
      showToast({ message: "Vui lòng nhập họ tên và số điện thoại giao hàng.", type: "error" });
      return;
    }

    if (!formData.district.trim() || !formData.ward.trim()) {
      showToast({ message: "Vui lòng chọn quận/huyện và phường/xã giao hàng.", type: "error" });
      return;
    }

    setIsSubmitting(true);

    const customerAddress = [formData.address, formData.ward, formData.district, formData.city]
      .filter(Boolean)
      .join(", ");

    const orderPayload = {
      createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      paymentMethod: String(selectedMethod || "cod").toUpperCase(),
      status: "PENDING",
      accountId: customerId || 999999,
      voucherId: selectedVoucher?.id ?? null,
      totalPrice: orderAmountBeforeDiscount,
      discountAmount: voucherDiscount,
      finalPrice: totalPayment,
      customerAddress,
      deliveryMethod: "Standard",
      details: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        subtotalPrice: item.price * item.quantity,
        note: null,
      })),
    };

    const snapshot = {
      ...orderPayload,
      id: null,
      created_at: orderPayload.createdAt,
      payment_method: orderPayload.paymentMethod,
      total_price: orderPayload.totalPrice,
      voucher_id: orderPayload.voucherId,
      voucherCode: selectedVoucher?.voucherCode || "",
      voucher_code: selectedVoucher?.voucherCode || "",
      discount_amount: orderPayload.discountAmount,
      final_price: orderPayload.finalPrice,
      customer_first_name: formData.fullName.trim().split(" ").slice(0, -1).join(" "),
      customer_last_name: formData.fullName.trim().split(" ").slice(-1).join(" "),
      customer_email: formData.email,
      customer_phone: formData.phone,
      customerAddress,
      customer_address: customerAddress,
      deliveryMethod: orderPayload.deliveryMethod,
      delivery_method: orderPayload.deliveryMethod,
      details: cartItems.map((item) => ({
        product_id: item.productId,
        product_name: item.name,
        quantity: item.quantity,
        subtotal_price: item.price * item.quantity,
        note: null,
      })),
    };

    try {
      if (isLoggedIn) {
        if (selectedMethod === "vnpay") {
          sessionStorage.setItem(PENDING_VNPAY_ORDER_KEY, JSON.stringify(snapshot));
          const paymentResponse = await api.post("/vnpay/create-payment-url", {
            totalPrice: orderPayload.finalPrice,
          });
          const paymentUrl = paymentResponse.data?.paymentUrl;

          if (!paymentUrl) {
            throw new Error("VNPay payment URL was not returned");
          }

          window.location.assign(paymentUrl);
          return;
        }

        const response = await api.post("/orders", orderPayload);
        const orderId = response.data?.orderId;

        sessionStorage.removeItem(PENDING_VNPAY_ORDER_KEY);
        sessionStorage.setItem(
          LAST_ORDER_SNAPSHOT_KEY,
          JSON.stringify({
            ...snapshot,
            id: orderId,
          })
        );

        await clearCurrentServerCart();
        setCartEntries([]);
        setGuestCartEntries([]);

        navigate(`/order-confirmation?orderId=${orderId}`);
      } else {
        sessionStorage.removeItem(PENDING_VNPAY_ORDER_KEY);
        clearGuestCart();
        setGuestCartEntries([]);

        sessionStorage.setItem(
          LAST_ORDER_SNAPSHOT_KEY,
          JSON.stringify({
            ...snapshot,
            id: `guest-${Date.now()}`,
          })
        );

        navigate("/order-confirmation");
      }
    } catch (error) {
      console.error("Failed to submit order", error);
      showToast({ message: "Không thể tạo đơn hàng lúc này.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Giỏ hàng", href: "/cart" },
            { label: "Thanh toán" },
          ]}
        />

        {/* Title Section */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="my-0 text-[1.9rem] font-black uppercase tracking-[-0.02em] text-slate-950 md:text-[2.2rem]">
            Thanh Toán
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-600 leading-relaxed">
            Vui lòng hoàn tất các thông tin bên dưới để xác nhận đơn hàng của bạn.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center text-sm font-semibold text-slate-400 shadow-sm">
            Dang tai du lieu thanh toan...
          </div>
        ) : !isLoggedIn && cartItems.length === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">Chua the vao trang thanh toan</h2>
            <p className="text-sm font-medium text-slate-500">
              Ban chua dang nhap va gio hang hien dang trong. Hay them san pham vao gio hang truoc.
            </p>
            <Link
              to="/cart"
              className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold uppercase text-white transition-colors hover:bg-blue-700"
            >
              Quay lai gio hang
            </Link>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">Khong co san pham de thanh toan</h2>
            <p className="text-sm font-medium text-slate-500">
              Vui long quay lai gio hang va chon san pham truoc khi thanh toan.
            </p>
            <Link
              to="/cart"
              className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold uppercase text-white transition-colors hover:bg-blue-700"
            >
              Quay lai gio hang
            </Link>
          </div>
        ) : (
          <>
            {/* 2-Column Split Layout matching the design */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Checkout forms */}
              <div className="lg:col-span-8 space-y-6">
                {/* Section 1 & 2 combined: Shipping Details */}
                <CheckoutForm
                  formData={formData}
                  onFormChange={handleFormChange}
                />

                {/* Section 3: Payment Method */}
                <CheckoutPayment
                  selectedMethod={selectedMethod}
                  onMethodChange={setSelectedMethod}
                />
              </div>

              {/* Right Column: Order Summary Sidebar */}
              <aside className="lg:col-span-4 shrink-0">
                <CheckoutSummary
                  cartItems={cartItems}
                  itemsSubtotal={itemsSubtotal}
                  shippingCost={shippingCost}
                  voucherDiscount={voucherDiscount}
                  totalPayment={totalPayment}
                  onOrderSubmit={handleOrderSubmit}
                  isSubmitting={isSubmitting}
                  vouchers={activeVouchers.map((voucher) => ({
                    ...voucher,
                    summaryLabel: formatVoucherSummary(voucher),
                    isEligible: isVoucherEligible(voucher, orderAmountBeforeDiscount),
                  }))}
                  selectedVoucherId={selectedVoucherId}
                  onSelectVoucher={setSelectedVoucherId}
                  selectedVoucher={selectedVoucher}
                  isLoadingVouchers={isLoadingVouchers}
                  orderAmountBeforeDiscount={orderAmountBeforeDiscount}
                  voucherProgressHint={voucherProgressHint}
                  selectedMethod={selectedMethod}
                />
              </aside>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
