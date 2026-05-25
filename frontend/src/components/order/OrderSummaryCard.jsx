export default function OrderSummaryCard({
  items = [],
  subtotal = 53700000,
  shippingCost = 0,
  total = 53700000,
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-6">
      <h3 className="font-bold tracking-[-0.01em] text-gray-900 text-base md:text-lg border-b border-slate-100 pb-3">
        Tóm tắt đơn hàng
      </h3>

      {/* Item list */}
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center">
            {/* Image */}
            <div className="size-16 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-1 shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="object-cover w-full h-full rounded"
              />
            </div>
            
            {/* Text details */}
            <div className="flex-1 space-y-1">
              <h4 className="font-bold tracking-[-0.01em] text-gray-900 text-xs md:text-sm line-clamp-2 leading-snug">
                {item.name}
              </h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                Số lượng: {String(item.quantity).padStart(2, "0")}
              </p>
              <p className="text-xs md:text-sm font-bold tracking-[-0.01em] text-red-600">
                {item.price.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Math breakdown */}
      <div className="border-t border-slate-100 pt-4 space-y-3 font-semibold text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <span>Tạm tính</span>
          <span className="text-gray-900 font-bold">
            {subtotal.toLocaleString("vi-VN")}đ
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Phí vận chuyển</span>
          <span className="text-blue-600 font-bold tracking-[-0.01em]">
            {shippingCost === 0 ? "Miễn phí" : `${shippingCost.toLocaleString("vi-VN")}đ`}
          </span>
        </div>
      </div>

      {/* Total row */}
      <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
        <span className="text-sm font-bold tracking-[-0.01em] text-gray-800">Tổng cộng</span>
        <span className="text-lg md:text-xl font-bold text-red-600 tracking-[-0.01em]">
          {total.toLocaleString("vi-VN")}đ
        </span>
      </div>
    </div>
  );
}
