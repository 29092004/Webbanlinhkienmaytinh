import { Globe, MessageCircle, Share2, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <a href="/" className="font-extrabold text-gray-900 block mb-4 uppercase tracking-wide text-lg">
              TECHSPEC PC
            </a>
            <p className="text-[12px] text-gray-500 mb-6 leading-relaxed">
              Đơn vị cung cấp giải pháp máy tính cao cấp, chuyên nghiệp và tối ưu hiệu năng cho người dùng Việt.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm">Về chúng tôi</h4>
            <ul className="space-y-3 text-[13px] text-gray-500">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Tin tức</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Hệ thống cửa hàng</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Liên hệ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm">Chính sách</h4>
            <ul className="space-y-3 text-[13px] text-gray-500">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Bảo hành</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Đổi trả</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Vận chuyển</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Thanh toán</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm">Hỗ trợ</h4>
            <ul className="space-y-3 text-[13px] text-gray-500">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Kỹ thuật</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Xây dựng cấu hình</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Tra cứu bảo hành</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Tuyển dụng</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm">Liên hệ</h4>
            <ul className="space-y-4 text-[13px] text-gray-500">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>123 Đường Công Nghệ, Quận 1, TP. HCM</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>1900 0111</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>contact@techspec.vn</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 text-[11px] text-gray-400">
          <p>© 2024 TECHSPEC PC. All rights reserved. Precision. Performance. Aesthetic.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-600 transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
