import { Search } from "lucide-react";

export function CategorySEOAdd() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-900">SEO Settings</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-900 mb-2">Meta Title</label>
        <input 
          type="text" 
          defaultValue="Premium Liquid Cooling Solutions | EXO CORE" 
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all bg-gray-50/50"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-900 mb-2">Meta Description</label>
        <textarea 
          rows={3}
          defaultValue="Explore high-efficiency liquid cooling units designed for enterprise workstations..." 
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all bg-gray-50/50 resize-y"
        ></textarea>
        <div className="text-right mt-1 text-[10px] text-gray-500 font-medium">102 / 160 characters</div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Search Engine Preview</label>
        <div className="border border-gray-200 rounded-lg p-5 bg-white">
          <div className="text-lg font-medium text-blue-800 hover:underline cursor-pointer mb-1 truncate">
            Premium Liquid Cooling Solutions | EXO CORE
          </div>
          <div className="text-sm text-emerald-700 mb-2 truncate">
            https://exocore.admin/inventory/liquid-cooling-units
          </div>
          <div className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            Explore high-efficiency liquid cooling units designed for enterprise workstations and extreme gaming environments. Precision engineered for quiet performance.
          </div>
        </div>
      </div>
    </div>
  );
}
