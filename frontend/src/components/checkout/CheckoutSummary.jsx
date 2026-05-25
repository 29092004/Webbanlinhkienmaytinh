export default function CheckoutSummary({
  cartItems = [],
  itemsSubtotal,
  shippingCost,
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
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-5">
      <h3 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3">
        Tóm tắt đơn hàng
      </h3>

      {/* Product Items List */}
      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            {/* Image */}
            <div className="size-14 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden p-1.5 flex items-center justify-center shrink-0">
              <img src={item.image} alt={item.name} className="object-cover w-full h-full rounded-md" />
            </div>
            {/* Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-800 text-[12px] truncate">{item.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">Số lượng: {String(item.quantity).padStart(2, "0")}</p>
              <p className="text-red-600 font-extrabold text-[12px] mt-0.5">
                {item.price.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="border-t border-slate-50 pt-4 space-y-2.5 font-semibold text-xs text-slate-500">
        <div className="flex justify-between items-center">
          <span>Tạm tính</span>
          <span className="text-slate-800">{itemsSubtotal.toLocaleString("vi-VN")}đ</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Phí vận chuyển</span>
          <span className="text-blue-600 font-bold">
            {shippingCost === 0 ? "Miễn phí" : `${shippingCost.toLocaleString("vi-VN")}đ`}
          </span>
        </div>

        {voucherDiscount > 0 && (
          <div className="flex justify-between items-center text-red-500">
            <span>Giảm giá</span>
            <span>-{voucherDiscount.toLocaleString("vi-VN")}đ</span>
          </div>
        )}

        <div className="border-t border-slate-50 pt-3 flex justify-between items-center">
          <span className="text-sm font-extrabold text-slate-800">Tổng cộng</span>
          <span className="text-[19px] font-black text-red-600 tracking-tight">
            {totalPayment.toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>

      {/* Promo Coupon Form */}
      <div className="space-y-1.5 pt-4 border-t border-slate-100">
        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
          Mã giảm giá
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => onCouponCodeChange(e.target.value)}
            disabled={couponApplied}
            placeholder="EXOCORE2024"
            className="flex-1 bg-slate-50 border border-slate-150 rounded-xl py-1.5 px-3 text-[11px] font-bold text-slate-800 uppercase focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={onApplyCoupon}
            disabled={couponApplied || !couponCode.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-3 py-1.5 text-[11px] font-bold transition-colors disabled:opacity-55 cursor-pointer"
          >
            {couponApplied ? "Đã dùng" : "Áp dụng"}
          </button>
        </div>
        {couponApplied && (
          <p className="text-[9px] font-bold text-emerald-600">
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
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs md:text-sm tracking-wide uppercase transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Đang xử lý..." : "Đặt hàng ngay"}
        </button>

        <p className="text-[10px] font-semibold text-slate-400 text-center leading-normal">
          Bằng cách đặt hàng, bạn đồng ý với các{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Điều khoản dịch vụ
          </a>{" "}
          của chúng tôi.
        </p>
      </div>
    </div>
  );
}

