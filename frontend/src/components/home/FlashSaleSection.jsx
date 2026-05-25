import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const flashSaleProducts = [
  {
    discount: "-25%",
    name: "NVIDIA RTX 4070 Super",
    price: "16.990.000đ",
    originalPrice: "22.900.000đ",
    soldPercentage: 89,
    remaining: 5,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop"
  },
  {
    discount: "-15%",
    name: "AMD Ryzen 7 7800X3D",
    price: "8.490.000đ",
    originalPrice: "9.900.000đ",
    soldPercentage: 90,
    remaining: 2,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop"
  },
  {
    discount: "-30%",
    name: "Kingston NV2 1TB Gen4",
    price: "1.250.000đ",
    originalPrice: "1.800.000đ",
    soldPercentage: 60,
    remaining: 10,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=400&auto=format&fit=crop"
  },
  {
    discount: "-20%",
    name: "Corsair RM850e Gold",
    price: "2.890.000đ",
    originalPrice: "3.600.000đ",
    soldPercentage: 40,
    remaining: 45,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop"
  }
];

export function FlashSaleSection() {
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {flashSaleProducts.map((p, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col relative group hover:shadow-md transition-shadow">
              <div className="absolute top-3 left-3 bg-[#d32f2f] text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
                {p.discount}
              </div>
              <Link to="/product/3" className="aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden p-2 flex items-center justify-center">
                <img src={p.image} alt={p.name} className="object-cover w-full h-full rounded group-hover:scale-105 transition-transform duration-300" />
              </Link>
              <Link to="/product/3">
                <h3 className="font-bold text-gray-900 text-sm mb-1 truncate hover:text-[#d32f2f] transition-colors">{p.name}</h3>
              </Link>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-[#d32f2f] font-bold text-base">{p.price}</span>
                <span className="text-gray-400 text-xs line-through mb-0.5">{p.originalPrice}</span>
              </div>
              
              <div className="mt-auto">
                <div className="w-full bg-gray-100 h-1.5 rounded-full mb-1.5 overflow-hidden">
                  <div className="bg-[#d32f2f] h-full rounded-full" style={{ width: `${p.soldPercentage}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-3">
                  <span>Đã bán {p.soldPercentage}%</span>
                  <span className="text-[#d32f2f] font-medium">Còn lại {p.remaining}</span>
                </div>
                <button className="w-full bg-[#d32f2f] hover:bg-red-800 text-white rounded-lg py-2 text-xs font-bold transition-colors">
                  MUA NGAY
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
