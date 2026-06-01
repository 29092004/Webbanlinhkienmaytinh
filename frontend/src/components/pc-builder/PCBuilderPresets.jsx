import { Check } from "lucide-react";

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

export function PCBuilderPresets({ onSelectPreset }) {
  return (
    <div className="border-t border-slate-200 pt-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-[-0.02em] m-0">
            Top cấu hình PC gợi ý sẵn
          </h2>
          <p className="text-sm text-slate-400 font-medium mt-1">
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
                <span className="text-xs font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                  Gợi ý {index + 1}
                </span>
                <h3 className="font-semibold text-slate-900 text-[15px] mt-2 line-clamp-1 tracking-[-0.01em]">
                  {build.name}
                </h3>
                <p className="text-sm text-slate-400 font-medium mt-1 line-clamp-2">
                  {build.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-red-600">
                  {build.estimatedPrice}
                </span>
                <button
                  onClick={() => onSelectPreset(build.parts)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl px-4 py-2 text-sm font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <Check className="size-3.5" />
                  Chọn
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
