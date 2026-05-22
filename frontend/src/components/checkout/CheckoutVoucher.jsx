import { Ticket, Coins, Check } from "lucide-react";

export default function CheckoutVoucher({
  pointsUsed,
  onPointsToggle,
  pointsAvailable = 2500,
  pointsToUse = 2000,
  pointsDiscount = 2000000,
  selectedVoucher,
  onSelectVoucherClick,
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
      {/* Voucher Row */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-dashed border-slate-100">
        <div className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-gray-800">
          <Ticket className="size-5 text-blue-600 shrink-0" />
          <span>EXO CORE Voucher</span>
          {selectedVoucher && (
            <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-lg font-black uppercase">
              {selectedVoucher.code} (-{selectedVoucher.discount.toLocaleString("vi-VN")}đ)
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onSelectVoucherClick}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 transition uppercase tracking-wide shrink-0"
        >
          {selectedVoucher ? "Thay đổi" : "Chọn Voucher"}
        </button>
      </div>

      {/* Points Row */}
      <div className="flex items-center justify-between gap-4 pt-1 text-xs md:text-sm">
        <div className="flex items-center gap-2.5 font-semibold text-gray-800">
          <Coins className="size-5 text-amber-500 shrink-0" />
          <div className="flex flex-wrap items-center gap-1.5">
            <span>EXO Points</span>
            <span className="text-gray-400 text-xs font-medium">
              (Bạn có {pointsAvailable.toLocaleString("vi-VN")} điểm)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-600">
            <span>Dùng {pointsToUse.toLocaleString("vi-VN")} điểm</span>
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={pointsUsed}
                onChange={onPointsToggle}
                className="sr-only peer"
              />
              <div className="size-5 bg-white border border-slate-300 rounded-md transition peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center">
                <Check className="size-3.5 text-white scale-0 peer-checked:scale-100 transition-transform font-black" />
              </div>
            </div>
          </label>

          {pointsUsed && (
            <span className="font-extrabold text-red-600">
              -{pointsDiscount.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
