import { Clock, Plus } from "lucide-react";

export function EditAuditLog() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <h3 className="text-sm font-bold text-gray-700 mb-6">Audit Log</h3>
      
      <div className="relative pl-3">
        {/* Timeline Line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gray-200"></div>
        
        <div className="flex items-start gap-4 mb-6 relative z-10">
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">Updated by Alex J.</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Oct 12, 2024 · 09:45 AM</div>
          </div>
        </div>

        <div className="flex items-start gap-4 relative z-10">
          <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">Product Created</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Aug 05, 2024 · 14:20 PM</div>
          </div>
        </div>
      </div>
    </div>
  );
}
