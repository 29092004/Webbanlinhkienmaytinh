import { ChevronDown } from "lucide-react";

export function RevenueAnalysis() {
  const data = [
    { label: "Thứ 2", value: 40 },
    { label: "Thứ 3", value: 65 },
    { label: "Thứ 4", value: 50 },
    { label: "Thứ 5", value: 85, highlight: true },
    { label: "Thứ 6", value: 55 },
    { label: "Thứ 7", value: 75 },
    { label: "Chủ Nhật", value: 95, highlight: true, special: true },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Biểu đồ doanh thu</h2>
          <p className="text-[12px] text-gray-500 font-medium">Số liệu thống kê 7 ngày gần nhất</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#f1f5f9] text-[12px] font-bold text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
          7 ngày qua <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-grow flex items-end justify-between gap-3 min-h-[240px] px-2 mb-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 h-full flex flex-col items-center gap-4 group">
            <div className="w-full flex-1 relative flex items-end">
              <div 
                className={`w-full rounded-lg transition-all duration-500 ease-out cursor-pointer ${
                  item.special 
                    ? 'bg-[#475569]' 
                    : item.highlight 
                      ? 'bg-[#0f172a]' 
                      : 'bg-[#f1f5f9] group-hover:bg-gray-200'
                }`}
                style={{ height: `${item.value}%` }}
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {item.value * 1234}k
                </div>
              </div>
            </div>
            <span className={`text-[11px] font-bold whitespace-nowrap ${item.special ? 'text-gray-900' : 'text-gray-400'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
