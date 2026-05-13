import { Edit2 } from "lucide-react";

export function CategoryBannerMedia() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Category Media</h2>
        <button type="button" className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700">
          <Edit2 className="w-3.5 h-3.5" /> Change Asset
        </button>
      </div>
      
      <div className="rounded-xl overflow-hidden border border-gray-200 mb-2 bg-gray-900 aspect-[21/9]">
        <img src="https://placehold.co/1200x514/1e293b/ffffff?text=Graphics+Card+Banner" alt="Graphics Card Category" className="w-full h-full object-cover opacity-90" />
      </div>
      <p className="text-[10px] italic text-gray-500">Recommended size: 1200x514px. Format: WEBP or PNG.</p>
    </div>
  );
}
