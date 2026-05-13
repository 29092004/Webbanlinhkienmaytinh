export function RecentOrders() {
  const orders = [
    {
      id: "#EXO-9283",
      customer: "John Doe",
      initials: "JD",
      avatarColor: "bg-blue-100 text-blue-600",
      product: "Custom PC Build",
      status: "Shipped",
      statusColor: "bg-green-100 text-green-700",
      amount: "$4,299.00"
    },
    {
      id: "#EXO-9284",
      customer: "Alice Smith",
      initials: "AS",
      avatarColor: "bg-indigo-100 text-indigo-600",
      product: "4K Pro Monitor",
      status: "Processing",
      statusColor: "bg-blue-100 text-blue-700",
      amount: "$899.00"
    },
    {
      id: "#EXO-9285",
      customer: "Mike Knight",
      initials: "MK",
      avatarColor: "bg-amber-100 text-amber-600",
      product: "Mech Keyboard G2",
      status: "Pending",
      statusColor: "bg-amber-100 text-amber-700",
      amount: "$249.00"
    },
    {
      id: "#EXO-9286",
      customer: "Ray Long",
      initials: "RL",
      avatarColor: "bg-emerald-100 text-emerald-600",
      product: "Liquid Loop Kit",
      status: "Delivered",
      statusColor: "bg-gray-100 text-gray-700",
      amount: "$450.00"
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 tracking-tight mb-1">Recent Orders</h2>
          <p className="text-xs text-gray-500">Latest transactions from your customers</p>
        </div>
        <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
          View All
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="py-4 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
              <th className="py-4 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="py-4 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product</th>
              <th className="py-4 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-4 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 border-b border-gray-50 text-sm font-bold text-gray-900">{order.id}</td>
                <td className="py-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${order.avatarColor}`}>
                      {order.initials}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{order.customer}</span>
                  </div>
                </td>
                <td className="py-4 border-b border-gray-50 text-sm text-gray-500">{order.product}</td>
                <td className="py-4 border-b border-gray-50">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.statusColor}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 border-b border-gray-50 text-sm font-bold text-gray-900">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
