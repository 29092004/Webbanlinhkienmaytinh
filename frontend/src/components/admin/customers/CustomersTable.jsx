import { Filter, ChevronLeft, ChevronRight } from "lucide-react";

const CUSTOMERS_DATA = [
  {
    name: "Adrian Thorne",
    email: "athorne@techspec.io",
    avatar: "https://i.pravatar.cc/150?u=adrian",
    isOnline: true,
    registrationTime: "3 months ago",
    registrationDate: "Oct 24, 2023",
    orders: "14 Orders",
    ltv: "$42,900 LTV",
    status: "ACTIVE",
  },
  {
    name: "Elena Rodriguez",
    email: "elena.r@performance.pc",
    avatar: "https://i.pravatar.cc/150?u=elena",
    isOnline: true,
    registrationTime: "2 months ago",
    registrationDate: "Dec 02, 2023",
    orders: "8 Orders",
    ltv: "$28,150 LTV",
    status: "ACTIVE",
  },
  {
    name: "Julian Voss",
    email: "voss.tech@gmail.com",
    avatar: "https://i.pravatar.cc/150?u=julian",
    isOnline: false,
    registrationTime: "1 month ago",
    registrationDate: "Jan 14, 2024",
    orders: "3 Orders",
    ltv: "$12,400 LTV",
    status: "INACTIVE",
  },
  {
    name: "Sarah Jenkins",
    email: "s.jenkins@core.dev",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    isOnline: true,
    registrationTime: "2 weeks ago",
    registrationDate: "Feb 28, 2024",
    orders: "22 Orders",
    ltv: "$89,200 LTV",
    status: "VIP MEMBER",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    "ACTIVE": "bg-emerald-100 text-emerald-800",
    "INACTIVE": "bg-gray-100 text-gray-800",
    "VIP MEMBER": "bg-purple-500 text-white", // Solid purple for VIP
  };
  return (
    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider whitespace-nowrap ${styles[status]}`}>
      {status}
    </span>
  );
};

export function CustomersTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Header / Filters */}
      <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900">Customer Directory</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 bg-gray-50/50">
            <span className="text-xs font-bold text-gray-500 uppercase">Role:</span>
            <span className="text-xs font-bold text-gray-900">All Users</span>
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 bg-gray-50/50">
            <span className="text-xs font-bold text-gray-500 uppercase">Status:</span>
            <span className="text-xs font-bold text-gray-900">Active Only</span>
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-900 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User Profile</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Registration</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Orders & LTV</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {CUSTOMERS_DATA.map((customer, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={customer.avatar} alt={customer.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${customer.isOnline ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{customer.name}</span>
                      <span className="text-xs text-gray-500">{customer.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{customer.registrationTime}</span>
                    <span className="text-xs text-gray-500">{customer.registrationDate}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-blue-600">{customer.orders}</span>
                    <span className="text-xs text-gray-500">{customer.ltv}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={customer.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  {/* Empty actions area in mockup */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-gray-500">Showing 4 of 1,284 customers</span>
        <div className="flex items-center gap-1.5">
          <button className="p-2 rounded border border-gray-200 bg-white text-gray-400 hover:text-gray-900 disabled:opacity-50 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <button className="min-w-[32px] h-8 rounded bg-blue-600 text-white text-sm font-bold transition-colors">1</button>
          <button className="min-w-[32px] h-8 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-bold transition-colors">2</button>
          <button className="min-w-[32px] h-8 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-bold transition-colors">3</button>
          <span className="text-gray-400 px-1">...</span>
          <button className="min-w-[40px] h-8 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-bold transition-colors">128</button>
          <button className="p-2 rounded border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
