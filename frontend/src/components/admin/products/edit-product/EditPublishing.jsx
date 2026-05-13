export function EditPublishing() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mb-6">
      <h3 className="text-sm font-bold text-gray-700 mb-4">Publishing</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Status</label>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none cursor-pointer">
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-3">Visibility</label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="visibility" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer" defaultChecked />
              <span className="text-sm text-gray-700">Public</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="visibility" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer" />
              <span className="text-sm text-gray-700">Hidden</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
