import { useEffect, useState } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { useNavigate, useSearchParams } from "react-router-dom";

import OrderSuccessHeader from "@/components/order/OrderSuccessHeader";
import OrderDetailsCard from "@/components/order/OrderDetailsCard";
import OrderSummaryCard from "@/components/order/OrderSummaryCard";
import { api } from "@/lib/api";
import { mapOrderConfirmationForView } from "@/lib/orderMappers";
import { clearServerCart } from "@/lib/cartStore";
import { getStoredUser } from "@/lib/auth";
import { showToast } from "@/lib/toast";

const LAST_ORDER_SNAPSHOT_KEY = "last_order_snapshot";
const PENDING_VNPAY_ORDER_KEY = "pending_vnpay_order";
const PENDING_VNPAY_ORDER_LOCK_KEY = "pending_vnpay_order_lock";
const VNPAY_TOAST_SHOWN_KEY = "vnpay_toast_shown";
const buildPendingVnpayOrderResultKey = (txnRef) => `pending_vnpay_order_result_${txnRef || "default"}`;

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = getStoredUser();
  const paymentStatus = searchParams.get("paymentStatus") || "default";
  const [orderView, setOrderView] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadConfirmationOrder = async () => {
      try {
        setIsLoading(true);
        const orderId = searchParams.get("orderId");
        const paymentStatus = searchParams.get("paymentStatus");
        const paymentMethod = searchParams.get("paymentMethod");
        const txnRef = searchParams.get("txnRef");
        const storedSnapshot = sessionStorage.getItem(LAST_ORDER_SNAPSHOT_KEY);
        const pendingVnpayOrder = sessionStorage.getItem(PENDING_VNPAY_ORDER_KEY);
        const parsedSnapshot = storedSnapshot ? JSON.parse(storedSnapshot) : null;
        const parsedPendingVnpayOrder = pendingVnpayOrder ? JSON.parse(pendingVnpayOrder) : null;
        const pendingVnpayOrderResultKey = buildPendingVnpayOrderResultKey(txnRef);
        const storedCreatedOrderId = sessionStorage.getItem(pendingVnpayOrderResultKey);

        if (paymentMethod === "VNPAY" && paymentStatus === "success" && !orderId && parsedPendingVnpayOrder) {
          if (storedCreatedOrderId) {
            navigate(`/order-confirmation?orderId=${storedCreatedOrderId}&paymentStatus=success&paymentMethod=VNPAY`, {
              replace: true,
            });
            return;
          }

          const activeCreationLock = sessionStorage.getItem(PENDING_VNPAY_ORDER_LOCK_KEY);

          if (activeCreationLock && activeCreationLock === txnRef) {
            for (let attempt = 0; attempt < 10; attempt += 1) {
              await new Promise((resolve) => window.setTimeout(resolve, 250));
              const resolvedOrderId = sessionStorage.getItem(pendingVnpayOrderResultKey);

              if (resolvedOrderId) {
                navigate(`/order-confirmation?orderId=${resolvedOrderId}&paymentStatus=success&paymentMethod=VNPAY`, {
                  replace: true,
                });
                return;
              }
            }

            return;
          }

          sessionStorage.setItem(PENDING_VNPAY_ORDER_LOCK_KEY, txnRef || "creating");

          const createOrderPayload = {
            createdAt: parsedPendingVnpayOrder.createdAt ?? parsedPendingVnpayOrder.created_at,
            paymentMethod: parsedPendingVnpayOrder.paymentMethod ?? parsedPendingVnpayOrder.payment_method,
            status: "PENDING",
            accountId: parsedPendingVnpayOrder.accountId ?? parsedPendingVnpayOrder.account_id,
            voucherId: parsedPendingVnpayOrder.voucherId ?? parsedPendingVnpayOrder.voucher_id ?? null,
            totalPrice: parsedPendingVnpayOrder.totalPrice ?? parsedPendingVnpayOrder.total_price,
            discountAmount: parsedPendingVnpayOrder.discountAmount ?? parsedPendingVnpayOrder.discount_amount ?? 0,
            finalPrice:
              parsedPendingVnpayOrder.finalPrice ??
              parsedPendingVnpayOrder.final_price ??
              parsedPendingVnpayOrder.totalPrice ??
              parsedPendingVnpayOrder.total_price,
            customerAddress:
              parsedPendingVnpayOrder.customerAddress ??
              parsedPendingVnpayOrder.customer_address ??
              "",
            deliveryMethod:
              parsedPendingVnpayOrder.deliveryMethod ??
              parsedPendingVnpayOrder.delivery_method ??
              "Standard",
            details: (parsedPendingVnpayOrder.details || []).map((detail) => ({
              productId: detail.productId ?? detail.product_id,
              quantity: detail.quantity,
              subtotalPrice: detail.subtotalPrice ?? detail.subtotal_price,
              note: detail.note ?? null,
            })),
          };
          const response = await api.post("/orders", createOrderPayload);
          const createdOrderId = response.data?.orderId;

          if (!createdOrderId) {
            throw new Error("Order was not created after VNPay success");
          }

          await clearServerCart(user?.id).catch(() => null);
          sessionStorage.removeItem(PENDING_VNPAY_ORDER_KEY);
          sessionStorage.removeItem(PENDING_VNPAY_ORDER_LOCK_KEY);
          sessionStorage.setItem(pendingVnpayOrderResultKey, String(createdOrderId));
          sessionStorage.setItem(
            LAST_ORDER_SNAPSHOT_KEY,
            JSON.stringify({
              ...parsedPendingVnpayOrder,
              id: createdOrderId,
              status: "PENDING",
              created_at: parsedPendingVnpayOrder.createdAt ?? parsedPendingVnpayOrder.created_at,
              payment_method: parsedPendingVnpayOrder.paymentMethod ?? parsedPendingVnpayOrder.payment_method,
              total_price: parsedPendingVnpayOrder.totalPrice ?? parsedPendingVnpayOrder.total_price,
              discount_amount: parsedPendingVnpayOrder.discountAmount ?? parsedPendingVnpayOrder.discount_amount ?? 0,
              final_price:
                parsedPendingVnpayOrder.finalPrice ??
                parsedPendingVnpayOrder.final_price ??
                parsedPendingVnpayOrder.totalPrice ??
                parsedPendingVnpayOrder.total_price,
            })
          );

          if (isMounted) {
            navigate(`/order-confirmation?orderId=${createdOrderId}&paymentStatus=success&paymentMethod=VNPAY`, {
              replace: true,
            });
          }
          return;
        }

        if (orderId) {
          const [orderResponse, productResponse] = await Promise.all([
            api.get(`/orders/${orderId}`),
            api.get("/products"),
          ]);

          if (!isMounted) {
            return;
          }

          const orderRow = orderResponse.data?.data || null;
          const productRows = Array.isArray(productResponse.data?.data) ? productResponse.data.data : [];
          setOrderView(mapOrderConfirmationForView(orderRow, productRows));
          return;
        }

        if (parsedSnapshot) {
          setOrderView(
            mapOrderConfirmationForView(parsedSnapshot, [])
          );
          return;
        }

        if (paymentMethod === "VNPAY" && parsedPendingVnpayOrder) {
          setOrderView(mapOrderConfirmationForView(parsedPendingVnpayOrder, []));
          return;
        }

        setOrderView(null);
      } catch (error) {
        sessionStorage.removeItem(PENDING_VNPAY_ORDER_LOCK_KEY);
        if (!isMounted) {
          return;
        }

        console.error("Failed to load order confirmation", error);
        showToast({ message: "Thanh toán thành công nhưng chưa lưu được đơn hàng. Vui lòng thử lại.", type: "error" });
        setOrderView(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadConfirmationOrder();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  useEffect(() => {
    const paymentStatus = searchParams.get("paymentStatus");
    const paymentMethod = searchParams.get("paymentMethod");
    const orderId = searchParams.get("orderId");
    const txnRef = searchParams.get("txnRef");
    const toastKey = `${paymentMethod || "default"}:${paymentStatus || "default"}:${orderId || txnRef || "no-ref"}`;
    const lastShownToastKey = sessionStorage.getItem(VNPAY_TOAST_SHOWN_KEY);

    if (paymentMethod !== "VNPAY" || !paymentStatus) {
      return;
    }

    if (lastShownToastKey === toastKey) {
      return;
    }

    sessionStorage.setItem(VNPAY_TOAST_SHOWN_KEY, toastKey);

    if (paymentStatus === "success") {
      showToast({ message: "Thanh toán VNPay thành công.", type: "success" });
      return;
    }

    if (paymentStatus === "failed") {
      showToast({ message: "Thanh toán VNPay chưa thành công. Đơn hàng chưa được lưu.", type: "error" });
      return;
    }

    showToast({ message: "Không xác minh được kết quả thanh toán VNPay.", type: "error" });
  }, [searchParams]);

  const handleTrackOrder = () => {
    if (!orderView?.orderId || String(orderView.orderId).startsWith("guest-")) {
      showToast({
        message: "Đơn hàng vừa đặt đã được lưu. Vui lòng đăng nhập để theo dõi chi tiết.",
      });
      return;
    }

    navigate(`/order/${orderView.orderId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex flex-col items-center">
        <OrderSuccessHeader paymentStatus={paymentStatus} />

        {isLoading ? (
          <div className="mt-6 w-full max-w-5xl rounded-2xl border border-slate-100 bg-white p-10 text-center text-sm font-semibold text-slate-500 shadow-sm">
            Đang tải thông tin đơn hàng...
          </div>
        ) : !orderView ? (
          <div className="mt-6 w-full max-w-5xl rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Chưa có dữ liệu đơn hàng</h2>
            <p className="mt-3 text-sm font-medium text-slate-500">
              Không tìm thấy thông tin xác nhận đơn hàng để hiển thị.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-start justify-between mt-4">
            <div className="order-left-col">
              <OrderDetailsCard
                orderCode={orderView.orderCode}
                paymentStatus={orderView.paymentStatus}
                paymentMethodBadge={orderView.paymentMethodBadge}
                deliveryEstimate={orderView.deliveryEstimate}
                shippingMethod={orderView.shippingMethod}
                onTrackOrder={handleTrackOrder}
              />
            </div>

            <div className="order-right-col">
              <OrderSummaryCard
                items={orderView.items}
                subtotal={orderView.subtotal}
                shippingCost={orderView.shippingCost}
                voucherCode={orderView.voucherCode}
                discount={orderView.discount}
                total={orderView.total}
              />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
