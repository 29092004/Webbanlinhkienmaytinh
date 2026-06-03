import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";


import subBannerDeal from "@/assets/home-banners/sub-banner-deal.png";
import subBannerInstallment from "@/assets/home-banners/sub-banner-installment.png";

const slides = [
  {
    image: "https://pub-a37bb828e19547c6ac16ab62282dd9e5.r2.dev/Anh_Banner_1.jpg",
    
  },
  {
    image: "https://pub-a37bb828e19547c6ac16ab62282dd9e5.r2.dev/banner_2.jpg",
  },
  {
    image: "https://pub-a37bb828e19547c6ac16ab62282dd9e5.r2.dev/bannner_3.jpg",
    
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  return (
    <section className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Main Carousel Slider */}
          <div className="relative lg:col-span-9 aspect-[2392/680] w-full overflow-hidden rounded-2xl bg-slate-50 group border border-slate-100 shadow-sm">
            {/* Slider Content */}
            <div 
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="relative min-w-full h-full bg-white flex items-center justify-center">
                  <img 
                    src={slide.image} 
                    alt={`Banner ${index + 1}`} 
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/1200x500/1e293b/ffffff?text=EXO+CORE+Banner+${index + 1}`;
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    current === index ? "bg-white w-4" : "bg-white/55 hover:bg-white/85"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Sub Banners on the Right */}
          <div className="lg:col-span-3 lg:flex lg:flex-col lg:gap-4 hidden">
            {/* Sub Banner 1 */}
            <div className="flex-1 rounded-2xl p-4 border border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-red-500/40 transition-all duration-300">
              <img 
                src={subBannerDeal} 
                alt="Hot Deal" 
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/80 to-transparent z-10"></div>
              
              <div className="relative z-20">
                <span className="bg-red-600 text-white text-[9px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded-md">
                  HOT DEAL
                </span>
                <h4 className="text-white font-extrabold text-[14px] tracking-tight mt-1.5 font-sans drop-shadow-md">
                  Linh Kiện Giá Sốc
                </h4>
                <p className="text-slate-300 text-[10px] font-medium mt-0.5 leading-normal max-w-[170px] line-clamp-1 drop-shadow-sm">
                  RAM, SSD & VGA giảm cực sâu đến 45% tuần này.
                </p>
              </div>
              <div className="relative z-20 flex items-center text-red-500 text-[11px] font-bold gap-1 mt-2 group-hover:text-red-400">
                Săn deal ngay &rarr;
              </div>
            </div>

            {/* Sub Banner 2 */}
            <div className="flex-1 rounded-2xl p-4 border border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-blue-500/40 transition-all duration-300">
              <img 
                src={subBannerInstallment} 
                alt="Installment 0%" 
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/80 to-transparent z-10"></div>
              
              <div className="relative z-20">
                <span className="bg-blue-600 text-white text-[9px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded-md">
                  TRẢ GÓP 0%
                </span>
                <h4 className="text-white font-extrabold text-[14px] tracking-tight mt-1.5 font-sans drop-shadow-md">
                  Sắm PC Dễ Dàng
                </h4>
                <p className="text-slate-300 text-[10px] font-medium mt-0.5 leading-normal max-w-[170px] line-clamp-1 drop-shadow-sm">
                  Hỗ trợ trả góp 0% lãi suất qua hơn 20 ngân hàng.
                </p>
              </div>
              <div className="relative z-20 flex items-center text-blue-500 text-[11px] font-bold gap-1 mt-2 group-hover:text-blue-400">
                Xem chi tiết &rarr;
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
