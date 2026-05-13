import { Eye } from "lucide-react";

export function CategoryVisibilityAdd() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Eye className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-900">Visibility</h2>
      </div>
      
      <div className="space-y-3">
        <label className="flex items-start gap-3 p-3 border-2 border-blue-600 bg-blue-50/30 rounded-lg cursor-pointer">
          <div className="mt-0.5 w-4 h-4 rounded-full border-[5px] border-blue-600 bg-white flex-shrink-0"></div>
          <div>
            <div className="text-sm font-bold text-gray-900">Visible</div>
            <div className="text-xs text-gray-500">Show to all customers</div>
          </div>
        </label>
        
        <label className="flex items-start gap-3 p-3 border border-gray-200 hover:border-gray-300 bg-white rounded-lg cursor-pointer transition-colors">
          <div className="mt-0.5 w-4 h-4 rounded-full border border-gray-300 bg-white flex-shrink-0"></div>
          <div>
            <div className="text-sm font-bold text-gray-900">Hidden</div>
            <div className="text-xs text-gray-500">Internal management only</div>
          </div>
        </label>

        <label className="flex items-start gap-3 p-3 border border-gray-200 hover:border-gray-300 bg-white rounded-lg cursor-pointer transition-colors">
          <div className="mt-0.5 w-4 h-4 rounded-full border border-gray-300 bg-white flex-shrink-0"></div>
          <div>
            <div className="text-sm font-bold text-gray-900">Draft</div>
            <div className="text-xs text-gray-500">Save for later editing</div>
          </div>
        </label>
      </div>
    </div>
  );
}
