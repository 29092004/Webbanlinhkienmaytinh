import { Zap } from "lucide-react";

const flashSaleProducts = [
  {
    discount: "-25%",
    name: "NVIDIA RTX 4070 Super",
    price: "15.990.000đ",
    originalPrice: "19.990.000đ",
    soldPercentage: 80,
    remaining: 5,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=600&auto=format&fit=crop"
  },
  {
    discount: "-15%",
    name: "AMD Ryzen 7 7800X3D",
    price: "8.490.000đ",
    originalPrice: "9.990.000đ",
    soldPercentage: 90,
    remaining: 2,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop"
  },
  {
    discount: "-30%",
    name: "Kingston NV2 1TB Gen4",
    price: "1.250.000đ",
    originalPrice: "1.800.000đ",
    soldPercentage: 40,
    remaining: 18,
    image: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?q=80&w=600&auto=format&fit=crop"
  },
  {
    discount: "-20%",
    name: "Corsair RM850e Gold",
    price: "2.890.000đ",
    originalPrice: "3.600.000đ",
    soldPercentage: 10,
    remaining: 45,
    image: "https://images.unsplash.com/photo-1563158114-e47852df85e1?q=80&w=600&auto=format&fit=crop"
  },
  {
    discount: "-15%",
    name: "LG UltraGear 27\" 2K",
    price: "7.190.000đ",
    originalPrice: "8.500.000đ",
    soldPercentage: 60,
    remaining: 10,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop"
  },
  {
    discount: "-28%",
    name: "Razer DeathAdder V3 Pro",
    price: "2.490.000đ",
    originalPrice: "3.500.000đ",
    soldPercentage: 75,
    remaining: 8,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop"
  },
  {
    discount: "-32%",
    name: "Dây Cáp Riser PCIe 4.0",
    price: "890.000đ",
    originalPrice: "1.300.000đ",
    soldPercentage: 20,
    remaining: 40,
    image: "https://images.unsplash.com/photo-1555617783-605809ce9501?q=80&w=600&auto=format&fit=crop"
  },
  {
    discount: "-12%",
    name: "HyperX Cloud II Wireless",
    price: "2.990.000đ",
    originalPrice: "3.400.000đ",
    soldPercentage: 50,
    remaining: 15,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop"
  }
];

export function FlashSaleSection() {
  return (
    <section className="bg-[#f8f9fa] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#d32f2f] text-white px-4 py-2 rounded flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
              <Zap className="w-4 h-4 fill-current" /> Sản phẩm Sale
            </div>
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="bg-gray-900 text-white px-2 py-1 rounded">02</span>
              <span>:</span>
              <span className="bg-gray-900 text-white px-2 py-1 rounded">45</span>
              <span>:</span>
              <span className="bg-gray-900 text-white px-2 py-1 rounded">12</span>
            </div>
          </div>
          <a href="/sale" className="text-[#d32f2f] hover:underline text-sm font-medium">
            Xem tất cả đang sale &rarr;
          </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {flashSaleProducts.map((p, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col relative group">
              <div className="absolute top-2 left-2 bg-[#d32f2f] text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
                {p.discount}
              </div>
              <div className="aspect-square bg-gray-50 rounded mb-4 overflow-hidden p-2 flex items-center justify-center">
                <img src={p.image} alt={p.name} className="object-contain max-h-full group-hover:scale-105 transition-transform" />
              </div>
              <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{p.name}</h3>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-[#d32f2f] font-bold text-base">{p.price}</span>
                <span className="text-gray-400 text-xs line-through mb-0.5">{p.originalPrice}</span>
              </div>
              
              <div className="mt-auto">
                <div className="w-full bg-gray-200 h-1.5 rounded-full mb-1.5 overflow-hidden">
                  <div className="bg-[#d32f2f] h-full rounded-full" style={{ width: `${p.soldPercentage}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-3">
                  <span>Đã bán {p.soldPercentage}%</span>
                  <span className="text-[#d32f2f] font-medium">Còn lại {p.remaining}</span>
                </div>
                <button className="w-full bg-[#d32f2f] hover:bg-red-800 text-white rounded py-2 text-xs font-bold transition-colors">
                  MUA NGAY
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <button className="border border-[#d32f2f] text-[#d32f2f] hover:bg-red-50 bg-white px-6 py-2 rounded text-sm font-medium transition-colors">
            Xem thêm sản phẩm sale &or;
          </button>
        </div>
      </div>
    </section>
  );
}
