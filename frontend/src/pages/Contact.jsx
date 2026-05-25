import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, RefreshCw, BadgeHelp } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Cảm ơn bạn đã gửi tin nhắn! EXO CORE sẽ liên hệ với bạn qua email: ${formData.email} sớm nhất có thể.`);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 uppercase tracking-wide">
            Liên hệ với chúng tôi
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
            EXO CORE Sẵn Sàng Hỗ Trợ
          </h1>
          <p className="mt-4 text-slate-500">
            Bạn có câu hỏi về sản phẩm, cần tư vấn cấu hình build PC, hay thắc mắc về đơn hàng? Hãy liên hệ ngay với đội ngũ kỹ thuật và CSKH của chúng tôi.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
          {/* Contact Details Column */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Thông tin liên lạc</h2>
              
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 shrink-0">
                  <MapPin className="size-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Địa chỉ showroom</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                    Số 123 Đường Ba Tháng Hai, Phường 12, Quận 10, Thành phố Hồ Chí Minh, Việt Nam.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 shrink-0">
                  <Phone className="size-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Hotline hỗ trợ</h3>
                  <p className="mt-1 text-sm text-slate-500">1900 1234 (Bán hàng)</p>
                  <p className="text-sm text-slate-500">028 9999 8888 (Bảo hành)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 shrink-0">
                  <Mail className="size-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Email</h3>
                  <p className="mt-1 text-sm text-slate-500">contact@exocore.vn</p>
                  <p className="text-sm text-slate-500">support@exocore.vn</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 shrink-0">
                  <Clock className="size-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Thời gian làm việc</h3>
                  <p className="mt-1 text-sm text-slate-500">Thứ 2 - Chủ Nhật: 8:00 - 21:00</p>
                  <p className="text-sm text-slate-500">Ngày lễ, Tết: Nghỉ hoặc thông báo riêng</p>
                </div>
              </div>
            </div>

            {/* Quick Guarantees cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <ShieldCheck className="size-6 text-blue-600 mx-auto" />
                <h4 className="mt-2 text-xs font-bold text-slate-900">100% Chính hãng</h4>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <RefreshCw className="size-6 text-blue-600 mx-auto" />
                <h4 className="mt-2 text-xs font-bold text-slate-900">1 Đổi 1 trong 30 ngày</h4>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <BadgeHelp className="size-6 text-blue-600 mx-auto" />
                <h4 className="mt-2 text-xs font-bold text-slate-900">Tư vấn 24/7</h4>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Gửi tin nhắn trực tuyến</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-bold text-slate-700">Họ và tên</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold text-slate-700">Địa chỉ Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="nguyenvana@example.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-bold text-slate-700">Tiêu đề liên hệ</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Cần tư vấn build PC cấu hình 20 triệu..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-bold text-slate-700">Nội dung tin nhắn</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Chi tiết câu hỏi hoặc yêu cầu tư vấn của bạn..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 w-full justify-center"
              >
                <Send className="size-4" /> Gửi liên hệ ngay
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
