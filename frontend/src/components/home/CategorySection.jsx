import { useRef, useEffect } from "react";
import { Cpu, CircuitBoard, MemoryStick, HardDrive, Power, Server, Box, Fan, Headphones, Keyboard, Mouse } from "lucide-react";

const categories = [
  { name: "CPU", icon: Cpu },
  { name: "GPU", icon: CircuitBoard },
  { name: "RAM", icon: MemoryStick },
  { name: "SSD", icon: HardDrive },
  { name: "PSU", icon: Power },
  { name: "Mainboard", icon: Server },
  { name: "Vỏ Case", icon: Box },
  { name: "Tản Nhiệt", icon: Fan },
  { name: "Tai Nghe", icon: Headphones },
  { name: "Bàn Phím", icon: Keyboard },
  { name: "Chuột", icon: Mouse },
];

export function CategorySection() {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // Ignore if user is using horizontal scroll natively (like a trackpad)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const canScrollLeft = container.scrollLeft > 0;
      const canScrollRight = Math.ceil(container.scrollLeft) < container.scrollWidth - container.clientWidth;
      
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      if ((isScrollingDown && canScrollRight) || (isScrollingUp && canScrollLeft)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <section className="bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Khám phá theo danh mục
          </h2>
        </div>
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-6 snap-x scroll-smooth custom-scrollbar"
        >
          {categories.map((cat, i) => (
            <div key={i} className="bg-white rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all cursor-pointer min-w-[140px] snap-start border border-gray-100 flex-1">
              <div className="w-12 h-12 flex items-center justify-center mb-3">
                <cat.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
