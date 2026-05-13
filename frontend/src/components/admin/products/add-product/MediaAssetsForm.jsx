import { UploadCloud, Image as ImageIcon, Plus } from "lucide-react";

export function MediaAssetsForm() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-6">
      <h2 className="text-lg font-extrabold text-gray-900 mb-6 tracking-tight">Media Assets</h2>
      
      <div className="border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 p-8 flex flex-col items-center justify-center text-center transition-colors hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer group mb-6">
        <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100 mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6 text-blue-600" />
        </div>
        <div className="text-sm font-bold text-gray-900 mb-1">Drag and drop images here</div>
        <p className="text-xs text-gray-500 mb-4">PNG, JPG or WEBP up to 5MB</p>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm pointer-events-none">
          Browse Files
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
        {/* Mock uploaded image */}
        <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 relative group">
          <ImageIcon className="w-6 h-6 text-gray-300" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">Remove</span>
          </div>
        </div>
        {/* Mock uploaded image */}
        <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 relative group">
          <ImageIcon className="w-6 h-6 text-gray-300" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">Remove</span>
          </div>
        </div>
        {/* Add more slot */}
        <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer">
          <Plus className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
