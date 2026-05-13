export function OrganizationForm() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-6">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Organization</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Category</label>
          <select className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none cursor-pointer">
            <option>Components</option>
            <option>Peripherals</option>
            <option>Systems</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Tags</label>
          <input 
            type="text" 
            placeholder="Add tag (press enter)" 
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all mb-2"
          />
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-bold text-gray-500 hover:text-gray-900 cursor-pointer transition-colors">#overclocked</span>
            <span className="text-[10px] font-bold text-gray-500 hover:text-gray-900 cursor-pointer transition-colors">#RGB</span>
            <span className="text-[10px] font-bold text-gray-500 hover:text-gray-900 cursor-pointer transition-colors">#high-perf</span>
          </div>
        </div>
      </div>
    </div>
  );
}
