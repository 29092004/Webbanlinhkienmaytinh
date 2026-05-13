import { TrendingUp, TrendingDown } from "lucide-react";

export function CustomerStatCard({ icon: Icon, title, value, trend, isNegative, iconColorClass, trendColorClass }) {
  // Determine text color based on background color class passed
  let trendTextClass = 'text-emerald-700';
  if (isNegative) {
    trendTextClass = 'text-rose-700';
  } else if (trendColorClass.includes('purple')) {
    trendTextClass = 'text-purple-700';
  }
  
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-start justify-between mb-6">
        <div className={`p-3 rounded-lg ${iconColorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${trendColorClass} ${trendTextClass}`}>
          {!isNegative && trend.includes('%') && <TrendingUp className="w-3 h-3" />}
          {isNegative && trend.includes('%') && <TrendingDown className="w-3 h-3" />}
          <span>{trend}</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
