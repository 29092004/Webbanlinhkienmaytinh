import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function OrderStatCard({ icon: Icon, title, value, trend, isNegative, badge }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-50/50 rounded-lg text-blue-600 border border-blue-100/50">
          <Icon className="w-5 h-5" />
        </div>
        
        {badge ? (
          <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
            {badge}
          </span>
        ) : (
          <div className={`flex items-center gap-1 text-xs font-bold ${isNegative ? 'text-rose-600' : 'text-emerald-600'}`}>
            <span>{trend}</span>
            {isNegative ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-bold text-gray-500 mb-1">{title}</h3>
        <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
