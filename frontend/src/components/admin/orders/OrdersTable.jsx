import { Search, Calendar, ChevronDown, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const ORDERS_DATA = [
  {
    id: "#EXO-1092",
    date: "Nov 24,\n14:32",
    customerName: "Marcus Thorne",
    customerEmail: "m.thorne@vortex.com",
    total: "$1,240.00",
    paymentStatus: "PAID",
    fulfillmentStatus: "UNFULFILLED",
    items: 4,
  },
  {
    id: "#EXO-1091",
    date: "Nov 24,\n12:15",
    customerName: "Sarah Chen",
    customerEmail: "s.chen@quantum.io",
    total: "$892.50",
    paymentStatus: "PAID",
    fulfillmentStatus: "FULFILLED",
    items: 2,
  },
  {
    id: "#EXO-1090",
    date: "Nov 24,\n09:45",
    customerName: "Elena Rodriguez",
    customerEmail: "elena.r@nebula.net",
    total: "$4,200.00",
    paymentStatus: "PENDING",
    fulfillmentStatus: "UNFULFILLED",
    items: 1,
  },
  {
    id: "#EXO-1089",
    date: "Nov 23,\n18:22",
    customerName: "David Miller",
    customerEmail: "dmiller@techcorp.com",
    total: "$156.00",
    paymentStatus: "PARTIALLY REFUNDED",
    fulfillmentStatus: "FULFILLED",
    items: 3,
  },
  {
    id: "#EXO-1088",
    date: "Nov 23,\n15:10",
    customerName: "James Wilson",
    customerEmail: "j.wilson@freelance.org",
    total: "$98.00",
    paymentStatus: "CANCELED",
    fulfillmentStatus: "CANCELED",
    items: 1,
  },
];

const TABS = ["All", "Unfulfilled", "Unpaid", "Open", "Closed", "Local delivery"];

const PaymentBadge = ({ status }) => {
  const styles = {
    "PAID": "bg-emerald-100 text-emerald-800",
    "PENDING": "bg-amber-100 text-amber-800",
    "PARTIALLY REFUNDED": "bg-gray-100 text-gray-800",
    "CANCELED": "bg-rose-100 text-rose-800",
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider whitespace-nowrap ${styles[status]}`}>
      {status}
    </span>
  );
};

const FulfillmentBadge = ({ status }) => {
  const styles = {
    "FULFILLED": "bg-emerald-100 text-emerald-800",
    "UNFULFILLED": "bg-amber-100 text-amber-800",
    "CANCELED": "bg-rose-100 text-rose-800",
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider whitespace-nowrap ${styles[status]}`}>
      {status}
    </span>
  );
};

export function OrdersTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-6 px-6 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map((tab, idx) => (
          <button 
            key={tab}
            className={`py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              idx === 0 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center gap-3 bg-gray-50/50">
        <div className="relative flex-grow min-w-[200px] w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Filter orders..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all bg-white"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <Calendar className="w-4 h-4 text-gray-500" /> Date range
          </button>
          <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors min-w-[120px] whitespace-nowrap">
            Status <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
            Payment status
          </button>
          <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
            Fulfillment status
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fulfillment</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ORDERS_DATA.map((order, i) => (
              <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <Link to="#" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">{order.id}</Link>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 whitespace-pre-line">{order.date}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{order.customerName}</span>
                    <span className="text-xs text-gray-500">{order.customerEmail}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-gray-900">{order.total}</span>
                </td>
                <td className="px-6 py-4">
                  <PaymentBadge status={order.paymentStatus} />
                </td>
                <td className="px-6 py-4">
                  <FulfillmentBadge status={order.fulfillmentStatus} />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{order.items} {order.items === 1 ? 'item' : 'items'}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-gray-500 font-medium">Showing 1 to 5 of 2,543 orders</span>
        <div className="flex items-center gap-1.5">
          <button className="p-2 rounded border border-gray-200 bg-white text-gray-400 hover:text-gray-900 disabled:opacity-50 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <button className="min-w-[32px] h-8 rounded bg-blue-600 text-white text-sm font-bold transition-colors">1</button>
          <button className="min-w-[32px] h-8 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-bold transition-colors">2</button>
          <button className="min-w-[32px] h-8 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-bold transition-colors">3</button>
          <span className="text-gray-400 px-1">...</span>
          <button className="min-w-[40px] h-8 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-bold transition-colors">509</button>
          <button className="p-2 rounded border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
