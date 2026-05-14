import { TrendingUp, TrendingDown } from "lucide-react";

export function StatCard({ title, value, trend, trendType, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div className="p-3 bg-gray-50 rounded-xl text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${
          trendType === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
        }`}>
          {trendType === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </div>
      </div>

      <div className="mt-5">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</h4>
        <div className="text-2xl font-bold text-gray-900 tracking-tight">{value}</div>
      </div>
      
      {/* Subtle background decoration */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
        {icon && <div className="scale-[3]">{icon}</div>}
      </div>
    </div>
  );
}
