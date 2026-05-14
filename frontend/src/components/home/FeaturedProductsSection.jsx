import { ShoppingCart } from "lucide-react";

const products = [
  {
    badge: "HOT",
    badgeColor: "bg-blue-600",
    name: "Intel Core i9-14900K",
    desc: "6.0 GHz Turbo | 24 Cores",
    price: "15.490.000₫",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800&auto=format&fit=crop"
  },
  {
    badge: null,
    name: "ROG Strix Z790-E WiFi",
    desc: "DDR5 | PCIe 5.0 | WiFi 6E",
    price: "11.290.000₫",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
  },
  {
    badge: null,
    name: "Corsair Dominator 32GB",
    desc: "DDR5 6000MHz RGB White",
    price: "4.890.000₫",
    image: "https://images.unsplash.com/photo-1563158114-e47852df85e1?q=80&w=800&auto=format&fit=crop"
  },
  {
    badge: "MỚI",
    badgeColor: "bg-orange-500",
    name: "Samsung 990 Pro 2TB",
    desc: "Read 7450MB/s | Write 6900MB/s",
    price: "5.150.000₫",
    image: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?q=80&w=800&auto=format&fit=crop"
  },
  {
    badge: null,
    name: "Lian Li O11 Dynamic EVO",
    desc: "White | Mid Tower Case",
    price: "4.250.000₫",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop"
  },
  {
    badge: null,
    name: "NZXT Kraken Elite 360",
    desc: "LCD Display | RGB Liquid Cooler",
    price: "7.890.000₫",
    image: "https://images.unsplash.com/photo-1555617783-605809ce9501?q=80&w=800&auto=format&fit=crop"
  }
];

export function FeaturedProductsSection() {
  return (
    <section className="bg-[#f8f9fa] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Sản Phẩm Nổi Bật</h2>
          <p className="text-xs text-gray-500 font-medium">Những linh kiện được các chuyên gia TECHSPEC khuyên dùng</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col group">
              {p.badge && (
                <div className={`absolute top-4 left-4 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10 ${p.badgeColor}`}>
                  {p.badge}
                </div>
              )}
              <div className="aspect-square bg-gray-50 rounded mb-4 overflow-hidden p-2 flex items-center justify-center relative">
                <img src={p.image} alt={p.name} className="object-contain max-h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{p.name}</h3>
              <p className="text-[11px] text-gray-500 mb-4">{p.desc}</p>
              <div className="mt-auto">
                <div className="text-blue-600 font-bold text-base mb-3">{p.price}</div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
