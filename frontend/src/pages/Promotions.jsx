import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Tag, Calendar, Ticket, Gift, Percent, ArrowRight } from "lucide-react";

const promotions = [
  {
    id: 1,
    title: "MÙA HÈ RỰC RỠ - BUILD PC CỰC ĐÃ",
    description: "Giảm ngay lên đến 2,000,000đ khi build PC nguyên bộ tại cửa hàng. Tặng kèm combo phím chuột cơ gaming cao cấp và lót chuột size XL.",
    code: "SUMMERPC",
    discount: "Giảm tới 2M",
    expiry: "31/07/2026",
    badge: "Hot Deal",
    badgeColor: "bg-red-500",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "SIÊU ƯU ĐÃI THÀNH VIÊN MỚI",
    description: "Nhập mã nhận ngay voucher giảm giá 10% tối đa 500,000đ cho đơn hàng linh kiện máy tính đầu tiên từ 2,000,000đ trở lên.",
    code: "WELCOMEEXO",
    discount: "Giảm 10%",
    expiry: "31/12/2026",
    badge: "Mới",
    badgeColor: "bg-blue-500",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "ĐẠI TIỆC VRAM - CARD ĐỒ HỌA GIÁ TỐT",
    description: "Các dòng card đồ họa NVIDIA RTX 40-series và AMD RX 7000-series giảm giá sốc đến 15% kèm quà tặng code game AAA độc quyền.",
    code: "GPUMANIA",
    discount: "Giảm 15%",
    expiry: "15/06/2026",
    badge: "Số lượng có hạn",
    badgeColor: "bg-orange-500",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=700&auto=format&fit=crop",
  },
];

const vouchers = [
  { code: "EXOFREE", value: "Miễn phí vận chuyển", desc: "Áp dụng cho đơn hàng từ 1,000,000đ toàn quốc", expiry: "30/06/2026" },
  { code: "EXOGPU500", value: "Giảm 500,000đ", desc: "Áp dụng cho các sản phẩm Card đồ họa", expiry: "15/06/2026" },
  { code: "EXOCPU200", value: "Giảm 200,000đ", desc: "Áp dụng cho các sản phẩm Vi xử lý (CPU)", expiry: "20/06/2026" },
  { code: "EXOGEAR100", value: "Giảm 100,000đ", desc: "Áp dụng cho Bàn phím, Chuột và Phụ kiện", expiry: "30/06/2026" },
];

export default function Promotions() {
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Đã sao chép mã giảm giá: ${code}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-900 px-8 py-16 text-white shadow-xl md:px-16">
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-blue-600/30 blur-3xl"></div>
          <div className="absolute -left-16 -bottom-16 size-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
          
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur">
              <Percent className="size-3.5" /> Khuyến Mãi Hot Nhất
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl">
              Khuyến Mãi Đặc Biệt Từ EXO CORE
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              Tổng hợp những chương trình ưu đãi lớn nhất, mã giảm giá độc quyền dành cho khách hàng mua sắm linh kiện máy tính và build PC tại EXO CORE.
            </p>
          </div>
        </div>

        {/* Promotions Grid */}
        <h2 className="mt-16 text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Gift className="size-6 text-blue-600" /> Chương trình đang diễn ra
        </h2>
        
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo) => (
            <div key={promo.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
                <span className={`absolute left-4 top-4 rounded-full ${promo.badgeColor} px-3 py-1 text-xs font-bold text-white shadow-sm`}>
                  {promo.badge}
                </span>
              </div>
              
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase">
                  <Tag className="size-3.5" /> {promo.discount}
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900">
                  {promo.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 flex-1">
                  {promo.description}
                </p>
                
                <div className="mt-6 border-t border-slate-100 pt-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="size-4 text-slate-400" /> Hạn dùng: {promo.expiry}
                  </div>
                  
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2 border border-dashed border-slate-200">
                    <span className="px-2 font-mono text-sm font-bold tracking-wider text-slate-700">Mã: {promo.code}</span>
                    <button
                      onClick={() => handleCopyCode(promo.code)}
                      className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-blue-700"
                    >
                      Lấy Mã
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vouchers Section */}
        <h2 className="mt-16 text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Ticket className="size-6 text-blue-600" /> Mã giảm giá nhanh
        </h2>
        
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {vouchers.map((voucher) => (
            <div key={voucher.code} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              {/* Ticket edge effect styling */}
              <div className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-slate-50 border-r border-slate-200"></div>
              <div className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-slate-50 border-l border-slate-200"></div>
              
              <div>
                <span className="text-xs font-bold text-slate-400">VOUCHER CHỈ CÓ TẠI EXO</span>
                <h3 className="mt-2 text-xl font-extrabold text-blue-600">{voucher.value}</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{voucher.desc}</p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar className="size-3" /> Hạn: {voucher.expiry}
                </span>
                <button
                  onClick={() => handleCopyCode(voucher.code)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
                >
                  Sao chép <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
