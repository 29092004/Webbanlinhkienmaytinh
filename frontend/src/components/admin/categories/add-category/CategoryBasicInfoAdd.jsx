import { Info, Bold, Italic, List, Link as LinkIcon } from "lucide-react";

export function CategoryBasicInfoAdd() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Info className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Category Name</label>
          <input 
            type="text" 
            placeholder="e.g., Liquid Cooling Units" 
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all bg-gray-50/50"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-gray-900">Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Auto-generate</span>
              <div className="w-8 h-4 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-0.5 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <input 
            type="text" 
            placeholder="liquid-cooling-units" 
            disabled
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-500 font-mono"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
        <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1">
            <button type="button" className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"><Bold className="w-4 h-4" /></button>
            <button type="button" className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"><Italic className="w-4 h-4" /></button>
            <button type="button" className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"><List className="w-4 h-4" /></button>
            <div className="w-px h-5 bg-gray-300 mx-1 my-auto"></div>
            <button type="button" className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"><LinkIcon className="w-4 h-4" /></button>
          </div>
          <textarea 
            rows={5}
            placeholder="Detailed description of components in this category..." 
            className="w-full px-4 py-3 text-sm focus:outline-none bg-white resize-y min-h-[120px]"
          ></textarea>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Parent Category</label>
        <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all bg-gray-50/50 appearance-none">
          <option>None (Top Level)</option>
          <option>Components</option>
          <option>Peripherals</option>
        </select>
      </div>
    </div>
  );
}
