import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const supportLinks = [
  { label: "Hướng dẫn mua hàng", href: "/products" },
  { label: "Xây dựng cấu hình PC", href: "/pc-builder" },
  { label: "Tra cứu đơn hàng", href: "/profile/orders" },
];

const categoryLinks = [
  { label: "CPU - Bộ vi xử lý", href: "/products?category=cpu" },
  { label: "GPU - Card đồ họa", href: "/products?category=gpu" },
  { label: "Mainboard", href: "/products?category=mainboard" },
  { label: "RAM - Bộ nhớ", href: "/products?category=ram" },
  { label: "SSD / HDD", href: "/products?category=storage" },
  { label: "Màn hình", href: "/products?category=monitor" },
];

const policyLinks = [
  { label: "Chính sách bảo hành", href: "/" },
  { label: "Chính sách đổi trả", href: "/" },
  { label: "Chính sách vận chuyển", href: "/" },
  { label: "Điều khoản sử dụng", href: "/" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-[linear-gradient(180deg,#0f172a_0%,#111827_38%,#0b1220_100%)] text-slate-200">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr_1.1fr] lg:px-8">
        <div>
          <Link
            to="/"
            className="text-[32px] font-black uppercase tracking-[-0.03em] text-white"
          >
            EXO CORE
          </Link>
          <p className="mt-4 max-w-[340px] text-sm font-medium leading-6 text-slate-400">
            Website bán linh kiện máy tính, gear và giải pháp build PC theo nhu cầu
            học tập, làm việc, gaming và đồ họa.
          </p>

          <div className="mt-6 space-y-3 text-sm font-medium text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-slate-500" />
              <span>123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</span>
            </div>
            <div>Hotline: 1900 6868</div>
            <div>Email: support@exocore.vn</div>
            <div>Giờ mở cửa: 08:00 - 21:00 mỗi ngày</div>
          </div>
        </div>

        <FooterColumn title="Hỗ trợ mua hàng" links={supportLinks} />
        <FooterColumn title="Danh mục nổi bật" links={categoryLinks} />
        <FooterColumn title="Chính sách & thông tin" links={policyLinks} />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm font-medium text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© 2026 EXO CORE. Linh kiện chính hãng, build PC đúng nhu cầu.</p>
          <p>Thanh toán linh hoạt • Xuất hóa đơn • Hỗ trợ kỹ thuật sau bán hàng</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="mb-5 text-[15px] font-semibold tracking-[-0.01em] text-white">
        {title}
      </h4>
      <ul className="space-y-3 text-sm font-medium text-slate-400">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
