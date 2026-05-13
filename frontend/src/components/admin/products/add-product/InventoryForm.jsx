export function InventoryForm() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-6">
      <h2 className="text-lg font-extrabold text-gray-900 mb-6 tracking-tight">Inventory Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Stock Quantity</label>
          <input 
            type="number" 
            placeholder="0" 
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Low Stock Threshold</label>
          <input 
            type="number" 
            placeholder="5" 
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
        <span className="text-sm text-gray-700 font-medium select-none">Track stock quantity for this product</span>
      </label>
    </div>
  );
}
