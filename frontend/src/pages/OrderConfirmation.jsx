import { useEffect, useState } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { useNavigate, useSearchParams } from "react-router-dom";

import OrderSuccessHeader from "@/components/order/OrderSuccessHeader";
import OrderDetailsCard from "@/components/order/OrderDetailsCard";
import OrderSummaryCard from "@/components/order/OrderSummaryCard";
import { api } from "@/lib/api";
import { mapOrderConfirmationForView } from "@/lib/orderMappers";
import { showToast } from "@/lib/toast";

const LAST_ORDER_SNAPSHOT_KEY = "last_order_snapshot";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderView, setOrderView] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadConfirmationOrder = async () => {
      try {
        setIsLoading(true);
        const orderId = searchParams.get("orderId");
        const storedSnapshot = sessionStorage.getItem(LAST_ORDER_SNAPSHOT_KEY);
        const parsedSnapshot = storedSnapshot ? JSON.parse(storedSnapshot) : null;

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

        setOrderView(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to load order confirmation", error);
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
        <OrderSuccessHeader />

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
