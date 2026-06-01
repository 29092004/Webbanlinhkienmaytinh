import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";

export function CategoryProductSection({ title, subtitle, products = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCardsPerPage = () => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 1024) return 2;
    return 4;
  };

  const cardsPerPage = getCardsPerPage();
  const maxStartIndex = Math.max(products.length - cardsPerPage, 0);

  // Auto-slide effect
  useEffect(() => {
    if (products.length <= cardsPerPage || isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxStartIndex ? 0 : prev + 1));
    }, 4500); // slightly different timing from flash sale
    return () => clearInterval(timer);
  }, [products.length, maxStartIndex, isHovered, cardsPerPage]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxStartIndex));
  };

  const getTranslateXStyle = () => {
    if (windowWidth < 640) {
      return `translateX(calc(-${currentIndex} * (100% + 16px)))`;
    } else if (windowWidth < 1024) {
      return `translateX(calc(-${currentIndex} * (50% + 16px)))`;
    } else {
      return `translateX(calc(-${currentIndex} * (25% + 16px)))`;
    }
  };

  return (
    <section 
      className="bg-slate-50 border-t border-slate-100 py-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="mb-6 flex items-end justify-between">
          <div className="border-l-4 border-slate-950 pl-3">
            <h2 className="m-0 text-[22px] font-semibold text-slate-900 tracking-[-0.02em]">
              {title}
            </h2>
            <p className="mt-1 text-[15px] text-slate-500 font-medium tracking-[-0.01em]">{subtitle}</p>
          </div>
        </div>

        {/* Carousel Window */}
        <div className="relative">
          {products.length > cardsPerPage && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                aria-label={`Xem ${title} trước`}
                className="absolute -left-5 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-3 text-slate-700 shadow-lg transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:bg-white md:inline-flex"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex >= maxStartIndex}
                aria-label={`Xem thêm ${title}`}
                className="absolute -right-5 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-3 text-slate-700 shadow-lg transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:bg-white md:inline-flex"
              >
                <ChevronRight className="h-5 w-5 stroke-[2.5]" />
              </button>
            </>
          )}

          <div className="overflow-hidden py-4 px-1 -mx-1">
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-4"
              style={{ transform: getTranslateXStyle() }}
            >
              {products.length > 0 ? (
                products.map((product) => (
                  <div 
                    key={product.id} 
                    className="w-full sm:w-[calc(50%-8px)] md:w-[calc(25%-12px)] shrink-0"
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="w-full rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-700">
                  Danh mục này hiện chưa có sản phẩm.
                </div>
              )}
            </div>
          </div>

          {/* Dots Indicator */}
          {products.length > cardsPerPage && (
            <div className="mt-4 flex items-center justify-center gap-1.5">
              {Array.from({ length: maxStartIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-5 bg-slate-900" : "w-1.5 bg-slate-300 hover:bg-slate-450"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
