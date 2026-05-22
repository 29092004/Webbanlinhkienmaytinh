import { MapPin } from "lucide-react";

export default function CheckoutAddress({ activeAddress, onChangeClick }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2 text-blue-600 font-extrabold text-sm uppercase tracking-wider">
        <MapPin className="size-5" />
        <span>Địa chỉ nhận hàng</span>
      </div>

      {/* Address Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        {activeAddress ? (
          <div className="text-xs md:text-sm font-semibold text-gray-800 leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-extrabold text-gray-900">
              {activeAddress.name} ({activeAddress.phone})
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{activeAddress.fullAddress}</span>
            {activeAddress.isDefault && (
              <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded font-bold uppercase ml-2">
                Mặc định
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs md:text-sm text-gray-500 font-medium italic">
            Chưa có địa chỉ nhận hàng. Vui lòng thêm địa chỉ mới.
          </p>
        )}

        <button
          type="button"
          onClick={onChangeClick}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all tracking-wider uppercase shrink-0 self-start md:self-auto"
        >
          Thay đổi
        </button>
      </div>
    </div>
  );
}
