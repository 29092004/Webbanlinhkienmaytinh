import { TrendingUp, TrendingDown } from "lucide-react";

export function StatCard({ title, value, trend, trendType, icon, color }) {
  // Map colors for the dynamic styles
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      chartBars: ["bg-blue-100", "bg-blue-100", "bg-blue-200", "bg-blue-200", "bg-blue-600"]
    },
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      chartBars: ["bg-indigo-100", "bg-indigo-100", "bg-indigo-200", "bg-indigo-200", "bg-indigo-600"]
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      chartBars: ["bg-amber-100", "bg-amber-100", "bg-amber-200", "bg-amber-200", "bg-amber-600"]
    },
    rose: {
      bg: "bg-rose-50",
      text: "text-rose-600",
      chartBars: ["bg-rose-100", "bg-rose-100", "bg-rose-200", "bg-rose-200", "bg-rose-600"]
    }
  };

  const theme = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow h-48">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${theme.bg} ${theme.text}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${
          trendType === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
        }`}>
          {trendType === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </div>
      </div>

      <div>
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</h4>
        <div className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</div>
      </div>

      {/* Mini Mock Chart */}
      <div className="flex items-end gap-1 mt-4 h-8">
        {theme.chartBars.map((bgClass, i) => {
          // Calculate heights that generally go up, or down if it's the rose one
          let height = '20%';
          if (trendType === 'up') {
            height = `${(i + 1) * 20}%`;
          } else {
            height = `${100 - (i * 15)}%`;
          }
          return (
            <div 
              key={i} 
              className={`flex-1 rounded-t-sm ${bgClass}`}
              style={{ height }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
