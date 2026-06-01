import { Truck, ShieldCheck, CreditCard, Headphones } from "lucide-react";

const policies = [
  {
    icon: Truck,
    title: "Giao hàng hỏa tốc",
    description: "Nhận hàng nhanh trong vòng 2h tại TP.HCM",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hành 1 đổi 1",
    description: "Cam kết chính hãng 100%, bảo hành uy tín",
  },
  {
    icon: CreditCard,
    title: "Hỗ trợ trả góp 0%",
    description: "Thủ tục nhanh chóng qua thẻ tín dụng",
  },
  {
    icon: Headphones,
    title: "Tư vấn chuyên sâu",
    description: "Thiết kế cấu hình PC tối ưu và miễn phí",
  },
];

export function StorePolicies() {
  return (
    <section className="bg-white py-6 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {policies.map((policy, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-300 group"
            >
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <policy.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-slate-800 tracking-[-0.01em] mb-0.5">
                  {policy.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {policy.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
