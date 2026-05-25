import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export function RecentOrders({ orders = [] }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="mb-1 text-lg font-bold text-gray-900">Đơn hàng gần đây</h2>
          <p className="text-[12px] font-medium text-gray-500">Dữ liệu cập nhật theo thời gian thực</p>
        </div>
        <Link to="/admin/orders" className="text-[13px] font-bold text-gray-600 transition-colors hover:text-blue-600">
          Xem tất cả đơn hàng
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full border-collapse text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-gray-400">
              <th className="pb-4 font-bold">Mã đơn hàng</th>
              <th className="pb-4 font-bold">Khách hàng</th>
              <th className="pb-4 font-bold">Sản phẩm</th>
              <th className="pb-4 text-center font-bold">Tổng tiền</th>
              <th className="pb-4 text-center font-bold">Trạng thái</th>
              <th className="pb-4 text-right font-bold">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="group transition-colors hover:bg-gray-50/50">
                  <td className="py-4 text-[13px] font-bold text-gray-900">{order.orderCode}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-gray-200 text-[10px] font-bold text-gray-600 shadow-sm transition-colors group-hover:border-blue-200">
                        {order.initials}
                      </div>
                      <span className="text-[13px] font-semibold text-gray-700">{order.customer}</span>
                    </div>
                  </td>
                  <td className="max-w-[200px] truncate py-4 text-[13px] text-gray-500">{order.product}</td>
                  <td className="py-4 text-center text-[13px] font-bold text-gray-900">{order.amount}</td>
                  <td className="py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all ${order.statusColor}`}>
                      <div className="h-1 w-1 rounded-full bg-current" />
                      {order.statusLabel}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      to={`/order/${order.id}`}
                      className="inline-flex rounded-lg p-2 text-gray-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm font-medium text-slate-500">
                  Chưa có đơn hàng nào trong hệ thống.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
