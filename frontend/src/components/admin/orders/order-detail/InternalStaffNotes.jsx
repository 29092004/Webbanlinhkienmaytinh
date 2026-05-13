export function InternalStaffNotes() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Internal Staff Notes</h2>
        <button className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
          Add Note
        </button>
      </div>

      <div className="space-y-4">
        {/* Existing Note */}
        <div className="bg-gray-50 border border-gray-200 border-l-4 border-l-blue-500 rounded-r-xl rounded-l-sm p-4 relative">
          <p className="text-sm text-gray-700 mb-3">
            Customer requested signature on delivery via email. Ensure shipping label reflects this.
          </p>
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            <span>Added by Sarah Miller</span>
            <span>Oct 24, 2024 · 3:10 PM</span>
          </div>
        </div>

        {/* Add Note Input */}
        <div className="relative">
          <textarea 
            placeholder="Type a new internal note..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all resize-y min-h-[100px]"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
