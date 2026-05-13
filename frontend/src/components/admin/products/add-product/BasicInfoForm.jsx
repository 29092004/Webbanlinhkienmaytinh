import { Bold, Italic, List, Link } from "lucide-react";

export function BasicInfoForm() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-lg font-extrabold text-gray-900 mb-6 tracking-tight">Basic Information</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Product Name</label>
          <input 
            type="text" 
            placeholder="e.g. EXO CORE Hyper-Cooler 3000" 
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Brand</label>
            <select className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none cursor-pointer">
              <option>EXO CORE</option>
              <option>ASUS</option>
              <option>MSI</option>
              <option>Corsair</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">SKU</label>
            <input 
              type="text" 
              placeholder="EC-HC-3000-BL" 
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Description</label>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50/50 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
              <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"><Bold className="w-4 h-4" /></button>
              <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"><Italic className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"><List className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"><Link className="w-4 h-4" /></button>
            </div>
            <textarea 
              rows="5"
              placeholder="Describe the product features, performance benchmarks, and compatibility..."
              className="w-full p-4 text-sm text-gray-700 focus:outline-none resize-y"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
