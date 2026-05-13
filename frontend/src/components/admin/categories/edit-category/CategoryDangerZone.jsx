import { Trash2 } from "lucide-react";

export function CategoryDangerZone() {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl shadow-sm p-6 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-rose-800 mb-1">Danger Zone</h2>
        <p className="text-sm font-bold text-rose-600">Deleting this category will unassign all linked products.</p>
      </div>
      <button type="button" className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 rounded-lg text-sm font-bold text-white transition-colors shadow-sm shadow-rose-200">
        <Trash2 className="w-4 h-4" /> Delete Category
      </button>
    </div>
  );
}
