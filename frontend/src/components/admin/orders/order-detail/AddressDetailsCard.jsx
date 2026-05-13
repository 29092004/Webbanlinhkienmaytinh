import { Edit2 } from "lucide-react";

export function AddressDetailsCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 mb-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Shipping Address</h3>
          <button className="text-blue-600 hover:text-blue-800 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
        <div className="text-sm text-gray-700 space-y-1">
          <p className="font-bold text-gray-900">Marcus Thorne</p>
          <p>Vanguard Labs HQ</p>
          <p>77 Innovation Way, Suite 400</p>
          <p>Austin, TX 78701</p>
          <p>United States</p>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          Billing Address 
          <span className="text-[10px] font-normal italic text-gray-400 capitalize">Same as shipping</span>
        </h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>Marcus Thorne</p>
          <p>Vanguard Labs HQ...</p>
        </div>
      </div>
    </div>
  );
}
