import { Truck } from "lucide-react";

export function TransactionDetailsCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 mb-6">
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Transaction Details</h3>
        <div className="flex items-center gap-3">
          <div className="px-2 py-1 bg-blue-50 border border-blue-100 rounded text-blue-900 font-extrabold italic text-sm tracking-wider">
            VISA
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">Visa ending in 4242</div>
            <div className="text-xs text-gray-500">Authorized: $2,074.84</div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Shipping Method</h3>
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-gray-700">Express Courier (Next Day)</span>
        </div>
      </div>
    </div>
  );
}
