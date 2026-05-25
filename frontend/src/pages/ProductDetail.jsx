import { useState } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductSpecsTable } from "@/components/products/ProductSpecsTable";
import { ProductReviewsTab } from "@/components/products/ProductReviewsTab";
import { ProductCard } from "@/components/products/ProductCard";
import { Shield, Truck, Database, Star, ShoppingBag, CreditCard, Zap, CheckCircle2 } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";

const mockProduct = {
  id: 3,
  name: "ASUS ROG Strix RTX 4080 Super OC Edition",
  brand: "ASUS",
  sku: "ROG-RTX4080S-O16G",
  price: 32490000,
  originalPrice: 35990000,
  rating: 4.8,
  reviewsCount: 1240,
  badgeText: "NEW ARRIVAL",
  images: [
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=600&auto=format&fit=crop", // ASUS GPU main
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=600&auto=format&fit=crop", // back ports
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop", // board chip
    "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=600&auto=format&fit=crop"  // installed in case
  ],
  specs: {
    "Thương hiệu": "ASUS",
    "Model": "ROG Strix GeForce RTX™ 4080 SUPER OC",
    "Engine": "NVIDIA® GeForce RTX™ 4080 SUPER",
    "Chuẩn Bus": "PCI Express 4.0",
    "Bộ nhớ": "16GB GDDR6X",
    "Xung nhịp": "OC: 2670 MHz | Default: 2640 MHz",
    "Cổng xuất hình": "HDMI 2.1a x 2, DisplayPort 1.4a x 3",
    "Kích thước": "357.6 x 149.3 x 70.1 mm (3.5 Slot)"
  }
};

const mockRelated = [
  {
    id: 101,
    name: "MSI GeForce RTX 4070 Ti SUPER GAMING X SLIM",
    brand: "MSI",
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
    brand: "Corsair",
    price: 4250000,
    originalPrice: 4890000,
    rating: 4.8,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 103,
    name: "G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz",
    brand: "G.Skill",
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
    brand: "Samsung",
    price: 5190000,
    originalPrice: 5990000,
    rating: 4.9,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=400&auto=format&fit=crop"
  }
];

function ProductDetail() {
  const navigate = useNavigate();
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
            { label: "Card đồ họa (GPU)", href: "/products" },
            { label: "NVIDIA GeForce RTX 4080 Super" }
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
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400">
                  SKU: {mockProduct.sku}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight leading-snug">
                {mockProduct.name}
              </h1>

              {/* Stars & review counter */}
              <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-slate-500">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-amber-500 font-bold">{mockProduct.rating}</span>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className="text-blue-600 hover:underline transition font-bold"
                >
                  1.240 Đánh giá
                </button>
                <span className="text-slate-300">|</span>
                <span>Đã bán 1.5k</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-red-50/10 border border-red-100 rounded-3xl p-5 shadow-sm space-y-2 relative overflow-hidden">
              <div className="flex items-baseline gap-3 flex-wrap relative z-10">
                <span className="text-3xl font-black text-red-600">
                  {mockProduct.price.toLocaleString("vi-VN")}đ
                </span>
                {mockProduct.originalPrice && (
                  <span className="text-slate-400 line-through text-sm font-semibold">
                    {mockProduct.originalPrice.toLocaleString("vi-VN")}đ
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-red-500 relative z-10">
                <span className="bg-red-50 text-red-500 border border-red-200 rounded px-1.5 py-0.5 text-[9px] mr-2">-{savingPct}%</span>
                Tiết kiệm {savingAmount.toLocaleString("vi-VN")}đ
              </p>
            </div>



            {/* Actions Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/checkout")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors uppercase cursor-pointer"
                >
                  MUA NGAY
                </button>
                <button
                  onClick={() => alert(`Đã thêm ${mockProduct.name} vào giỏ hàng thành công!`)}
                  className="bg-[#e21a36] hover:bg-red-700 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors uppercase cursor-pointer"
                >
                  <ShoppingBag className="size-4" />
                  THÊM GIỎ HÀNG
                </button>
              </div>
              <button className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-2xl text-[10px] flex items-center justify-center transition-colors uppercase">
                TRẢ GÓP 0% QUA THẺ TÍN DỤNG (XÉT DUYỆT TỨC THÌ)
              </button>
            </div>
          </div>
        </div>

        {/* Tab Sections */}
        <div className="space-y-6 pt-2">
          {/* Tab Header Row */}
          <div className="border-b border-slate-200 flex overflow-x-auto no-scrollbar gap-6 md:gap-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-xs md:text-sm font-bold tracking-wider whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-900"
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
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 text-[14px] text-slate-600 font-medium leading-relaxed">
                <h3 className="font-bold text-slate-900 text-base">Đặc điểm nổi bật ROG Strix GeForce RTX 4080 SUPER</h3>
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
              <h2 className="font-extrabold text-slate-950 text-xl tracking-tight">Sản phẩm liên quan</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">Linh kiện cao cấp cùng hệ sinh thái RTX 40-series</p>
            </div>
            <a href="/products" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
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
