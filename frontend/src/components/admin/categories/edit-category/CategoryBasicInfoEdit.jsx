export function CategoryBasicInfoEdit() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Category Name</label>
          <input 
            type="text" 
            defaultValue="Graphics Cards" 
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Slug</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-gray-500 text-sm">exocore.io/category/</span>
            <input 
              type="text" 
              defaultValue="gpu" 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all bg-white"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
        <textarea 
          rows={4}
          defaultValue="High-performance GPUs for gaming and professional workloads. Includes both NVIDIA and AMD current-gen architectures with support for ray tracing and AI acceleration." 
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all bg-white resize-y"
        ></textarea>
      </div>
    </div>
  );
}
