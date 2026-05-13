import { BarChart2, RefreshCcw } from "lucide-react";

export function CategoryQuickStats() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-4">QUICK STATS</h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded">
              <BarChart2 className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-gray-700">Active Products</span>
          </div>
          <span className="text-xl font-extrabold text-blue-700">142</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-200 text-gray-500 rounded">
              <RefreshCcw className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-gray-700">Last Updated</span>
          </div>
          <span className="text-sm font-bold text-gray-900">2 days ago</span>
        </div>
      </div>

      <button type="button" className="w-full py-2.5 border border-blue-200 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors">
        View All Products
      </button>
    </div>
  );
}
