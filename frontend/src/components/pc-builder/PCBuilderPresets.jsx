import { useState } from "react";
import { Sparkles, Check, DollarSign } from "lucide-react";
import { showToast } from "@/lib/toast";

const PRESET_BUILDS = [
  {
    name: "Cấu hình Gaming giá rẻ (~15 triệu)",
    description: "Chiến mượt mà mọi game Esports (LOL, FO4, Valorant) ở Full HD.",
    estimatedPrice: "14.500.000 đ",
    parts: {
      1: 1,  // CPU: i5 13400F
      7: 7,  // GPU: MSI RTX 4060 Ventus
      3: 13, // Mainboard: Asus Prime B760M-A
      4: 17, // RAM: Corsair Vengeance 16GB
      5: 22, // SSD: Kingston NV2 1TB
      8: 28, // PSU: MSI MAG A650BN 650W
      9: 32, // Case: MSI MAG Forge 100R
      2: 34, // Cooling: Corsair iCUE AR120
    }
  },
  {
    name: "Cấu hình Đồ họa - Gaming trung cấp (~25 triệu)",
    description: "Làm đồ họa 2D/3D, edit video, chơi game AAA độ phân giải 2K.",
    estimatedPrice: "24.500.000 đ",
    parts: {
      1: 1,  // CPU: i5 13400F
      7: 6,  // GPU: Asus TUF RTX 4060 Ti
      3: 14, // Mainboard: MSI B760M Mortar WiFi
      4: 19, // RAM: Corsair Vengeance 32GB
      5: 21, // SSD: Samsung 980 Pro 1TB
      8: 26, // PSU: Corsair CV650 650W
      9: 30, // Case: Corsair 4000D Airflow
      2: 35, // Cooling: Asus TUF TF120
    }
  },
  {
    name: "Cấu hình Đồ họa - Gaming cao cấp (~35 triệu)",
    description: "Cấu hình khủng hiệu năng cao, render 3D nhanh, chơi game max setting.",
    estimatedPrice: "34.800.000 đ",
    parts: {
      1: 2,  // CPU: i7 13700K
      7: 6,  // GPU: Asus TUF RTX 4060 Ti
      3: 14, // Mainboard: MSI B760M Mortar WiFi
      4: 19, // RAM: Corsair Vengeance 32GB
      5: 23, // SSD: Corsair MP600 Pro 1TB
      8: 27, // PSU: Corsair RM750e 750W
      9: 31, // Case: Asus TUF GT301
      2: 36, // Cooling: MSI MAG CoreLiquid M240
    }
  }
];

export function PCBuilderPresets({ onSelectPreset, onSuggestBudget }) {
  const [budget, setBudget] = useState("");

  const handleSuggest = (e) => {
    e.preventDefault();
    const budgetAmount = Number(budget.replace(/[^0-9]/g, ""));
    if (isNaN(budgetAmount) || budgetAmount < 8000000) {
      showToast({ message: "Ngân sách tối thiểu từ 8.000.000 đ để build PC.", type: "warning" });
      return;
    }
    onSuggestBudget(budgetAmount);
  };

  return (
    <div className="space-y-8 border-t border-slate-200 pt-8">
      {/* Top Presets */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Top cấu hình PC gợi ý sẵn
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Lựa chọn cấu hình tối ưu hiệu năng được dựng sẵn phù hợp từng nhu cầu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESET_BUILDS.map((build, index) => (
            <div
              key={index}
              className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                  Gợi ý {index + 1}
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm mt-2 line-clamp-1">
                  {build.name}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-1 line-clamp-2">
                  {build.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs font-black text-red-600">
                  {build.estimatedPrice}
                </span>
                <button
                  onClick={() => onSelectPreset(build.parts)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Check className="size-3.5" />
                  Chọn
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Selector */}
      <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 rounded-3xl p-6 text-white space-y-4 shadow-lg shadow-indigo-100/50">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="size-4.5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-wide uppercase">
              Tự động gợi ý theo ngân sách
            </h3>
            <p className="text-xs text-indigo-200 font-medium mt-0.5">
              Nhập số tiền của bạn để AI tự động chọn linh kiện tương thích tối ưu nhất
            </p>
          </div>
        </div>

        <form onSubmit={handleSuggest} className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1 flex items-center rounded-2xl border border-white/10 bg-white/5 focus-within:bg-white/10 focus-within:border-white/20 px-4 py-3 transition">
            <DollarSign className="size-4.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-slate-500"
              placeholder="Ví dụ: 15000000"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 text-xs font-black transition uppercase flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-500/20"
          >
            <Sparkles className="size-4" />
            Gợi ý cấu hình
          </button>
        </form>
      </div>
    </div>
  );
}
