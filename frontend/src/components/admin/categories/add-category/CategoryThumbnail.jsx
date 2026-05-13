import { Image as ImageIcon, Trash2 } from "lucide-react";

export function CategoryThumbnail() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <ImageIcon className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-900">Media</h2>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-900 mb-2">Category Thumbnail</label>
        {/* Uploaded state mockup based on image */}
        <div className="relative rounded-lg overflow-hidden border border-gray-200 mb-4 bg-gray-900">
          <img src="https://placehold.co/400x200/1e293b/ffffff?text=Cooling+Unit" alt="Cooling Unit" className="w-full h-[140px] object-cover opacity-80" />
          <button className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded shadow hover:bg-rose-700 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Empty upload zone below it */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="mb-2 text-gray-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">PNG, JPG, WEBP</p>
          <p className="text-xs text-gray-400 mb-3">Up to 2MB</p>
          <button className="text-sm font-bold text-blue-600">Browse Files</button>
        </div>
      </div>
    </div>
  );
}
