export function WorkReminder({ reminders }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-[#0f172a] p-6 text-white shadow-lg shadow-blue-900/10">
      <div className="relative z-10">
       
        <p className="mb-6 text-[12px] leading-relaxed text-gray-400">
          Bạn có <span className="font-bold text-blue-400">{reminders?.pendingOrders ?? 0} đơn hàng</span> chờ xác nhận,
          <span className="font-bold text-blue-400"> {reminders?.shippingOrders ?? 0} đơn</span> đang giao và
          <span className="font-bold text-blue-400"> {reminders?.lowStockCount ?? 0} sản phẩm</span> sắp chạm ngưỡng tồn kho thấp.
        </p>

        <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-[12px] font-medium text-slate-200">
          Hết hàng hiện tại: <span className="font-bold text-white">{reminders?.outOfStockCount ?? 0} sản phẩm</span>
        </div>
      </div>

      <div className="absolute -mt-16 -mr-16 right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition-colors group-hover:bg-blue-500/20" />
      <div className="absolute -mb-12 -ml-12 bottom-0 left-0 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl transition-colors group-hover:bg-indigo-500/20" />
    </div>
  );
}
