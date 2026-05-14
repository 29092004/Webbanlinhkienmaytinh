import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=1600&auto=format&fit=crop",
    badge: "New Arrival",
    title: "Next-Gen Performance.\nExplore RTX 50 Series.",
  },
  {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    badge: "Hot Deal",
    title: "Build Your Dream PC.\nSave up to 30%.",
  },
  {
    image: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?q=80&w=1600&auto=format&fit=crop",
    badge: "Limited Stock",
    title: "Ultra Fast Gen 5 SSDs.\nInstant Load Times.",
  }
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
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-xl overflow-hidden h-[300px] md:h-[400px] lg:h-[500px] group">
          
          {/* Slider Content */}
          <div 
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="min-w-full relative h-full">
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 md:p-12">
                  <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded mb-4 inline-block uppercase tracking-wider">
                    {slide.badge}
                  </div>
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight whitespace-pre-line">
                    {slide.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  current === index ? "bg-blue-600" : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
