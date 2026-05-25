export default function CheckoutSummary({
  cartItems = [],
  itemsSubtotal,
  shippingCost,
  vat,
  voucherDiscount,
  totalPayment,
  onOrderSubmit,
  isSubmitting,
  couponCode,
  onCouponCodeChange,
  onApplyCoupon,
  couponApplied,
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-sm space-y-6">
      <h3 className="font-extrabold text-slate-800 text-xl border-b border-slate-50 pb-4">
        Tóm tắt đơn hàng
      </h3>

      {/* Product Items List */}
      <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 items-center">
            {/* Image */}
            <div className="size-16 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden p-1.5 flex items-center justify-center shrink-0">
              <img src={item.image} alt={item.name} className="object-cover w-full h-full rounded-md" />
            </div>
            {/* Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
              <p className="text-xs font-bold text-slate-400 mt-1">Số lượng: {String(item.quantity).padStart(2, "0")}</p>
              <p className="text-red-600 font-extrabold text-sm mt-1">
                {item.price.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="border-t border-slate-50 pt-5 space-y-3.5 font-semibold text-sm text-slate-500">
        <div className="flex justify-between items-center">
          <span>Tạm tính</span>
          <span className="text-slate-800 text-base">{itemsSubtotal.toLocaleString("vi-VN")}đ</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Phí vận chuyển</span>
          <span className="text-slate-900 font-bold text-base">
            {shippingCost === 0 ? "Miễn phí" : `${shippingCost.toLocaleString("vi-VN")}đ`}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Thuế VAT (10%)</span>
          <span className="text-slate-800 text-base">{vat.toLocaleString("vi-VN")}đ</span>
        </div>

        {voucherDiscount > 0 && (
          <div className="flex justify-between items-center text-red-500">
            <span>Giảm giá</span>
            <span className="text-base">-{voucherDiscount.toLocaleString("vi-VN")}đ</span>
          </div>
        )}

        <div className="border-t border-slate-50 pt-4 flex justify-between items-center">
          <span className="text-lg font-extrabold text-slate-800">Tổng cộng</span>
          <span className="text-[30px] font-black text-red-600 tracking-tight">
            {totalPayment.toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>

      {/* Promo Coupon Form */}
      <div className="space-y-2 pt-5 border-t border-slate-100">
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Mã giảm giá
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => onCouponCodeChange(e.target.value)}
            disabled={couponApplied}
            placeholder="EXOCORE2024"
            className="flex-1 bg-slate-50 border border-slate-150 rounded-xl py-3 px-4 text-sm font-bold text-slate-800 uppercase focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={onApplyCoupon}
            disabled={couponApplied || !couponCode.trim()}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-3 text-sm font-bold transition-colors disabled:opacity-55 cursor-pointer"
          >
            {couponApplied ? "Đã dùng" : "Áp dụng"}
          </button>
        </div>
        {couponApplied && (
          <p className="text-xs font-bold text-red-600">
            ✓ Đã áp dụng mã giảm giá 10%!
          </p>
        )}
      </div>

      {/* Button & Terms */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={onOrderSubmit}
          disabled={isSubmitting}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-extrabold py-4 px-4 rounded-xl text-sm md:text-base tracking-wide uppercase transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Đang xử lý..." : "Đặt hàng ngay"}
        </button>

        <p className="text-xs font-semibold text-slate-400 text-center leading-normal">
          Bằng cách đặt hàng, bạn đồng ý với các{" "}
          <a href="#" className="text-red-600 hover:underline">
            Điều khoản dịch vụ
          </a>{" "}
          của chúng tôi.
        </p>
      </div>
    </div>
  );
}

