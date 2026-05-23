import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

import OrderPageHeader from "@/components/order/OrderPageHeader";
import OrderTracker from "@/components/order/OrderTracker";
import OrderProductsList from "@/components/order/OrderProductsList";
import OrderDeliveryTimeline from "@/components/order/OrderDeliveryTimeline";
import OrderBillingSummary from "@/components/order/OrderBillingSummary";

const order = {
  code: "#EXO-99284",
  orderedAt: "24 Tháng 10, 2023 | 14:32",
  items: [
    {
      id: 1,
      name: "NVIDIA GeForce RTX 4090 OC Edition",
      sku: "EXO-GPU-4090-FE",
      price: 48990000,
      quantity: 1,
      badge: "Bảo hành 36 tháng",
      image:
        "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Intel Core i9-13900K Desktop Processor",
      sku: "EXO-CPU-I9-13900K",
      price: 15490000,
      quantity: 1,
      badge: "Hàng chính hãng Box",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop",
    },
  ],
  trackingSteps: [
    {
      id: "ordered",
      title: "Đặt hàng",
      time: "24/10/2023 - 14:32",
      status: "completed",
    },
    {
      id: "paid",
      title: "Thanh toán",
      time: "24/10/2023 - 14:45",
      status: "completed",
    },
    {
      id: "shipping",
      title: "Đang giao",
      time: "Dự kiến: 26/10/2023",
      status: "active",
      actionLabel: "Theo dõi giao hàng",
    },
    {
      id: "done",
      title: "Hoàn thành",
      time: "-",
      status: "pending",
    },
  ],
  timeline: [
    {
      id: 1,
      status: "Đang trên đường giao đến bạn",
      description: "Bưu cục TP. Hồ Chí Minh - Đang vận chuyển liên tỉnh",
      time: "25/10/2023 - 08:30",
    },
    {
      id: 2,
      status: "Đã rời kho vận hành",
      description: "Kho tổng EXO CORE - Hà Nội",
      time: "24/10/2023 - 21:15",
    },
    {
      id: 3,
      status: "Đã xác nhận và đóng gói",
      description: "Kiểm tra kỹ thuật hoàn tất. Sẵn sàng giao hàng.",
      time: "24/10/2023 - 17:00",
    },
  ],
  address: {
    name: "Nguyễn Văn A",
    phone: "0901 234 567",
    fullAddress:
      "123 Đường Song Hành, Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh",
  },
  payment: {
    methodName: "VNPay Gateway",
    status: "Đã thanh toán thành công",
    transactionCode: "VNP-88273319",
    bank: "Vietcombank",
  },
  billing: {
    itemCount: 2,
    subtotal: 64480000,
    shippingMethod: "Express",
    insurance: 150000,
    voucherCode: "EXO-GOLD",
    discount: 1000000,
    total: 63630000,
  },
};

export default function OrderDetail() {
  const handleDownloadInvoice = () => {
    alert(`Đang khởi tạo hóa đơn PDF cho đơn hàng ${order.code}.`);
  };

  const handleTechSupport = () => {
    alert("Đang kết nối bạn với bộ phận hỗ trợ kỹ thuật EXO CORE.");
  };

  const handleEditOrderInfo = () => {
    alert(
      "Để thay đổi thông tin người nhận, vui lòng liên hệ CSKH trước khi đơn hàng được giao.",
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f6f8] font-sans text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <OrderPageHeader
          orderCode={order.code}
          orderedAt={order.orderedAt}
          onDownloadInvoice={handleDownloadInvoice}
          onSupport={handleTechSupport}
        />

        <OrderTracker steps={order.trackingSteps} />

        <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-8">
            <OrderProductsList items={order.items} />
            <OrderDeliveryTimeline timeline={order.timeline} />
          </div>

          <aside className="w-full">
            <OrderBillingSummary
              address={order.address}
              payment={order.payment}
              billing={order.billing}
              onEditOrderInfo={handleEditOrderInfo}
            />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
