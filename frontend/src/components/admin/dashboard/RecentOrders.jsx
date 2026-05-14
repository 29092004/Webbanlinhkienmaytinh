import { Eye } from "lucide-react";

export function RecentOrders() {
  const orders = [
    {
      id: "#ORD-2024-001",
      customer: "Nguyễn Hoàng",
      initials: "NH",
      product: "NVIDIA RTX 4090...",
      amount: "54.500.000đ",
      status: "Hoàn thành",
      statusColor: "bg-emerald-100 text-emerald-600 border-emerald-200"
    },
    {
      id: "#ORD-2024-002",
      customer: "Trần Anh",
      initials: "TA",
      product: "Intel Core i9-14900K...",
      amount: "15.900.000đ",
      status: "Đang xử lý",
      statusColor: "bg-blue-100 text-blue-600 border-blue-200"
    },
    {
      id: "#ORD-2024-003",
      customer: "Lê Minh",
      initials: "LM",
      product: "Asus ROG Maximus Z790...",
      amount: "18.200.000đ",
      status: "Đang giao",
      statusColor: "bg-amber-100 text-amber-600 border-amber-200"
    },
    {
      id: "#ORD-2024-004",
      customer: "Phạm Thanh",
      initials: "PT",
      product: "G.Skill Trident Z5 RGB...",
      amount: "4.500.000đ",
      status: "Đã hủy",
      statusColor: "bg-rose-100 text-rose-600 border-rose-200"
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Đơn hàng gần đây</h2>
          <p className="text-[12px] text-gray-500 font-medium">Dữ liệu cập nhật theo thời gian thực</p>
        </div>
        <button className="text-[13px] font-bold text-gray-600 hover:text-blue-600 transition-colors">
          Xem tất cả đơn hàng
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="text-gray-400 text-[11px] uppercase tracking-wider">
              <th className="pb-4 font-bold">Mã đơn hàng</th>
              <th className="pb-4 font-bold">Khách hàng</th>
              <th className="pb-4 font-bold">Sản phẩm</th>
              <th className="pb-4 font-bold text-center">Tổng tiền</th>
              <th className="pb-4 font-bold text-center">Trạng thái</th>
              <th className="pb-4 font-bold text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order, idx) => (
              <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                <td className="py-4 text-[13px] font-bold text-gray-900">{order.id}</td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 border border-white shadow-sm group-hover:border-blue-200 transition-colors">
                      {order.initials}
                    </div>
                    <span className="text-[13px] text-gray-700 font-semibold">{order.customer}</span>
                  </div>
                </td>
                <td className="py-4 text-[13px] text-gray-500 max-w-[200px] truncate">{order.product}</td>
                <td className="py-4 text-[13px] font-bold text-gray-900 text-center">{order.amount}</td>
                <td className="py-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${order.statusColor}`}>
                    <div className="w-1 h-1 rounded-full bg-current"></div>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
