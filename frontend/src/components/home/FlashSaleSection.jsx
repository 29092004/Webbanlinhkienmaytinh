import { ChevronLeft, ChevronRight, ImageOff, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export function FlashSaleSection({ products = [] }) {
  const pageSize = 4;
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxStartIndex = Math.max(products.length - pageSize, 0);
  const visibleProducts = useMemo(() => {
    return products.slice(currentIndex, currentIndex + pageSize);
  }, [currentIndex, products]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [products.length]);

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxStartIndex;

  return (
    <section className="bg-[#f8f9fa] py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#d32f2f] text-white px-4 py-2 rounded flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
              <Zap className="w-4 h-4 fill-current animate-pulse" /> Sản phẩm Sale
            </div>
            <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
              <span className="bg-gray-900 text-white px-2 py-1 rounded">02</span>
              <span>:</span>
              <span className="bg-gray-900 text-white px-2 py-1 rounded">45</span>
              <span>:</span>
              <span className="bg-gray-900 text-white px-2 py-1 rounded">12</span>
            </div>
          </div>
          <Link to="/products" className="text-[#d32f2f] hover:underline text-sm font-medium">
            Xem tất cả deal sốc &rarr;
          </Link>
        </div>


        <div className="relative">
          {products.length > pageSize ? (
            <>
              <button
                type="button"
                onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
                disabled={!canGoPrevious}
                aria-label="Xem sản phẩm sale trước"
                className="absolute -left-7 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 text-slate-700 shadow-md transition hover:border-red-200 hover:text-[#d32f2f] disabled:cursor-not-allowed disabled:opacity-40 md:inline-flex"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((index) => Math.min(index + 1, maxStartIndex))}
                disabled={!canGoNext}
                aria-label="Xem thêm sản phẩm sale"
                className="absolute -right-7 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 text-slate-700 shadow-md transition hover:border-red-200 hover:text-[#d32f2f] disabled:cursor-not-allowed disabled:opacity-40 md:inline-flex"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}

          <div className="mb-4 flex items-center justify-end gap-2 md:hidden">
            {products.length > pageSize ? (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
                  disabled={!canGoPrevious}
                  aria-label="Xem sản phẩm sale trước"
                  className="inline-flex rounded-full border border-gray-200 bg-white p-2 text-slate-700 shadow-sm transition hover:border-red-200 hover:text-[#d32f2f] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentIndex((index) => Math.min(index + 1, maxStartIndex))}
                  disabled={!canGoNext}
                  aria-label="Xem thêm sản phẩm sale"
                  className="inline-flex rounded-full border border-gray-200 bg-white p-2 text-slate-700 shadow-sm transition hover:border-red-200 hover:text-[#d32f2f] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.length > 0 ? (
            visibleProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col relative group hover:shadow-md transition-shadow">
                <div className="absolute top-3 left-3 bg-[#d32f2f] text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
                  {p.discount}
                </div>
                <Link to={`/product/${p.id}`} className="aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden p-2 flex items-center justify-center">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="object-cover w-full h-full rounded group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center rounded bg-gray-100 text-gray-400">
                      <ImageOff className="mb-2 size-10" />
                      <span className="text-xs font-medium">Chưa có hình ảnh</span>
                    </div>
                  )}
                </Link>
                <Link to={`/product/${p.id}`}>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">{p.name}</h3>
                </Link>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-[#d32f2f] font-bold text-base">{p.price}đ</span>
                  {p.originalPrice ? (
                    <span className="text-gray-400 text-xs line-through mb-0.5">{p.originalPrice}đ</span>
                  ) : null}
                </div>
                
                <div className="mt-auto">
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mb-1.5 overflow-hidden">
                    <div className="bg-[#d32f2f] h-full rounded-full" style={{ width: p.progressWidth }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 gap-3">
                    <span>{p.saleMeta}</span>
                    <span className="text-[#d32f2f] font-medium">Kho {p.quantity}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500">
              Chưa có sản phẩm sale để hiển thị.
            </div>
          )}
          </div>

          {products.length > pageSize ? (
            <div className="mt-5 flex items-center justify-center gap-2">
              {Array.from({ length: maxStartIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Xem vị trí sale ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    index === currentIndex ? "w-8 bg-[#d32f2f]" : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
