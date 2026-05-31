import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductHoverPopup } from "@/components/products/ProductHoverPopup";

export function FlashSaleSection({ products = [] }) {
  // 1. Live Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: "02", minutes: "00", seconds: "00" });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diff = endOfDay.getTime() - now.getTime();
      if (diff <= 0) {
        return { hours: "00", minutes: "00", seconds: "00" };
      }

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      return {
        hours: String(hrs).padStart(2, "0"),
        minutes: String(mins).padStart(2, "0"),
        seconds: String(secs).padStart(2, "0")
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. Responsive Carousel Slide Logic
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  // Hover position state for product cards
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [coords, setCoords] = useState(null);
  const cardRefs = useRef({});

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

  // Auto-play interval
  useEffect(() => {
    if (products.length <= cardsPerPage || isHovered) return;
    const autoPlayTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxStartIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(autoPlayTimer);
  }, [products.length, maxStartIndex, isHovered, cardsPerPage]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxStartIndex));
  };

  const updateCardCoords = (e) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const { clientX, clientY } = e;

    const popupWidth = 700;
    const popupHeight = 440; // Conservative height estimate to prevent bottom clipping

    let left = 0;
    if (clientX > windowWidth / 2) {
      left = clientX - popupWidth - 24;
    } else {
      left = clientX + 24;
    }

    if (left < 12) {
      left = 12;
    } else if (left + popupWidth > windowWidth - 12) {
      left = windowWidth - popupWidth - 12;
    }

    let top = 0;
    if (clientY > windowHeight / 2) {
      // Near bottom: position popup above the cursor so it isn't cut off
      top = clientY - popupHeight - 15;
    } else {
      // Near top: position popup aligned/below the cursor
      top = clientY - 80;
    }

    // Viewport height safety boundaries
    if (top + popupHeight > windowHeight - 12) {
      top = windowHeight - popupHeight - 12;
    }
    if (top < 12) {
      top = 12;
    }

    setCoords({ top, left });
  };

  const handleCardMouseEnter = (productId, e) => {
    setHoveredProductId(productId);
    updateCardCoords(e);
  };

  const handleCardMouseMove = (productId, e) => {
    updateCardCoords(e);
  };

  const getTranslateXStyle = () => {
    if (windowWidth < 640) {
      // 1 card per page, 16px gap
      return `translateX(calc(-${currentIndex} * (100% + 16px)))`;
    } else if (windowWidth < 1024) {
      // 2 cards per page, 16px gap
      return `translateX(calc(-${currentIndex} * (50% + 16px)))`;
    } else {
      // 4 cards per page, 16px gap
      return `translateX(calc(-${currentIndex} * (25% + 16px)))`;
    }
  };

  return (
    <section className="bg-slate-50 py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-[#e21a36] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-black uppercase tracking-wider text-xs shadow-md shadow-red-100">
              <Zap className="w-4 h-4 fill-current animate-pulse text-yellow-300" /> GIÁ TỐT MỖI NGÀY
            </div>
            <div className="flex items-center gap-2 font-extrabold text-sm text-slate-800">
              <span className="text-xs uppercase text-slate-400 font-bold tracking-wider mr-1">Kết thúc sau:</span>
              <span className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg font-mono text-sm tracking-widest">{timeLeft.hours}</span>
              <span className="text-slate-950 animate-pulse">:</span>
              <span className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg font-mono text-sm tracking-widest">{timeLeft.minutes}</span>
              <span className="text-slate-950 animate-pulse">:</span>
              <span className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg font-mono text-sm tracking-widest">{timeLeft.seconds}</span>
            </div>
          </div>
          <Link to="/products" className="text-[#e21a36] hover:text-red-700 hover:underline text-xs font-bold uppercase tracking-widest">
            Xem tất cả deal sốc &rarr;
          </Link>
        </div>

        {/* Carousel Area */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setHoveredProductId(null);
          }}
        >
          {/* Navigation Controls */}
          {products.length > cardsPerPage && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                aria-label="Xem sản phẩm sale trước"
                className="absolute -left-5 top-1/2 z-30 -translate-y-1/2 rounded-full border border-slate-100 bg-white p-3 text-slate-700 shadow-lg transition hover:bg-slate-50 hover:text-[#e21a36] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-slate-700 md:inline-flex hidden"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex >= maxStartIndex}
                aria-label="Xem thêm sản phẩm sale"
                className="absolute -right-5 top-1/2 z-30 -translate-y-1/2 rounded-full border border-slate-100 bg-white p-3 text-slate-700 shadow-lg transition hover:bg-slate-50 hover:text-[#e21a36] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-slate-700 md:inline-flex hidden"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </>
          )}

          {/* Carousel Slider Container */}
          <div className="overflow-hidden py-4 px-1 -mx-1">
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-4"
              style={{ transform: getTranslateXStyle() }}
            >
              {products.length > 0 ? (
                products.map((p) => (
                  <div 
                    key={p.id} 
                    ref={(el) => (cardRefs.current[p.id] = el)}
                    onMouseEnter={(e) => handleCardMouseEnter(p.id, e)}
                    onMouseMove={(e) => handleCardMouseMove(p.id, e)}
                    onMouseLeave={() => {
                      setHoveredProductId(null);
                      setCoords(null);
                    }}
                    className="w-full sm:w-[calc(50%-8px)] md:w-[calc(25%-12px)] shrink-0 bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)] border border-slate-100 flex flex-col relative group hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300"
                  >
                    {/* Hover spec details popup */}
                    {hoveredProductId === p.id && (
                      <ProductHoverPopup product={p} coords={coords} />
                    )}

                    {/* Sale label */}
                    <div className="absolute top-3 left-3 bg-[#e21a36] text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg z-10 shadow-sm">
                      {p.discount || "Sale"}
                    </div>
                    
                    {/* Image container */}
                    <Link to={`/product/${p.id}`} className="aspect-square bg-slate-50 rounded-xl mb-4 overflow-hidden p-3 flex items-center justify-center">
                      {p.image ? (
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="object-cover w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <ImageOff className="mb-2 size-10" />
                          <span className="text-xs font-semibold">Chưa có hình ảnh</span>
                        </div>
                      )}
                    </Link>

                    {/* Title */}
                    <Link to={`/product/${p.id}`} className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[40px]">
                        {p.name}
                      </h3>
                    </Link>

                    {/* Pricing */}
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-[#e21a36] font-extrabold text-base">{p.price}đ</span>
                      {p.originalPrice ? (
                        <span className="text-slate-400 text-xs line-through mb-0.5 font-medium">{p.originalPrice}đ</span>
                      ) : null}
                    </div>
                    
                    {/* Progress details */}
                    <div className="mt-auto pt-2 border-t border-slate-50">
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mb-1.5 overflow-hidden">
                        <div className="bg-[#e21a36] h-full rounded-full" style={{ width: p.progressWidth || "40%" }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                        <span className="text-slate-400">{p.saleMeta || "Đang bán chạy"}</span>
                        <span className="text-[#e21a36]">Còn lại {p.quantity || 5}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
                  Chưa có sản phẩm giá tốt để hiển thị.
                </div>
              )}
            </div>
          </div>

          {/* Dots Indicator */}
          {products.length > cardsPerPage && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: maxStartIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Xem vị trí sale ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-6 bg-[#e21a36]" : "w-2 bg-slate-300 hover:bg-slate-400"
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
