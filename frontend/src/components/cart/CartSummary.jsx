import { Link } from "react-router-dom";

export function CartSummary({
  subtotal,
  vat,
  total,
  discountAmount = 0,
  couponCode,
  onCouponCodeChange,
  onApplyCoupon,
  couponApplied,
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-6">
      <h3 className="font-extrabold text-gray-900 text-base border-b border-slate-100 pb-3">
        Tóm tắt đơn hàng
      </h3>

      {/* Breakdown details */}
      <div className="space-y-3 font-semibold text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <span>Tạm tính ({couponApplied ? "sau KM" : "gốc"})</span>
          <span className="text-gray-900">{subtotal.toLocaleString("vi-VN")}đ</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Phí vận chuyển</span>
          <span className="text-blue-600 font-bold">Miễn phí</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Thuế VAT (10%)</span>
          <span className="text-gray-900">{vat.toLocaleString("vi-VN")}đ</span>
        </div>
        {couponApplied && discountAmount > 0 && (
          <div className="flex items-center justify-between text-red-600">
            <span>Mã giảm giá áp dụng</span>
            <span>-{discountAmount.toLocaleString("vi-VN")}đ</span>
          </div>
        )}
      </div>

      {/* Promo Coupon Form */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Mã giảm giá
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => onCouponCodeChange(e.target.value)}
            disabled={couponApplied}
            placeholder="EXOCORE2024"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-bold text-gray-800 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={onApplyCoupon}
            disabled={couponApplied || !couponCode.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 text-xs font-bold transition-colors disabled:opacity-55"
          >
            {couponApplied ? "Đã dùng" : "Áp dụng"}
          </button>
        </div>
        {couponApplied && (
          <p className="text-[10px] font-bold text-emerald-600">
            ✓ Đã áp dụng thành công mã giảm giá giảm 10%!
          </p>
        )}
      </div>

      {/* Total Gradient Box */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-90">
              Tổng thanh toán
            </span>
            <span className="bg-white/20 text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wide">
              TIẾT KIỆM
            </span>
          </div>
          <span className="block text-2xl font-black mt-2 tracking-tight">
            {total.toLocaleString("vi-VN")}đ
          </span>
        </div>
        {/* Background decorative blob */}
        <div className="absolute -bottom-6 -right-6 bg-white/10 size-20 rounded-full blur-lg" />
      </div>

      {/* Checkout CTA */}
      <Link
        to="/checkout"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors uppercase text-center"
      >
        Thanh toán ngay →
      </Link>
    </div>
  );
}
