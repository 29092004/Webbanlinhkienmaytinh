import { Check } from "lucide-react";

export function OrderTimelineCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Order Timeline</h3>
      
      <div className="relative pl-3 space-y-6">
        {/* Continuous Line */}
        <div className="absolute left-[15px] top-2 bottom-6 w-[2px] bg-gray-100"></div>

        {/* Step 1 */}
        <div className="relative z-10 flex gap-4">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 border-4 border-white shadow-sm">
            <Check className="w-3 h-3 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">Payment Confirmed</div>
            <div className="text-xs text-gray-500">Oct 24, 2024 · 2:47 PM</div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative z-10 flex gap-4">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 border-4 border-white shadow-sm">
            <Check className="w-3 h-3 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">Order Placed</div>
            <div className="text-xs text-gray-500">Oct 24, 2024 · 2:45 PM</div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative z-10 flex gap-4">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 border-4 border-white">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">Pending Fulfillment</div>
            <div className="text-xs text-gray-500">System assigned to Warehouse A</div>
          </div>
        </div>
      </div>
    </div>
  );
}
