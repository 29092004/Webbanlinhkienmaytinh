import { useState } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductSpecsTable } from "@/components/products/ProductSpecsTable";
import { ProductReviewsTab } from "@/components/products/ProductReviewsTab";
import { ProductCard } from "@/components/products/ProductCard";
import { Shield, Truck, Database, Star, ShoppingBag, CreditCard } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const mockProduct = {
  id: 3,
  name: "ASUS ROG Strix NVIDIA GeForce RTX 4080 Super OC Edition",
  brand: "ASUS",
  price: 32490000,
  originalPrice: 35990000,
  rating: 5,
  reviewsCount: 48,
  badgeText: "MỚI VỀ",
  images: [
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop"
  ],
  highlightSpecs: [
    { label: "BỘ NHỚ", val: "16GB GDDR6X" },
    { label: "XUNG NHỊP", val: "2640 MHz (OC)" },
    { label: "NHÂN CUDA", val: "10240" },
    { label: "CÔNG SUẤT NGUỒN", val: "750W trở lên" }
  ],
  specs: {
    "Thương hiệu": "ASUS",
    "Model": "ROG Strix GeForce RTX™ 4080 SUPER 16GB GDDR6X OC Edition",
    "Graphic Engine": "NVIDIA® GeForce RTX™ 4080 SUPER",
    "Bus Standard": "PCI Express 4.0",
    "Video Memory": "16GB GDDR6X",
    "Engine Clock": "OC mode: 2670 MHz | Default mode: 2640 MHz (Boost Clock)",
    "CUDA Core": "10240",
    "Memory Speed": "23 Gbps",
    "Interface": "HDMI 2.1a x 2, DisplayPort 1.4a x 3",
    "Dimensions": "357.6 x 149.3 x 70.1 mm"
  }
};

const mockRelated = [
  {
    id: 101,
    name: "MSI GeForce RTX 4070 Ti SUPER 16G GAMING X SLIM",
    brand: "NVIDIA",
    price: 24990000,
    originalPrice: 26500000,
    rating: 5,
    reviewsCount: 34,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop",
    tag: "SELLING FAST",
    tagColor: "bg-red-600"
  },
  {
    id: 102,
    name: "Corsair RM1000e 1000W 80 Plus Gold - Modular",
    brand: "Power Supply",
    price: 4250000,
    originalPrice: 4890000,
    rating: 4.8,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 103,
    name: "G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz",
    brand: "Memory",
    price: 3490000,
    originalPrice: 3990000,
    rating: 5,
    reviewsCount: 52,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop",
    tag: "HOT",
    tagColor: "bg-indigo-600"
  },
  {
    id: 104,
    name: "Samsung 990 Pro 2TB M.2 NVMe PCIe Gen 4.0",
    brand: "Storage",
    price: 5190000,
    originalPrice: 5990000,
    rating: 4.9,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=400&auto=format&fit=crop"
  }
];

function ProductDetail() {
  const [activeTab, setActiveTab] = useState("specs");

  const savingAmount = mockProduct.originalPrice - mockProduct.price;
  const savingPct = Math.round((savingAmount / mockProduct.originalPrice) * 100);

  const tabs = [
    { id: "specs", label: "THÔNG SỐ KỸ THUẬT" },
    { id: "desc", label: "MÔ TẢ CHI TIẾT" },
    { id: "reviews", label: `ĐÁNH GIÁ (${mockProduct.reviewsCount})` }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-8">
        
        {/* Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Linh kiện PC", href: "/products" },
            { label: "Card đồ họa", href: "/products" },
            { label: mockProduct.name },
          ]}
        />

        {/* Product Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 w-full">
            <ProductGallery images={mockProduct.images} />
          </div>

          {/* Right Column: Order Details */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              {mockProduct.badgeText && (
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">
                  {mockProduct.badgeText}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                {mockProduct.name}
              </h1>

              {/* Stars & review counter */}
              <div className="flex items-center gap-1.5 mt-3">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-semibold">
                  ({mockProduct.reviewsCount} đánh giá)
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-black text-blue-600">
                  {mockProduct.price.toLocaleString("vi-VN")}đ
                </span>
                {mockProduct.originalPrice && (
                  <span className="text-gray-400 line-through text-sm font-semibold">
                    {mockProduct.originalPrice.toLocaleString("vi-VN")}đ
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-red-600">
                Tiết kiệm: {savingAmount.toLocaleString("vi-VN")}đ ({savingPct}%)
              </p>
            </div>

            {/* Policy Checklists */}
            <div className="space-y-3 pl-1">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                <Shield className="size-4.5 text-blue-600 shrink-0" />
                <span>Bảo hành chính hãng 36 tháng</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                <Truck className="size-4.5 text-blue-600 shrink-0" />
                <span>Miễn phí vận chuyển toàn quốc</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                <Database className="size-4.5 text-blue-600 shrink-0" />
                <span>Tình trạng: <span className="text-emerald-600 font-extrabold">Còn hàng</span></span>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors uppercase">
                  <ShoppingBag className="size-4" />
                  MUA NGAY
                </button>
                <button className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-extrabold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors uppercase">
                  Thêm giỏ hàng
                </button>
              </div>
              <button className="w-full bg-[#1e293b] hover:bg-[#0f172a] text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors uppercase">
                <CreditCard className="size-4" />
                TRẢ GÓP 0% QUA THẺ TÍN DỤNG
              </button>
            </div>

            {/* highlight specs */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-4">Thông số nổi bật</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {mockProduct.highlightSpecs.map((spec, i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-xl p-3 text-center shadow-sm">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1">{spec.label}</span>
                    <span className="block text-xs font-extrabold text-slate-800 leading-tight">{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Sections */}
        <div className="space-y-6 pt-6">
          {/* Tab Header Row */}
          <div className="border-b border-slate-200 flex overflow-x-auto no-scrollbar gap-6 md:gap-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-xs md:text-sm font-bold tracking-wider whitespace-nowrap border-b-2 transition-all ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div>
            {activeTab === "specs" && (
              <ProductSpecsTable specs={mockProduct.specs} />
            )}

            {activeTab === "desc" && (
              <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-4 text-sm text-gray-600 font-medium leading-relaxed">
                <h3 className="font-bold text-gray-900 text-base">Đặc điểm nổi bật ROG Strix GeForce RTX 4080 SUPER</h3>
                <p>
                  ROG Strix GeForce RTX 4080 SUPER mang lại một ý nghĩa hoàn toàn mới cho việc cuốn theo dòng chảy. 
                  Bên trong và bên ngoài, mọi thành phần của card đồ họa đều mang đến cho GPU khổng lồ khoảng trống 
                  để thở tự do và đạt được hiệu suất tối đa. 
                </p>
                <p>
                  Kiến trúc NVIDIA Ada Lovelace được nâng tầm nhờ khả năng làm mát và phân phối điện năng được nâng cấp, 
                  và được bảo vệ bởi kho vũ khí gồm các thanh gia cố chắc chắn để nâng đỡ khung card. Hãy cắm điện, 
                  trải nghiệm chơi game đỉnh cao cùng ROG Strix GeForce RTX 4080 SUPER.
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <ProductReviewsTab />
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        <div className="border-t border-slate-200 pt-8 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-black text-gray-900 text-xl tracking-tight">Sản phẩm liên quan</h2>
              <p className="text-xs text-gray-500 font-semibold mt-1">Có thể bạn sẽ quan tâm đến những linh kiện này</p>
            </div>
            <a href="/products" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Xem tất cả →
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockRelated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default ProductDetail;
