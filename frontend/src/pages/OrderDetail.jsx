import { useEffect, useState } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { useParams } from "react-router-dom";

import OrderPageHeader from "@/components/order/OrderPageHeader";
import OrderTracker from "@/components/order/OrderTracker";
import OrderProductsList from "@/components/order/OrderProductsList";
import OrderDeliveryTimeline from "@/components/order/OrderDeliveryTimeline";
import OrderBillingSummary from "@/components/order/OrderBillingSummary";
import { api } from "@/lib/api";
import { mapOrderDetailForView } from "@/lib/orderMappers";
import { showToast } from "@/lib/toast";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadOrderDetail = async () => {
      if (!id) {
        setError("Không tìm thấy mã đơn hàng.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [orderResponse, productResponse] = await Promise.all([
          api.get(`/orders/${id}`),
          api.get("/products"),
        ]);

        if (!isMounted) {
          return;
        }

        const orderRow = orderResponse.data?.data || null;
        const productRows = Array.isArray(productResponse.data?.data) ? productResponse.data.data : [];

        setOrder(mapOrderDetailForView(orderRow, productRows));
      } catch (nextError) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to fetch order detail", nextError);
        setError("Không tải được chi tiết đơn hàng.");
        setOrder(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrderDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDownloadInvoice = () => {
    showToast({ message: `Đang chuẩn bị hóa đơn cho đơn hàng ${order?.code || ""}.` });
  };

  const handleTechSupport = () => {
    showToast({ message: "Bộ phận kỹ thuật sẽ hỗ trợ bạn sớm nhất.", type: "success" });
  };

  const handleEditOrderInfo = () => {
    showToast({
      message: "Vui lòng liên hệ CSKH nếu bạn cần thay đổi thông tin đơn hàng.",
      type: "error",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f6f8] font-sans text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {isLoading ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500 shadow-sm">
            Đang tải chi tiết đơn hàng...
          </section>
        ) : error || !order ? (
          <section className="rounded-2xl border border-rose-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-black text-slate-950">Không tìm thấy đơn hàng</h1>
            <p className="mt-3 text-sm font-medium text-slate-500">
              {error || "Đơn hàng bạn cần xem hiện không có dữ liệu."}
            </p>
          </section>
        ) : (
          <>
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
