export function CategorySearchPreview() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-4">SEARCH PREVIEW</h3>
      
      <div className="mb-4">
        <div className="text-[15px] font-medium text-[#1a0dab] hover:underline cursor-pointer mb-1 leading-snug">
          Graphics Cards - High Performance GPUs | EXO CORE
        </div>
        <div className="text-[11px] text-[#006621] mb-2 truncate">
          https://exocore.io › categories › gpu
        </div>
        <div className="text-xs text-[#545454] leading-relaxed">
          Shop the latest Graphics Cards (GPU) for gaming and professional workloads. Features NVIDIA and AMD...
        </div>
      </div>

      <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
        Edit SEO Settings
      </button>
    </div>
  );
}
