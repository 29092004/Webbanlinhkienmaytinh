import { Plus, Upload } from "lucide-react";

export function EditMediaAssets() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mb-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-900">Media Assets</h2>
        <button className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
          <Plus className="w-4 h-4" /> Add Media
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Mock uploaded images */}
        <div className="aspect-square bg-[#0f172a] rounded-xl overflow-hidden border border-gray-200 relative group cursor-pointer p-2">
          <img src="https://placehold.co/400x400/0f172a/ffffff?text=GPU+Side" alt="Product 1" className="w-full h-full object-contain" />
        </div>
        <div className="aspect-square bg-[#0f172a] rounded-xl overflow-hidden border border-gray-200 relative group cursor-pointer p-2">
          <img src="https://placehold.co/400x400/0f172a/ffffff?text=GPU+Angled" alt="Product 2" className="w-full h-full object-contain" />
        </div>
        <div className="aspect-square bg-[#0f172a] rounded-xl overflow-hidden border border-gray-200 relative group cursor-pointer p-2">
          <img src="https://placehold.co/400x400/0f172a/ffffff?text=GPU+Bottom" alt="Product 3" className="w-full h-full object-contain" />
        </div>
        
        {/* Upload Slot */}
        <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-colors cursor-pointer gap-2">
          <Upload className="w-5 h-5" />
          <span className="text-xs font-bold">Upload</span>
        </div>
      </div>
    </div>
  );
}
