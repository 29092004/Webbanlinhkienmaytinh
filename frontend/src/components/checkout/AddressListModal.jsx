import { X, Plus } from "lucide-react";

export default function AddressListModal({
  isOpen,
  onClose,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewClick,
  onEditAddress,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-extrabold text-gray-900 text-base">Địa Chỉ Của Tôi</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Address List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address.id;
            return (
              <div
                key={address.id}
                onClick={() => onSelectAddress(address.id)}
                className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 cursor-pointer transition"
              >
                {/* Custom Radio Button */}
                <div className="mt-1 shrink-0">
                  <div
                    className={`size-5 rounded-full border-2 flex items-center justify-center transition ${
                      isSelected
                        ? "border-orange-500 bg-orange-500"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="size-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2 text-xs md:text-sm">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-extrabold text-gray-900">{address.name}</span>
                    <span className="text-gray-400 font-semibold">|</span>
                    <span className="text-gray-500 font-medium">{address.phone}</span>
                  </div>

                  <p className="text-gray-600 leading-relaxed font-semibold">
                    {address.fullAddress}
                  </p>

                  {address.isDefault && (
                    <span className="inline-block text-[10px] text-orange-500 border border-orange-500 px-1 py-0.2 rounded font-bold uppercase">
                      Mặc định
                    </span>
                  )}
                </div>

                {/* Update button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditAddress(address);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition uppercase shrink-0"
                >
                  Cập nhật
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex flex-col gap-3">
          <button
            type="button"
            onClick={onAddNewClick}
            className="w-full bg-[#f05330] hover:bg-[#d64120] text-white py-3 rounded-lg text-sm font-extrabold flex items-center justify-center gap-1.5 transition shadow-sm uppercase"
          >
            <Plus className="size-4" />
            Thêm Địa Chỉ Mới
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-gray-800 py-2.5 rounded-lg text-xs font-bold transition uppercase"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
