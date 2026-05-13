export function EditBasicInfo() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-8">Basic Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
          <input 
            type="text" 
            defaultValue="RTX 4090 Titanium Core"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">SKU</label>
          <input 
            type="text" 
            defaultValue="EC-GPU-4090T"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
        <input 
          type="text" 
          defaultValue="EXO CORE"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
        <textarea 
          rows="8"
          defaultValue={`# Premium Performance Engineering\n\nThe **RTX 4090 Titanium Core** represents the pinnacle of EXO CORE precision hardware. Featuring a triple-fan shroud with aero-optimized fins and high-tensile vapor chamber cooling.\n\n- **Clock Speed:** 2.65 GHz Boost`}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 font-mono focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all resize-y"
        ></textarea>
      </div>
    </div>
  );
}
