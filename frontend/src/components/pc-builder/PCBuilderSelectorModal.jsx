/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useMemo } from "react";
import { X, ImageOff, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { resolveAssetUrl, calculateDiscountedPrice } from "@/components/admin/product/productUtils";
import { searchProductsByName } from "@/lib/productMappers";

const getCategoryKeys = (categoryName) => {
  const norm = String(categoryName || "").toLowerCase();
  if (norm.includes("cpu") || norm.includes("vi xử lý")) return ["cpu"];
  if (norm.includes("gpu") || norm.includes("vga") || norm.includes("card")) return ["gpu"];
  if (norm.includes("mainboard") || norm.includes("bo mạch")) return ["mainboard"];
  if (norm.includes("ram") || norm.includes("bộ nhớ")) return ["ram"];
  if (norm.includes("ssd")) return ["ssd"];
  if (norm.includes("hdd")) return ["hdd"];
  if (norm.includes("power") || norm.includes("nguồn")) return ["power supply"];
  if (norm.includes("case") || norm.includes("vỏ")) return ["case pc"];
  if (norm.includes("cooling") || norm.includes("tản")) return ["cooling fan"];
  if (norm.includes("monitor") || norm.includes("màn hình")) return ["monitor"];
  if (norm.includes("keyboard") || norm.includes("bàn phím")) return ["keyboard"];
  if (norm.includes("mouse") || norm.includes("chuột")) return ["mouse"];
  if (norm.includes("headphone") || norm.includes("tai nghe")) return ["headphone"];
  if (norm.includes("speaker") || norm.includes("loa")) return ["speaker"];
  if (norm.includes("router") || norm.includes("mạng")) return ["router"];
  return [norm];
};

const getFilterKeys = (categoryName) => {
  const norm = String(categoryName || "").toLowerCase();
  if (norm.includes("cpu") || norm.includes("vi xử lý")) return ["Socket", "Số nhân"];
  if (norm.includes("gpu") || norm.includes("vga") || norm.includes("card")) return ["Dung lượng VRAM", "Loại bộ nhớ"];
  if (norm.includes("mainboard") || norm.includes("bo mạch")) return ["Socket", "Chipset", "Loại RAM"];
  if (norm.includes("ram") || norm.includes("bộ nhớ")) return ["Dung lượng", "Loại RAM", "Tốc độ Bus"];
  if (norm.includes("ssd") || norm.includes("hdd")) return ["Dung lượng", "Giao tiếp"];
  if (norm.includes("power") || norm.includes("nguồn")) return ["Công suất", "Chuẩn hiệu suất"];
  if (norm.includes("case") || norm.includes("vỏ")) return ["Kích thước case", "Mặt hông"];
  if (norm.includes("cooling") || norm.includes("tản")) return ["Loại tản nhiệt", "Kích thước quạt"];
  if (norm.includes("monitor") || norm.includes("màn hình")) return ["Kích thước màn hình", "Tần số quét", "Tấm nền"];
  if (norm.includes("keyboard") || norm.includes("bàn phím")) return ["Loại bàn phím", "Layout"];
  if (norm.includes("mouse") || norm.includes("chuột")) return ["Loại cảm biến", "Số nút"];
  return [];
};

const PRICE_RANGES = [
  { label: "Dưới 1 triệu", min: 0, max: 1000000 },
  { label: "1 triệu - 2 triệu", min: 1000000, max: 2000000 },
  { label: "2 triệu - 5 triệu", min: 2000000, max: 5000000 },
  { label: "5 triệu - 10 triệu", min: 5000000, max: 10000000 },
  { label: "Trên 10 triệu", min: 10000000, max: 999999999 },
];

const ITEMS_PER_PAGE = 8;

export function PCBuilderSelectorModal({
  isOpen,
  onClose,
  slot,
  onSelect,
}) {
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  // Filters State
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSpecFilters, setSelectedSpecFilters] = useState({});

  // Reset filters when slot changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedBrands([]);
      setSelectedPriceRanges([]);
      setSelectedSpecFilters({});
      setSortBy("default");
      setCurrentPage(1);
    }
  }, [isOpen, slot]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBrands, selectedPriceRanges, selectedSpecFilters, sortBy]);

  // Fetch products when modal opens
  useEffect(() => {
    if (!isOpen || !slot) return;

    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/products");
        if (isMounted) {
          setAllProducts(Array.isArray(response.data?.data) ? response.data.data : []);
        }
      } catch (error) {
        console.error("Failed to fetch products for PC Builder slot", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [isOpen, slot]);

  // Filter products by slot's category
  const filteredByCategory = useMemo(() => {
    if (!slot) return [];
    const keys = getCategoryKeys(slot.category_name);
    return allProducts.filter((p) => {
      const pCat = String(p.category_name || "").toLowerCase();
      return keys.some((k) => pCat.includes(k) || k.includes(pCat));
    });
  }, [allProducts, slot]);

  // Extract filter options dynamically from category products
  const filterOptions = useMemo(() => {
    if (filteredByCategory.length === 0 || !slot) return { brands: [], specs: {} };

    // Brands
    const brands = Array.from(
      new Set(filteredByCategory.map((p) => p.brand_name).filter(Boolean))
    );

    // Spec fields
    const specKeys = getFilterKeys(slot.category_name);
    const specs = {};
    specKeys.forEach((key) => {
      const uniqueVals = Array.from(
        new Set(
          filteredByCategory
            .map((p) => p.specs?.[key])
            .filter((v) => v !== undefined && v !== null && v !== "")
        )
      );
      if (uniqueVals.length > 0) {
        specs[key] = uniqueVals;
      }
    });

    return { brands, specs };
  }, [filteredByCategory, slot]);

  // Compute counts for Brands, Price Ranges, and Specifications
  const filterCounts = useMemo(() => {
    const counts = {
      brands: {},
      priceRanges: {},
      specs: {},
    };

    // Filter by search query if present
    let baseList = [...filteredByCategory];
    if (searchQuery.trim()) {
      baseList = searchProductsByName(baseList, searchQuery);
    }

    // Initialize brand counts
    filterOptions.brands.forEach((brand) => {
      counts.brands[brand] = 0;
    });

    // Initialize price range counts
    PRICE_RANGES.forEach((range) => {
      counts.priceRanges[range.label] = 0;
    });

    // Initialize spec counts
    Object.entries(filterOptions.specs).forEach(([specKey, values]) => {
      counts.specs[specKey] = {};
      values.forEach((val) => {
        counts.specs[specKey][val] = 0;
      });
    });

    // Compute counts
    baseList.forEach((p) => {
      if (p.brand_name && counts.brands[p.brand_name] !== undefined) {
        counts.brands[p.brand_name]++;
      }

      const pricing = calculateDiscountedPrice({
        retailPrice: p.retail_price,
        saleType: p.sale_type,
        saleValue: p.sale_value,
        isOnSale: Boolean(p.sale_id),
      });

      PRICE_RANGES.forEach((range) => {
        if (pricing.finalPrice >= range.min && pricing.finalPrice <= range.max) {
          counts.priceRanges[range.label]++;
        }
      });

      Object.entries(filterOptions.specs).forEach(([specKey, values]) => {
        const productValue = p.specs?.[specKey];
        if (productValue !== undefined && productValue !== null && productValue !== "") {
          values.forEach((val) => {
            if (String(productValue).includes(val)) {
              counts.specs[specKey][val]++;
            }
          });
        }
      });
    });

    return counts;
  }, [filteredByCategory, searchQuery, filterOptions]);

  // Toggles for filters
  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handlePriceRangeToggle = (rangeLabel) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeLabel)
        ? prev.filter((r) => r !== rangeLabel)
        : [...prev, rangeLabel]
    );
  };

  const handleSpecFilterToggle = (specKey, value) => {
    setSelectedSpecFilters((prev) => {
      const currentValues = prev[specKey] || [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return {
        ...prev,
        [specKey]: nextValues,
      };
    });
  };

  // Filter products using all criteria
  const processedProducts = useMemo(() => {
    let result = [...filteredByCategory];

    // Text search
    if (searchQuery.trim()) {
      result = searchProductsByName(result, searchQuery);
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand_name));
    }

    // Price filter
    if (selectedPriceRanges.length > 0) {
      result = result.filter((p) => {
        return selectedPriceRanges.some((rangeLabel) => {
          const rangeObj = PRICE_RANGES.find((r) => r.label === rangeLabel);
          if (!rangeObj) return false;

          const pricing = calculateDiscountedPrice({
            retailPrice: p.retail_price,
            saleType: p.sale_type,
            saleValue: p.sale_value,
            isOnSale: Boolean(p.sale_id),
          });
          return pricing.finalPrice >= rangeObj.min && pricing.finalPrice <= rangeObj.max;
        });
      });
    }

    // Specs filter
    Object.entries(selectedSpecFilters).forEach(([specKey, filterValues]) => {
      if (filterValues.length > 0) {
        result = result.filter((p) => {
          const productValue = p.specs?.[specKey];
          return filterValues.some((fv) => String(productValue).includes(fv));
        });
      }
    });

    // Sort products
    if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const pA = calculateDiscountedPrice({
          retailPrice: a.retail_price,
          saleType: a.sale_type,
          saleValue: a.sale_value,
          isOnSale: Boolean(a.sale_id),
        }).finalPrice;
        const pB = calculateDiscountedPrice({
          retailPrice: b.retail_price,
          saleType: b.sale_type,
          saleValue: b.sale_value,
          isOnSale: Boolean(b.sale_id),
        }).finalPrice;
        return pA - pB;
      });
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const pA = calculateDiscountedPrice({
          retailPrice: a.retail_price,
          saleType: a.sale_type,
          saleValue: a.sale_value,
          isOnSale: Boolean(a.sale_id),
        }).finalPrice;
        const pB = calculateDiscountedPrice({
          retailPrice: b.retail_price,
          saleType: b.sale_type,
          saleValue: b.sale_value,
          isOnSale: Boolean(b.sale_id),
        }).finalPrice;
        return pB - pA;
      });
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    }

    return result;
  }, [filteredByCategory, searchQuery, selectedBrands, selectedPriceRanges, selectedSpecFilters, sortBy]);

  // Paginated List
  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedProducts, currentPage]);

  if (!isOpen || !slot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white text-slate-900 shrink-0 border-b border-slate-200">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em] text-slate-950 shrink-0">
              Chọn linh kiện
            </h2>
            {/* Search Input inside header */}
            <div className="relative flex-1 max-w-lg flex items-center rounded-xl bg-white text-slate-900 px-4 py-1.5 shadow-sm border border-slate-200">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[15px] font-medium outline-none placeholder:text-slate-400"
                placeholder="Bạn cần tìm linh kiện gì?"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition ml-4 cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Sorting header bar */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-sm font-medium text-slate-500 shrink-0 select-none">
          <div className="flex items-center gap-3">
            <span>Sắp xếp:</span>
            <div className="relative inline-flex items-center border border-slate-200 rounded-lg bg-white px-2.5 py-1 text-slate-700 hover:border-slate-300">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pr-6 bg-transparent outline-none cursor-pointer appearance-none text-sm font-medium"
              >
                <option value="default">Tùy chọn</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name-asc">Tên A-Z</option>
              </select>
              <ChevronDown className="size-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* Pagination Indicators (e.g. 1 2 3 4 5 6 7) */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 font-medium">
              Có {processedProducts.length} sản phẩm phù hợp
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="size-6 rounded bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
                >
                  <ChevronLeft className="size-3" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`size-6 rounded flex items-center justify-center text-xs font-medium transition cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#e21a36] text-white"
                        : "bg-white hover:bg-slate-100 border border-slate-200 text-slate-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="size-6 rounded bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
                >
                  <ChevronRight className="size-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dual Column Layout */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column: Filters Sidebar */}
          <aside className="w-full md:w-[270px] border-r border-slate-100 overflow-y-auto shrink-0 bg-slate-50/50 flex flex-col">
            <div className="p-3 bg-slate-100 border-b border-slate-200 text-center text-xs font-medium text-slate-500">
              LỌC SẢN PHẨM THEO
            </div>
            
            <div className="p-5 space-y-6">
              {/* Brand Filter */}
              {filterOptions.brands.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-800 tracking-[-0.01em]">Hãng sản xuất</h3>
                  <div className="space-y-1.5">
                    {filterOptions.brands.map((brand) => {
                      const count = filterCounts.brands[brand] || 0;
                      return (
                        <label key={brand} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-600 font-medium hover:text-slate-900 select-none">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-400 size-4 cursor-pointer"
                          />
                          <span>{brand} <span className="text-slate-400 font-semibold">({count})</span></span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Filter */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-800 tracking-[-0.01em]">Khoảng giá</h3>
                <div className="space-y-1.5">
                  {PRICE_RANGES.map((range) => {
                    const count = filterCounts.priceRanges[range.label] || 0;
                    return (
                      <label key={range.label} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-600 font-medium hover:text-slate-900 select-none">
                        <input
                          type="checkbox"
                          checked={selectedPriceRanges.includes(range.label)}
                          onChange={() => handlePriceRangeToggle(range.label)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-400 size-4 cursor-pointer"
                        />
                        <span>{range.label} <span className="text-slate-400 font-semibold">({count})</span></span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Spec Filters (Dynamic) */}
              {Object.entries(filterOptions.specs).map(([specKey, values]) => (
                <div key={specKey} className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-800 tracking-[-0.01em]">{specKey}</h3>
                  <div className="space-y-1.5">
                    {values.map((val) => {
                      const count = filterCounts.specs[specKey]?.[val] || 0;
                      return (
                        <label key={val} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-600 font-medium hover:text-slate-900 select-none">
                          <input
                            type="checkbox"
                            checked={(selectedSpecFilters[specKey] || []).includes(val)}
                            onChange={() => handleSpecFilterToggle(specKey, val)}
                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-400 size-4 cursor-pointer"
                          />
                          <span>{val} <span className="text-slate-400 font-semibold">({count})</span></span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Right Column: Product List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            {isLoading ? (
              <div className="text-center py-16 text-sm text-slate-400 font-semibold">
                Đang tải danh sách linh kiện...
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {paginatedProducts.map((product) => {
                  const mainImage = product.images?.[0]?.url
                    ? resolveAssetUrl(product.images[0].url)
                    : null;

                  const pricing = calculateDiscountedPrice({
                    retailPrice: product.retail_price,
                    saleType: product.sale_type,
                    saleValue: product.sale_value,
                    isOnSale: Boolean(product.sale_id),
                  });

                  const originalPrice = pricing.basePrice;
                  const finalPrice = pricing.finalPrice;
                  const hasDiscount = finalPrice < originalPrice;
                  const discountPercent = hasDiscount
                    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
                    : 0;

                  return (
                    <div
                      key={product.id}
                      className="py-4 flex flex-col sm:flex-row items-center gap-6 hover:bg-slate-50/50 rounded-2xl px-3 transition first:pt-0"
                    >
                      {/* Image & Badge */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className="size-24 bg-slate-50 border border-slate-100 rounded-xl p-1.5 flex items-center justify-center">
                          {mainImage ? (
                            <img
                              src={mainImage}
                              alt={product.name}
                              className="object-contain w-full h-full"
                            />
                          ) : (
                            <ImageOff className="size-8 text-slate-300" />
                          )}
                        </div>
                        {/* Custom Badge */}
                        <div className="bg-[#fffbeb] border border-amber-200 text-amber-600 text-[10px] font-medium px-1.5 py-0.5 rounded leading-none shadow-3xs select-none">
                          Giá sốc <span className="text-red-500">khi build pc</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-semibold text-slate-950 leading-snug line-clamp-2 tracking-[-0.01em]">
                          {product.name}
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs font-medium text-slate-400">
                          <div>Bảo hành: <span className="text-slate-600">{product.warranty ? `${product.warranty} tháng` : "Đang cập nhật"}</span></div>
                          <div>Kho hàng: <span className="text-emerald-600 font-semibold">{product.quantity > 0 ? "Còn hàng" : "Hết hàng"}</span></div>
                          <div className="col-span-2 truncate">Mã SP: <span className="text-slate-600">SP-${String(product.id).padStart(4, "0")}</span></div>
                        </div>
                      </div>

                      {/* Action & Price Column */}
                      <div className="flex flex-col items-end gap-2 shrink-0 w-full sm:w-auto">
                        <div className="flex flex-col items-end">
                          <span className="text-[15px] font-semibold text-[#e21a36]">
                            {Number(finalPrice).toLocaleString("vi-VN")}đ
                          </span>
                          {hasDiscount && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs text-slate-400 line-through font-medium">
                                {Number(originalPrice).toLocaleString("vi-VN")}đ
                              </span>
                              <span className="text-[10px] font-medium text-white bg-red-500 rounded px-1 py-0.5 select-none leading-none">
                                -{discountPercent}%
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => onSelect(product)}
                          disabled={product.quantity <= 0}
                          className={`w-full sm:w-auto rounded-xl px-5 py-2.5 text-sm font-semibold transition shrink-0 cursor-pointer flex items-center justify-center gap-1.5 leading-none shadow-sm ${
                            product.quantity <= 0
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                              : "bg-white hover:bg-slate-50 text-slate-900 border border-slate-900"
                          }`}
                        >
                          {product.quantity <= 0 ? "Hết hàng" : "Thêm vào cấu hình >"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-sm text-slate-400 font-medium">
                Không tìm thấy linh kiện phù hợp với các tiêu chí lọc.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

