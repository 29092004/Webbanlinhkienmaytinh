import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, ShoppingBag } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

// Sub-components
import CheckoutAddress from "@/components/checkout/CheckoutAddress";
import CheckoutProductList from "@/components/checkout/CheckoutProductList";
import CheckoutVoucher from "@/components/checkout/CheckoutVoucher";
import CheckoutPaymentMethod from "@/components/checkout/CheckoutPaymentMethod";
import AddressListModal from "@/components/checkout/AddressListModal";
import AddAddressModal from "@/components/checkout/AddAddressModal";

// Mock Products inspired by user screenshot
const mockCheckoutProducts = [
  {
    id: 101,
    name: "EXO CORE VORTEX X1 - RTX 4090 Ultimate Gaming PC",
    details: "Loot Custom Build Silver Edition",
    price: 125000000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 102,
    name: "Monitor EXO VISION 4K 144Hz Professional Display",
    details: "Loot 32-inch IPS Panel",
    price: 18500000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400&auto=format&fit=crop",
  },
];

// Mock Address List from user screenshots
const initialAddresses = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "(+84) 901 234 567",
    fullAddress: "Số 123, Đường ABC, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    detail: "Số 123, Đường ABC",
    ward: "Phường Bến Nghé",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    type: "home",
    isDefault: true,
  },
  {
    id: 2,
    name: "3658_Ngô Văn Viễn",
    phone: "(+84) 945 172 154",
    fullAddress: "145/6, Đường Số 1, Phường Hạnh Thông, Thành phố Hồ Chí Minh",
    detail: "145/6, Đường Số 1",
    ward: "Phường Hạnh Thông",
    district: "Quận Gò Vấp",
    city: "Thành phố Hồ Chí Minh",
    type: "office",
    isDefault: false,
  },
];

const mockVouchers = [
  { id: "v1", code: "EXOWELCOME", discount: 500000, desc: "Giảm 500k cho khách hàng mới" },
  { id: "v2", code: "EXOSUPER", discount: 1500000, desc: "Giảm 1.5M cho đơn hàng linh kiện" },
  { id: "v3", code: "EXOVIP", discount: 3000000, desc: "Giảm 3M cho khách hàng thân thiết" },
];

export default function Checkout() {
  const navigate = useNavigate();

  // State Management
  const [cartItems] = useState(mockCheckoutProducts);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [pointsUsed, setPointsUsed] = useState(true); // Checked by default in screenshot
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("cod"); // Default COD
  const [shippingMethod, setShippingMethod] = useState("express"); // Default Hỏa tốc
  const [note, setNote] = useState("");

  // Modals Visibility
  const [isAddressListOpen, setIsAddressListOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);

  // Active address memo
  const activeAddress = useMemo(() => {
    return addresses.find((addr) => addr.id === selectedAddressId) || addresses[0];
  }, [addresses, selectedAddressId]);

  // Points & Pricing details
  const pointsAvailable = 2500;
  const pointsToUse = 2000;
  const pointsDiscount = 2000000; // -2.000.000đ

  const itemsSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const shippingCost = 0; // Free shipping in screenshot

  const voucherDiscount = useMemo(() => {
    return selectedVoucher ? selectedVoucher.discount : 0;
  }, [selectedVoucher]);

  const currentPointsDiscount = useMemo(() => {
    return pointsUsed ? pointsDiscount : 0;
  }, [pointsUsed, pointsDiscount]);

  const totalPayment = useMemo(() => {
    return Math.max(0, itemsSubtotal + shippingCost - currentPointsDiscount - voucherDiscount);
  }, [itemsSubtotal, shippingCost, currentPointsDiscount, voucherDiscount]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleAddressSave = (newAddr) => {
    if (addressToEdit) {
      // Editing
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === newAddr.id ? { ...addr, ...newAddr } : addr))
      );
    } else {
      // Adding new
      // If new address is marked default, unset other defaults
      let updatedList = [...addresses];
      if (newAddr.isDefault) {
        updatedList = updatedList.map((addr) => ({ ...addr, isDefault: false }));
      }
      updatedList.push(newAddr);
      setAddresses(updatedList);
      setSelectedAddressId(newAddr.id); // auto-select new address
    }
    setIsAddAddressOpen(false);
    setAddressToEdit(null);
    setIsAddressListOpen(true); // Return to address list
  };

  const handleEditAddress = (addr) => {
    setAddressToEdit(addr);
    setIsAddressListOpen(false);
    setIsAddAddressOpen(true);
  };

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    setIsAddressListOpen(false);
  };

  const handleOrderSubmit = () => {
    if (!activeAddress) {
      alert("Vui lòng cập nhật địa chỉ giao hàng trước khi đặt hàng!");
      return;
    }

    setIsSubmitting(true);

    // Mock api submit order delay
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/order-confirmation");
    }, 1500);
  };

  const handleSelectVoucherClick = () => {
    // Basic cycle or selection of vouchers for mock demonstration
    if (!selectedVoucher) {
      setSelectedVoucher(mockVouchers[0]);
    } else {
      const currentIndex = mockVouchers.findIndex((v) => v.id === selectedVoucher.id);
      if (currentIndex === mockVouchers.length - 1) {
        setSelectedVoucher(null); // Deselect
      } else {
        setSelectedVoucher(mockVouchers[currentIndex + 1]); // Next one
      }
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

        {/* Title */}
        <div className="flex items-center gap-2.5 border-b border-slate-200 pb-4">
          <CreditCard className="size-7 text-blue-600" />
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight my-0">
            Thanh Toán
          </h1>
        </div>

        {/* Main Columns / Vertical layout as requested */}
        <div className="space-y-5">
          {/* Section 1: Address Info */}
          <CheckoutAddress
            activeAddress={activeAddress}
            onChangeClick={() => setIsAddressListOpen(true)}
          />

          {/* Section 2: Product Breakdown */}
          <CheckoutProductList
            cartItems={cartItems}
            note={note}
            onNoteChange={setNote}
            shippingMethod={shippingMethod}
            onShippingMethodChange={setShippingMethod}
          />

          {/* Section 3: Voucher & Points */}
          <CheckoutVoucher
            pointsUsed={pointsUsed}
            onPointsToggle={() => setPointsUsed(!pointsUsed)}
            pointsAvailable={pointsAvailable}
            pointsToUse={pointsToUse}
            pointsDiscount={pointsDiscount}
            selectedVoucher={selectedVoucher}
            onSelectVoucherClick={handleSelectVoucherClick}
          />

          {/* Section 4: Payment Method and Total Payment */}
          <CheckoutPaymentMethod
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
            itemsSubtotal={itemsSubtotal}
            shippingCost={shippingCost}
            pointsDiscount={currentPointsDiscount}
            voucherDiscount={voucherDiscount}
            totalPayment={totalPayment}
            onOrderSubmit={handleOrderSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      <Footer />

      {/* Address Selection Modal */}
      <AddressListModal
        isOpen={isAddressListOpen}
        onClose={() => setIsAddressListOpen(false)}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelectAddress={handleSelectAddress}
        onAddNewClick={() => {
          setAddressToEdit(null);
          setIsAddressListOpen(false);
          setIsAddAddressOpen(true);
        }}
        onEditAddress={handleEditAddress}
      />

      {/* Add/Edit Address Modal */}
      <AddAddressModal
        isOpen={isAddAddressOpen}
        onClose={() => {
          setIsAddAddressOpen(false);
          setIsAddressListOpen(true); // Return to address list
        }}
        onSave={handleAddressSave}
        addressToEdit={addressToEdit}
      />
    </div>
  );
}
