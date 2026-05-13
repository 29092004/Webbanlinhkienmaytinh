export function CategoryVisibilityEdit() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-4">VISIBILITY</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-gray-900 mb-0.5">Published</div>
            <div className="text-xs text-gray-500">Available on storefront</div>
          </div>
          {/* Toggle Switch ON */}
          <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-gray-900 mb-0.5">Featured</div>
            <div className="text-xs text-gray-500">Show in homepage bento</div>
          </div>
          {/* Toggle Switch OFF */}
          <div className="w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer border border-gray-300">
            <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-all shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
