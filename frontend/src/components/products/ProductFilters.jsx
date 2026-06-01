import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ProductFilters({
  selectedCategories,
  onCategoryToggle,
  selectedBrands,
  onBrandToggle,
  priceRange,
  onPriceChange,
  categoriesList = [],
  brandsList = [],
}) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    brands: true,
  });
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const visibleCategories = isCategoriesExpanded
    ? categoriesList
    : categoriesList.slice(0, 6);

  return (
    <div className="w-full space-y-6">
      {/* Category Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection("categories")}
          className="flex w-full items-center justify-between font-bold text-slate-800 text-sm tracking-wide"
        >
          <span>DANH MỤC</span>
          {openSections.categories ? <ChevronUp className="size-4 text-slate-400" /> : <ChevronDown className="size-4 text-slate-400" />}
        </button>

        {openSections.categories && (
          <div className="mt-4 space-y-3">
            {visibleCategories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer select-none text-[14px] text-slate-600 hover:text-slate-900 transition-colors font-medium">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => onCategoryToggle(cat.id)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-400 size-4.5 cursor-pointer accent-slate-900"
                />
                <span>{cat.label}</span>
              </label>
            ))}

            {categoriesList.length > 6 && (
              <button
                type="button"
                onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-slate-700 transition-colors pt-1 cursor-pointer w-full text-left"
              >
                <span>{isCategoriesExpanded ? "Thu gọn" : `Xem thêm (${categoriesList.length - 6})`}</span>
                {isCategoriesExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="flex w-full items-center justify-between font-bold text-slate-800 text-sm tracking-wide"
        >
          <span>KHOẢNG GIÁ</span>
          {openSections.price ? <ChevronUp className="size-4 text-slate-400" /> : <ChevronDown className="size-4 text-slate-400" />}
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
                background: #0f172a;
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
                background: #0f172a;
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
                className="absolute h-1 bg-slate-900 rounded-full"
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
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl py-2 px-2 text-center text-[12px] font-bold text-slate-700 shadow-sm">
                {(priceRange[0] * 1000000).toLocaleString("vi-VN")}đ
              </div>
              <span className="text-gray-400 font-bold text-xs">—</span>
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl py-2 px-2 text-center text-[12px] font-bold text-slate-700 shadow-sm">
                {(priceRange[1] * 1000000).toLocaleString("vi-VN")}đ
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Brand Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection("brands")}
          className="flex w-full items-center justify-between font-bold text-slate-800 text-sm tracking-wide"
        >
          <span>THƯƠNG HIỆU</span>
          {openSections.brands ? <ChevronUp className="size-4 text-slate-400" /> : <ChevronDown className="size-4 text-slate-400" />}
        </button>

        {openSections.brands && (
          <div className="mt-4 space-y-3">
            {brandsList.map((brand) => (
              <label key={brand.id} className="flex items-center gap-3 cursor-pointer select-none text-[14px] text-slate-600 hover:text-slate-900 transition-colors font-medium">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => onBrandToggle(brand.id)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-400 size-4.5 cursor-pointer accent-slate-900"
                />
                <span>{brand.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
