import { Cpu, CircuitBoard, MemoryStick, HardDrive, Power, Server, Box, Fan, Laptop, Monitor, Mouse, Keyboard, Headphones } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Vi Xử Lý (CPU)", icon: Cpu, id: "cpu" },
  { name: "Card Đồ Họa (GPU)", icon: CircuitBoard, id: "gpu" },
  { name: "RAM Bộ Nhớ", icon: MemoryStick, id: "ram" },
  { name: "Ổ Cứng SSD", icon: HardDrive, id: "ssd" },
  { name: "Nguồn Máy Tính", icon: Power, id: "psu" },
  { name: "Bo Mạch Chủ", icon: Server, id: "motherboard" },
  { name: "Vỏ Case PC", icon: Box, id: "case" },
  { name: "Tản Nhiệt", icon: Fan, id: "cooler" },
  { name: "Laptop Gaming", icon: Laptop, id: "laptop" },
  { name: "Màn Hình", icon: Monitor, id: "monitor" },
  { name: "Chuột Gaming", icon: Mouse, id: "mouse" },
  { name: "Bàn Phím Cơ", icon: Keyboard, id: "keyboard" },
  { name: "Tai Nghe", icon: Headphones, id: "headphones" }
];

export function CategorySection() {
  return (
    <section className="bg-slate-50 py-8 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <div className="border-l-4 border-slate-950 pl-3">
            <h2 className="m-0 text-[22px] font-semibold text-slate-900 tracking-[-0.02em]">
              Danh mục nổi bật
            </h2>
            <p className="mt-1 text-[15px] text-slate-500 font-medium tracking-[-0.01em]">Tìm kiếm nhanh linh kiện máy tính bạn mong muốn</p>
          </div>
          <Link to="/products" className="text-slate-900 hover:text-slate-700 hover:underline text-sm font-semibold tracking-[-0.01em] flex items-center gap-1">
            Tất cả danh mục &rarr;
          </Link>
        </div>
        
        {/* Horizontal scrollable container */}
        <div 
          className="flex overflow-x-auto gap-4 pb-4 scroll-smooth" 
          style={{ 
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #f1f5f9"
          }}
        >
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={`/products?category=${cat.id}`}
              className="group min-w-[130px] md:min-w-[140px] bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-slate-900 transition-all cursor-pointer border border-slate-100 shrink-0"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-3 bg-slate-50 rounded-full group-hover:bg-slate-900 transition-colors duration-300">
                <cat.icon className="w-6 h-6 text-slate-900 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-[15px] font-semibold leading-5 text-slate-800 tracking-[-0.01em] group-hover:text-slate-900 transition-colors duration-300">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

