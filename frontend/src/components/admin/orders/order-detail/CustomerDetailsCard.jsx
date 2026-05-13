import { Phone } from "lucide-react";

export function CustomerDetailsCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 mb-6">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Customer Details</h3>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
          MT
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-900 leading-tight">Marcus Thorne</h4>
          <a href="mailto:m.thorne@vanguard-labs.com" className="text-sm text-blue-600 hover:underline">
            m.thorne@vanguard-labs.com
          </a>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-600 mb-6">
        <Phone className="w-4 h-4" />
        <span>+1 (555) 012-3456</span>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Customer Lifetime
        </div>
        <div className="text-xl font-bold text-blue-900 mb-1">12 Orders Total</div>
        <div className="text-xs text-blue-700/70">Valued at $14,250.00</div>
      </div>
    </div>
  );
}
