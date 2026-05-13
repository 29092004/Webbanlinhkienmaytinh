export function ShippingLogisticsForm() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-6">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Shipping & Logistics</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Weight (kg)</label>
          <input 
            type="number" 
            placeholder="0.00" 
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Dimensions (L x W x H cm)</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="L" 
              className="w-1/3 bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-center transition-all"
            />
            <input 
              type="number" 
              placeholder="W" 
              className="w-1/3 bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-center transition-all"
            />
            <input 
              type="number" 
              placeholder="H" 
              className="w-1/3 bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-center transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Shipping Class</label>
          <select className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none cursor-pointer">
            <option>Fragile / Express</option>
            <option>Standard</option>
            <option>Heavy / Bulky</option>
          </select>
        </div>
      </div>
    </div>
  );
}
