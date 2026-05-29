import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { ArrowRight, Calendar, Gift, Percent, Tag, Ticket } from "lucide-react";

const promotions = [
  {
    id: 1,
    title: "MUA LINH KIỆN, SĂN DEAL CỰC HỜI",
    description:
      "Ưu đãi nổi bật dành cho khách hàng mua linh kiện máy tính, build PC và phụ kiện chính hãng tại EXO CORE.",
    code: "LINHKIENHOT",
    discount: "Ưu đãi hấp dẫn",
    expiry: "31/12/2026",
    badge: "Nổi bật",
    badgeColor: "bg-red-500",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "VOUCHER THEO GIÁ TRỊ ĐƠN HÀNG",
    description:
      "Các mã giảm giá được cấu hình trực tiếp từ trang quản trị và sẽ tự hiển thị lại ở bước checkout khi đơn hàng đạt điều kiện.",
    code: "CHECKOUTVOUCHER",
    discount: "Áp dụng tại checkout",
    expiry: "Luôn cập nhật",
    badge: "Tự động",
    badgeColor: "bg-blue-500",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "MUA THÊM ĐỂ ĐẠT MỐC GIẢM GIÁ",
    description:
      "Khi đơn hàng chưa đủ điều kiện, hệ thống sẽ gợi ý bạn cần mua thêm bao nhiêu để có thể áp voucher tốt hơn.",
    code: "UPGRADEDEAL",
    discount: "Gợi ý thông minh",
    expiry: "Theo từng voucher",
    badge: "Tiện lợi",
    badgeColor: "bg-emerald-500",
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=700&auto=format&fit=crop",
  },
];

const benefits = [
  {
    code: "Voucher động",
    value: "Hiển thị theo đơn",
    desc: "Voucher chỉ khả dụng khi tổng tiền hàng của bạn đạt điều kiện mà admin đã thiết lập.",
    expiry: "Áp dụng ở checkout",
  },
  {
    code: "Điều kiện rõ ràng",
    value: "Min order minh bạch",
    desc: "Bạn sẽ thấy ngay còn thiếu bao nhiêu để đạt mốc dùng voucher phù hợp hơn.",
    expiry: "Cập nhật theo đơn",
  },
  {
    code: "Chọn nhanh",
    value: "Dùng ngay tại checkout",
    desc: "Không cần nhớ thủ công, chỉ cần chọn voucher hợp lệ trong bước thanh toán.",
    expiry: "Tối ưu trải nghiệm",
  },
  {
    code: "Admin quản lý",
    value: "Quản trị linh hoạt",
    desc: "Mức giảm, ngày hiệu lực, giới hạn sử dụng đều được quản lý từ trang admin vouchers.",
    expiry: "Realtime",
  },
];

export default function Promotions() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#071328_0%,#0f3b82_55%,#38bdf8_100%)] px-8 py-16 text-white shadow-xl md:px-16">
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-16 -bottom-16 size-64 rounded-full bg-sky-300/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur">
              <Percent className="size-3.5" /> Khuyến mãi tại EXO CORE
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl">Ưu đãi dành cho đơn hàng của bạn</h1>
            <p className="mt-4 text-lg text-blue-100">
              Theo dõi các chương trình ưu đãi và voucher đang được áp dụng. Voucher phù hợp sẽ được hiển thị ngay
              tại bước checkout khi đơn hàng của bạn đạt điều kiện.
            </p>
          </div>
        </div>

        <h2 className="mt-16 flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
          <Gift className="size-6 text-blue-600" /> Chương trình nổi bật
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img src={promo.image} alt={promo.title} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                <span className={`absolute left-4 top-4 rounded-full ${promo.badgeColor} px-3 py-1 text-xs font-bold text-white shadow-sm`}>
                  {promo.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-600">
                  <Tag className="size-3.5" /> {promo.discount}
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900">{promo.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{promo.description}</p>

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="size-4 text-slate-400" /> {promo.expiry}
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3">
                    <span className="font-mono text-sm font-bold tracking-wider text-slate-700">{promo.code}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600">
                      Xem ở checkout <ArrowRight className="size-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-16 flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
          <Ticket className="size-6 text-blue-600" /> Voucher hoạt động như thế nào
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <div key={item.code} className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full border-r border-slate-200 bg-slate-50" />
              <div className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full border-l border-slate-200 bg-slate-50" />

              <div>
                <span className="text-xs font-bold text-slate-400">{item.code}</span>
                <h3 className="mt-2 text-xl font-extrabold text-blue-600">{item.value}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.desc}</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Calendar className="size-3" /> {item.expiry}
                </span>
                <span className="text-xs font-bold text-blue-600">Tự động</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
