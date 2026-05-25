import { Link } from "react-router-dom";

export function CartSummary({
  subtotal,
  vat,
  total,
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-4">
      <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-50 pb-2">
        Tóm tắt đơn hàng
      </h3>

      {/* Breakdown details */}
      <div className="space-y-2.5 font-semibold text-xs text-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-slate-900">Tạm tính</span>
          <span className="text-slate-800">{subtotal.toLocaleString("vi-VN")}đ</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-900">Phí vận chuyển</span>
          <span className="text-slate-900 font-bold">Miễn phí</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-900">Thuế VAT (10%)</span>
          <span className="text-slate-800">{vat.toLocaleString("vi-VN")}đ</span>
        </div>
      </div>

      {/* Total Payment Row */}
      <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-slate-800">Tổng cộng</span>
        <span className="text-[19px] font-black tracking-tight text-red-600">{total.toLocaleString("vi-VN")}đ</span>
      </div>

      {/* Checkout CTA */}
      <Link
        to="/checkout"
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors uppercase text-center cursor-pointer"
      >
        Thanh toán ngay →
      </Link>
    </div>
  );
}

