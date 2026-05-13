export function EditPricing() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] h-full">
      <h2 className="text-xl font-bold text-gray-900 mb-8">Pricing & Taxation</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Base Price ($)</label>
          <input 
            type="text" 
            defaultValue="1,999.00"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Sale Price ($)</label>
          <input 
            type="text" 
            defaultValue="1,899.00"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Tax Rate (%)</label>
          <input 
            type="number" 
            defaultValue="20"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
