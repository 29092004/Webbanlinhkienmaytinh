export function ProductStatusForm() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Product Status</h2>
      
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          <span className="text-sm font-bold text-blue-700">Published</span>
        </div>
        <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Visibility</label>
          <select className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none cursor-pointer">
            <option>Public</option>
            <option>Hidden</option>
          </select>
        </div>
        <div className="text-xs text-gray-500">
          Published on: <span className="font-bold text-gray-900">Immediate</span>
        </div>
      </div>

      <button className="w-full py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-bold transition-colors">
        Move to Trash
      </button>
    </div>
  );
}
