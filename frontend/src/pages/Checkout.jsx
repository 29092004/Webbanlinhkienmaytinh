import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

// Sub-components
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutPayment from "@/components/checkout/CheckoutPayment";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

// Mock Products matching user screenshot
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

export default function Checkout() {
  const navigate = useNavigate();

  // State Management
  const [cartItems] = useState(mockCheckoutProducts);
  const [selectedMethod, setSelectedMethod] = useState("cod"); // Default COD
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    fullName: "Nguyễn Văn A",
    phone: "0901 234 567",
    email: "example@exocore.vn",
    address: "",
    city: "Hồ Chí Minh",
    district: "Quận 1",
    ward: "Phường Bến Nghé",
    note: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Pricing calculations
  const itemsSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const shippingCost = 0; // Free shipping
  const voucherDiscount = useMemo(() => {
    return couponApplied ? Math.round(itemsSubtotal * 0.1) : 0;
  }, [itemsSubtotal, couponApplied]);

  const totalPayment = useMemo(() => {
    return Math.max(0, itemsSubtotal + shippingCost - voucherDiscount);
  }, [itemsSubtotal, shippingCost, voucherDiscount]);

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "EXOCORE2024") {
      setCouponApplied(true);
    } else {
      alert("Mã giảm giá không hợp lệ. Vui lòng thử lại với EXOCORE2024!");
    }
  };

  const handleOrderSubmit = () => {
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert("Vui lòng nhập họ tên và số điện thoại giao hàng!");
      return;
    }

    setIsSubmitting(true);

    // Mock API submit order delay
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/order-confirmation");
    }, 1500);
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
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight my-0">
            Thanh Toán
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1.5 leading-relaxed">
            Vui lòng hoàn tất các thông tin bên dưới để xác nhận đơn hàng của bạn.
          </p>
        </div>

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
              couponCode={couponCode}
              onCouponCodeChange={setCouponCode}
              onApplyCoupon={handleApplyCoupon}
              couponApplied={couponApplied}
            />
          </aside>

        </div>
      </div>

      <Footer />
    </div>
  );
}
