import { Link } from "react-router-dom";
import { ArrowRight, Truck } from "lucide-react";

export default function OrderDetailsCard({
  orderCode = "#EXO-99234",
  paymentStatus = "Đã thanh toán",
  paymentMethodBadge = "VNPay",
  deliveryEstimate = "24 Tháng 5, 2026",
  shippingMethod = "Giao hàng hỏa tốc",
  onTrackOrder,
}) {
  return (
    <div className="space-y-6 w-full">
      {/* Detail info box */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm grid grid-cols-2 gap-y-6 gap-x-4">
        {/* Order code */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Mã đơn hàng
          </p>
          <p className="text-sm md:text-base font-bold tracking-[-0.01em] text-blue-600">
            {orderCode}
          </p>
        </div>

        {/* Payment status */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Thanh toán
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm md:text-base font-bold tracking-[-0.01em] text-gray-800">
              {paymentStatus}
            </span>
            {paymentMethodBadge && (
              <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-black tracking-wide">
                {paymentMethodBadge}
              </span>
            )}
          </div>
        </div>

        {/* Delivery estimate */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Dự kiến giao hàng
          </p>
          <p className="text-sm md:text-base font-bold tracking-[-0.01em] text-gray-800">
            {deliveryEstimate}
          </p>
        </div>

        {/* Shipping Method */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Phương thức
          </p>
          <p className="text-sm md:text-base font-bold tracking-[-0.01em] text-gray-800">
            {shippingMethod}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <Link
          to="/products"
          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-6 rounded-lg text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-sm transition uppercase tracking-wide"
        >
          <span>Tiếp tục mua sắm</span>
          <ArrowRight className="size-4" />
        </Link>
        <button
          type="button"
          onClick={onTrackOrder}
          className="bg-white hover:bg-slate-50 text-gray-800 border border-slate-200 font-extrabold py-3.5 px-6 rounded-lg text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs transition uppercase tracking-wide"
        >
          <Truck className="size-4 text-gray-500" />
          <span>Theo dõi đơn hàng</span>
        </button>
      </div>
    </div>
  );
}
