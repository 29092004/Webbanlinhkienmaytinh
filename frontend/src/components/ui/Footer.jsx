import { Globe, Mail, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="col-span-1">
            <a href="/" className="mb-4 block text-lg font-extrabold uppercase tracking-wide text-gray-900">
              TECHSPEC PC
            </a>
            <p className="mb-6 text-[12px] leading-relaxed text-gray-500">
              Đơn vị cung cấp giải pháp máy tính cao cấp, chuyên nghiệp và tối ưu hiệu năng cho người dùng Việt.
            </p>
            <div className="flex gap-3">
              <SocialLink>
                <Globe className="size-4" />
              </SocialLink>
              <SocialLink>
                <MessageCircle className="size-4" />
              </SocialLink>
              <SocialLink>
                <Share2 className="size-4" />
              </SocialLink>
            </div>
          </div>

          <FooterColumn
            title="Về chúng tôi"
            links={["Giới thiệu", "Tin tức", "Hệ thống cửa hàng", "Liên hệ"]}
          />
          <FooterColumn
            title="Chính sách"
            links={["Bảo hành", "Đổi trả", "Vận chuyển", "Thanh toán"]}
          />
          <FooterColumn
            title="Hỗ trợ"
            links={["Kỹ thuật", "Xây dựng cấu hình", "Tra cứu bảo hành", "Tuyển dụng"]}
          />

          <div>
            <h4 className="mb-4 text-sm font-bold text-gray-900">Liên hệ</h4>
            <ul className="space-y-4 text-[13px] text-gray-500">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-blue-600" />
                <span>123 Đường Công Nghệ, Quận 1, TP. HCM</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-blue-600" />
                <span>1900 0111</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-blue-600" />
                <span>contact@techspec.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-gray-100 pt-8 text-[11px] text-gray-400 md:flex-row">
          <p>© 2024 TECHSPEC PC. All rights reserved. Precision. Performance. Aesthetic.</p>
          <div className="mt-4 flex gap-4 md:mt-0">
            <a href="#" className="transition-colors hover:text-gray-600">
              Chính sách bảo mật
            </a>
            <a href="#" className="transition-colors hover:text-gray-600">
              Điều khoản sử dụng
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-bold text-gray-900">{title}</h4>
      <ul className="space-y-3 text-[13px] text-gray-500">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="transition-colors hover:text-blue-600">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ children }) {
  return (
    <a
      href="#"
      className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-blue-600 hover:text-white"
    >
      {children}
    </a>
  );
}
