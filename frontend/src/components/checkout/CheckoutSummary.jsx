import { ChevronDown, TicketPercent } from "lucide-react";

export default function CheckoutSummary({
  cartItems = [],
  itemsSubtotal,
  shippingCost,
  voucherDiscount,
  totalPayment,
  onOrderSubmit,
  isSubmitting,
  vouchers = [],
  selectedVoucherId = "",
  onSelectVoucher,
  selectedVoucher = null,
  isLoadingVouchers = false,
  orderAmountBeforeDiscount = 0,
  voucherProgressHint = "",
  selectedMethod = "cod",
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-sm space-y-6">
      <h3 className="border-b border-slate-50 pb-4 text-sm font-bold text-slate-900">
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
              <h4 className="truncate text-sm font-black text-slate-950">{item.name}</h4>
              <p className="mt-1 text-xs font-semibold text-slate-600">Số lượng: {String(item.quantity).padStart(2, "0")}</p>
              <p className="text-red-600 font-extrabold text-sm mt-1">
                {item.price.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="border-t border-slate-50 pt-5 space-y-3.5 text-sm font-semibold text-slate-700">
        <div className="flex justify-between items-center">
          <span className="font-bold text-slate-900">Tạm tính</span>
          <span className="text-base font-bold text-slate-950">{itemsSubtotal.toLocaleString("vi-VN")}đ</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-slate-900">Phí vận chuyển</span>
          <span className="text-slate-900 font-bold text-base">
            {shippingCost === 0 ? "Miễn phí" : `${shippingCost.toLocaleString("vi-VN")}đ`}
          </span>
        </div>

        {voucherDiscount > 0 && (
          <div className="flex justify-between items-center text-red-500">
            <span>Giảm giá</span>
            <span className="text-base">-{voucherDiscount.toLocaleString("vi-VN")}đ</span>
          </div>
        )}

        <div className="border-t border-slate-50 pt-4 flex justify-between items-center">
          <span className="text-sm font-bold text-slate-900">Tổng cộng</span>
          <span className="text-[30px] font-black text-red-600 tracking-tight">
            {totalPayment.toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>

      {/* Voucher Selection */}
      <div className="space-y-2 pt-5 border-t border-slate-100">
        <label className="block text-sm font-bold text-slate-900">
          Voucher giảm giá
        </label>
        {isLoadingVouchers ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
            Đang tải danh sách voucher...
          </div>
        ) : vouchers.length > 0 ? (
          <>
            <div className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-2 shadow-sm transition focus-within:border-red-300 focus-within:shadow-[0_10px_30px_rgba(239,68,68,0.08)]">
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <TicketPercent className="size-4.5" />
                </div>
                <select
                  value={selectedVoucherId}
                  onChange={(event) => onSelectVoucher?.(event.target.value)}
                  className="h-16 w-full appearance-none rounded-xl border-0 bg-transparent pl-16 pr-14 text-sm font-semibold text-slate-800 outline-none"
                >
                  <option value="">Không áp dụng voucher</option>
                  {vouchers.map((voucher) => (
                    <option key={voucher.id} value={voucher.id} disabled={!voucher.isEligible}>
                      {voucher.summaryLabel}
                      {!voucher.isEligible ? " - Chưa đủ điều kiện" : ""}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <ChevronDown className="size-4" />
                </div>
              </div>
              <div className="px-3 pb-2 pt-1 text-[11px] font-medium text-slate-500">
                Chọn voucher phù hợp theo tổng đơn hàng hiện tại.
              </div>
            </div>
            {selectedVoucher ? (
              <p className="text-xs font-bold text-red-600">
                ✓ Đã chọn voucher {selectedVoucher.voucherCode}.
              </p>
            ) : null}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
            Chưa có voucher phù hợp cho đơn hàng {orderAmountBeforeDiscount.toLocaleString("vi-VN")}đ.
          </div>
        )}
        {voucherProgressHint ? (
          <p className="text-xs font-medium text-amber-600">{voucherProgressHint}</p>
        ) : null}
      </div>

      {/* Button & Terms */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={onOrderSubmit}
          disabled={isSubmitting}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-extrabold py-4 px-4 rounded-xl text-sm md:text-base tracking-wide uppercase transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Đang xử lý..." : selectedMethod === "vnpay" ? "Thanh toán với VNPay" : "Đặt hàng ngay"}
        </button>

        <p className="text-center text-xs font-semibold leading-normal text-slate-600">
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

