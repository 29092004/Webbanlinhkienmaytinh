import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

export function ProductFilters({
  selectedBrands,
  onBrandToggle,
  selectedVram,
  onVramToggle,
  priceRange,
  onPriceChange,
}) {
  const [openSections, setOpenSections] = useState({
    brands: true,
    price: true,
    vram: true,
    architecture: false,
    tdp: false,
    rgb: false,
    stock: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const brands = ["ASUS", "MSI", "NVIDIA", "Gigabyte"];
  const vrams = ["8GB", "12GB", "16GB", "24GB"];

  return (
    <div className="w-full space-y-6">
      {/* Brand Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection("brands")}
          className="flex w-full items-center justify-between font-bold text-gray-900 text-sm"
        >
          <span>THƯƠNG HIỆU</span>
          {openSections.brands ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        {openSections.brands && (
          <div className="mt-4 space-y-3">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer select-none text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => onBrandToggle(brand)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 size-4 cursor-pointer"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="flex w-full items-center justify-between font-bold text-gray-900 text-sm"
        >
          <span>KHOẢNG GIÁ</span>
          {openSections.price ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        {openSections.price && (
          <div className="mt-4 space-y-6">
            <style>{`
              .double-range-slider input[type="range"] {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                width: 100%;
                outline: none;
                position: absolute;
                background: transparent;
                pointer-events: none;
              }
              .double-range-slider input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                pointer-events: auto;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #2563eb;
                border: 2px solid #ffffff;
                box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                cursor: pointer;
              }
              .double-range-slider input[type="range"]::-moz-range-thumb {
                -moz-appearance: none;
                appearance: none;
                pointer-events: auto;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #2563eb;
                border: 2px solid #ffffff;
                box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                cursor: pointer;
              }
            `}</style>
            
            <div className="double-range-slider relative w-full h-5 flex items-center">
              {/* Background Track */}
              <div className="absolute left-0 right-0 h-1 bg-slate-200 rounded-full" />
              {/* Active Color Track */}
              <div
                className="absolute h-1 bg-blue-600 rounded-full"
                style={{
                  left: `${priceRange[0]}%`,
                  right: `${100 - priceRange[1]}%`
                }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[0]}
                onChange={(e) => {
                  const val = Math.min(parseInt(e.target.value), priceRange[1] - 5);
                  onPriceChange([val, priceRange[1]]);
                }}
                className="z-20"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) => {
                  const val = Math.max(parseInt(e.target.value), priceRange[0] + 5);
                  onPriceChange([priceRange[0], val]);
                }}
                className="z-20"
              />
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-2 px-2 text-center text-[10px] font-bold text-gray-700 shadow-sm">
                {(priceRange[0] * 1000000).toLocaleString("vi-VN")}đ
              </div>
              <span className="text-gray-400 font-bold text-xs">—</span>
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-2 px-2 text-center text-[10px] font-bold text-gray-700 shadow-sm">
                {(priceRange[1] * 1000000).toLocaleString("vi-VN")}đ
              </div>
            </div>
          </div>
        )}
      </div>

      {/* VRAM Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection("vram")}
          className="flex w-full items-center justify-between font-bold text-gray-900 text-sm"
        >
          <span>DUNG LƯỢNG VRAM</span>
          {openSections.vram ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        {openSections.vram && (
          <div className="mt-4 flex flex-wrap gap-2">
            {vrams.map((vram) => {
              const isSelected = selectedVram === vram;
              return (
                <button
                  key={vram}
                  type="button"
                  onClick={() => onVramToggle(vram)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all border ${
                    isSelected
                      ? "bg-blue-50 border-blue-600 text-blue-600"
                      : "bg-white border-slate-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {vram}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Collapsed Placeholder Sections */}
      {["architecture", "tdp", "rgb", "stock"].map((section) => {
        const titleMap = {
          architecture: "KIÊN TRÚC",
          tdp: "CHỈ SỐ TDP",
          rgb: "HỖ TRỢ RGB",
          stock: "TÌNH TRẠNG KHO",
        };
        return (
          <div key={section} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <button
              type="button"
              onClick={() => toggleSection(section)}
              className="flex w-full items-center justify-between font-bold text-gray-900 text-sm"
            >
              <span>{titleMap[section]}</span>
              <Plus className="size-4 text-gray-400" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
