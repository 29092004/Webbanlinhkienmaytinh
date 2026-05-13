import { CheckCircle2 } from "lucide-react";

export function EditInventory() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] h-full">
      <h2 className="text-xl font-bold text-gray-900 mb-8">Inventory</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
          <input 
            type="number" 
            defaultValue="42"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Low Stock Threshold</label>
          <input 
            type="number" 
            defaultValue="10"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-blue-700">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-bold">In Stock</span>
          </div>
          <span className="text-xs font-bold text-blue-600">42 units left</span>
        </div>
      </div>
    </div>
  );
}
