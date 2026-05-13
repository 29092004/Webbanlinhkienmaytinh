export function PricingForm() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-6">
      <h2 className="text-lg font-extrabold text-gray-900 mb-6 tracking-tight">Pricing & Taxation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Base Price ($)</label>
          <input 
            type="number" 
            placeholder="0.00" 
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Sale Price ($)</label>
          <input 
            type="number" 
            placeholder="0.00" 
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Cost per item ($)</label>
          <input 
            type="number" 
            placeholder="0.00" 
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
          <p className="text-[10px] text-gray-500 mt-1.5">Customers won't see this.</p>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Tax Rate (%)</label>
          <select className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none cursor-pointer">
            <option>Standard VAT (20%)</option>
            <option>Reduced VAT (5%)</option>
            <option>Zero-rated (0%)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
