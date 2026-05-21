import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  totalProducts,
  currentPage,
  pageSize,
  onPageChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}) {
  const totalPages = Math.ceil(totalProducts / pageSize);

  // Generate pagination buttons
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalProducts);

  return (
    <div className="flex-1 space-y-6">
      {/* Top Toolbar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* View Mode & Count */}
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border border-gray-200 p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Grid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="size-4" />
            </button>
          </div>
          <span className="text-xs text-gray-500 font-semibold">
            Hiển thị {totalProducts > 0 ? startIndex : 0}-{endIndex} của {totalProducts} kết quả
          </span>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-gray-500 font-bold whitespace-nowrap">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs font-bold text-gray-800 border border-gray-200 rounded-lg py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <p className="text-gray-500 text-sm font-semibold">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              : "flex flex-col gap-4"
          }
        >
          {products.map((product) =>
            viewMode === "grid" ? (
              <ProductCard key={product.id} product={product} />
            ) : (
              <div
                key={product.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex gap-4 relative group hover:shadow-md transition-shadow"
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
                  {product.tag && (
                    <span className={`text-[9px] font-bold text-white uppercase px-2 py-0.5 rounded tracking-wide ${product.tagColor || "bg-blue-600"}`}>
                      {product.tag}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded">
                      {product.discount}
                    </span>
                  )}
                </div>

                {/* Image */}
                <Link
                  to={`/product/${product.id || 3}`}
                  className="w-32 h-32 bg-slate-50 rounded-lg overflow-hidden p-2 flex items-center justify-center shrink-0"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full rounded group-hover:scale-102 transition-transform duration-300"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <Link to={`/product/${product.id || 3}`}>
                      <h3 className="font-bold text-gray-900 text-sm mb-1 hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                      Hãng: {product.brand} | VRAM: {product.vram}
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-4 mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-blue-600 font-extrabold text-base">
                        {product.price.toLocaleString("vi-VN")}đ
                      </span>
                      {product.originalPrice && (
                        <span className="text-gray-400 text-xs line-through">
                          {product.originalPrice.toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 text-xs font-bold transition-colors">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 pt-6">
          {/* Prev Arrow */}
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="flex items-center justify-center size-8 rounded-lg border border-slate-200 bg-white text-gray-500 hover:border-gray-300 disabled:opacity-40 disabled:hover:border-slate-200 transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="flex items-center justify-center size-8 text-gray-400 text-xs font-bold"
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
                className={`flex items-center justify-center size-8 rounded-lg text-xs font-bold transition-colors border ${
                  isActive
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-slate-200 text-gray-600 hover:border-gray-300"
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
            className="flex items-center justify-center size-8 rounded-lg border border-slate-200 bg-white text-gray-500 hover:border-gray-300 disabled:opacity-40 disabled:hover:border-slate-200 transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
