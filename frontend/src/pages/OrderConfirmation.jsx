import { useState } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

// Sub-components
import OrderSuccessHeader from "@/components/order/OrderSuccessHeader";
import OrderDetailsCard from "@/components/order/OrderDetailsCard";
import OrderSummaryCard from "@/components/order/OrderSummaryCard";

// Mock ordered products from screenshot
const mockOrderedItems = [
  {
    id: 1,
    name: "NVIDIA RTX 4090 Founders Edition",
    price: 45500000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Corsair Dominator Titanium 64GB DDR5",
    price: 8200000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop",
  },
];

export default function OrderConfirmation() {
  const [items] = useState(mockOrderedItems);

  const subtotal = 53700000;
  const shippingCost = 0;
  const total = 53700000;

  // Handle tracking order button click
  const handleTrackOrder = () => {
    alert("📦 Tính năng theo dõi đơn hàng đang được cập nhật. Bạn sẽ nhận được thông báo chi tiết qua SMS/Email khi đơn hàng bắt đầu vận chuyển!");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Universal Header */}
      <Header />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex flex-col items-center">
        
        {/* Checkmark and Main Header */}
        <OrderSuccessHeader />

        {/* 2-Column Responsive Layout */}
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-start justify-between mt-4">
          
          {/* Left Column: Details Box & Action Buttons */}
          <div className="order-left-col">
            <OrderDetailsCard
              orderCode="#EXO-99234"
              paymentStatus="Đã thanh toán"
              paymentMethodBadge="VNPay"
              deliveryEstimate="24 Tháng 5, 2026"
              shippingMethod="Giao hàng hỏa tốc"
              onTrackOrder={handleTrackOrder}
            />
          </div>

          {/* Right Column: Order Products Summary */}
          <div className="order-right-col">
            <OrderSummaryCard
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              total={total}
            />
          </div>

        </div>
      </div>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
