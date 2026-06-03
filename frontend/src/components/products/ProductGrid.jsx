import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useState } from "react";

export function ProductGrid({
  products,
  totalProducts,
  displayTotalCount,
  currentPage,
  pageSize,
  onPageChange,
  sortBy,
  onSortChange,
  isLoading = false,
  title = "Tất cả sản phẩm",
}) {
  const totalPages = Math.ceil(totalProducts / pageSize);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Generate pagination buttons
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage <= 4) {
      pages.push(2, 3, 4, 5, "...", totalPages);
      return pages;
    }

    if (currentPage >= totalPages - 3) {
      pages.push(
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
      return pages;
    }

    pages.push(
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages
    );

    return pages;
  };

  const sortLabelMap = {
    newest: "Mới nhất",
    "price-asc": "Giá: Thấp đến Cao",
    "price-desc": "Giá: Cao đến Thấp",
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Title & Sort Header */}
      <div className="flex items-center justify-between pb-2">
        <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
          {title}
          <span className="text-[14px] font-medium text-slate-400">({displayTotalCount || totalProducts} kết quả)</span>
        </h1>

        {/* Sort Select */}
        <div className="relative flex items-center gap-2">
          <span className="text-[13px] font-medium text-slate-400">Sắp xếp:</span>
          
          <button
            type="button"
            onClick={() => setIsSortOpen((prev) => !prev)}
            className="flex items-center gap-1 text-[13px] font-bold text-slate-900 focus:outline-none hover:underline"
          >
            <span>{sortLabelMap[sortBy] || "Mới nhất"}</span>
            <ChevronDown className={`size-4 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-8 z-30 w-44 rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
              {Object.entries(sortLabelMap).map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onSortChange(key);
                    setIsSortOpen(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold transition hover:bg-slate-50 ${
                    sortBy === key ? "text-slate-900 bg-slate-100" : "text-slate-700"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm">
          <p className="text-slate-400 text-sm font-semibold">Dang tai san pham...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm">
          <p className="text-slate-400 text-sm font-semibold">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          {/* Prev Arrow */}
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="flex items-center justify-center size-9 rounded-full bg-white text-slate-400 hover:text-slate-800 disabled:opacity-40 disabled:hover:text-slate-400 transition-colors shadow-sm border border-slate-100 cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="flex items-center justify-center size-9 text-slate-400 text-sm font-bold"
                >
                  ...
                </span>
              );
            }
            const isActive = currentPage === page;
            return (
              <button
                key={`page-${page}`}
                type="button"
                onClick={() => onPageChange(page)}
                className={`flex items-center justify-center size-9 rounded-full text-xs font-bold transition-all shadow-sm border cursor-pointer ${
                  isActive
                    ? "bg-red-600 border-red-600 text-white font-extrabold"
                    : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next Arrow */}
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="flex items-center justify-center size-9 rounded-full bg-white text-slate-400 hover:text-slate-800 disabled:opacity-40 disabled:hover:text-slate-400 transition-colors shadow-sm border border-slate-100 cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
