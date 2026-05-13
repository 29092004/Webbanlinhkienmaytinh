export function RevenueAnalysis() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 mb-1 tracking-tight">Revenue Analysis</h2>
          <p className="text-xs text-gray-500">Sales performance over the selected period</p>
        </div>
        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
          <button className="px-3 py-1.5 text-xs font-bold bg-white text-gray-900 shadow-sm rounded-md">Daily</button>
          <button className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900">Weekly</button>
          <button className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900">Monthly</button>
        </div>
      </div>

      {/* Mock Chart Area */}
      <div className="flex-grow relative min-h-[250px]">
        {/* Y-axis grid lines (mock) */}
        <div className="absolute inset-0 flex flex-col justify-between pt-10 pb-6 pointer-events-none">
          <div className="w-full h-px bg-gray-50"></div>
          <div className="w-full h-px bg-gray-50"></div>
          <div className="w-full h-px bg-gray-50"></div>
        </div>

        {/* SVG Curve */}
        <div className="absolute inset-0 pt-10 pb-6 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
            <defs>
              <linearGradient id="blueGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path 
              d="M0,250 C150,250 250,120 400,120 C550,120 650,180 800,80 C900,10 950,50 1000,60 L1000,300 L0,300 Z" 
              fill="url(#blueGradient)" 
            />
            <path 
              d="M0,250 C150,250 250,120 400,120 C550,120 650,180 800,80 C900,10 950,50 1000,60" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="6" 
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-bold text-gray-400 uppercase">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  );
}
