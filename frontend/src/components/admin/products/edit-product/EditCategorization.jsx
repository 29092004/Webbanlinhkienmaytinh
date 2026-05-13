import { X } from "lucide-react";

export function EditCategorization() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mb-6">
      <h3 className="text-sm font-bold text-gray-700 mb-4">Categorization</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Category</label>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none cursor-pointer">
            <option>GPU</option>
            <option>CPU</option>
            <option>Motherboard</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Tags</label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[100px] flex flex-col">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">
                #high-perf <button className="hover:text-blue-900"><X className="w-3 h-3" /></button>
              </span>
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">
                #rtx <button className="hover:text-blue-900"><X className="w-3 h-3" /></button>
              </span>
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">
                #gaming <button className="hover:text-blue-900"><X className="w-3 h-3" /></button>
              </span>
            </div>
            <input 
              type="text" 
              placeholder="Add tag..." 
              className="bg-transparent border-none outline-none text-sm w-full mt-auto text-gray-500 placeholder-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
