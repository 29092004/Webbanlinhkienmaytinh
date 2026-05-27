import { Check } from "lucide-react";

export default function CheckoutPayment({
  selectedMethod,
  onMethodChange,
}) {
  const methods = [
    {
      id: "cod",
      title: "Thanh toán khi nhận hàng (COD)",
      desc: "Kiểm tra hàng trước khi thanh toán",
      badge: null,
    },
    {
      id: "vnpay",
      title: "Thanh toán qua cổng VNPay",
      desc: "Thanh toán bằng QR, thẻ ATM hoặc ví điện tử VNPay",
      badge: (
        <span className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-sm tracking-wider uppercase ml-2 shrink-0 select-none">
          VN PAY
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center size-6 rounded-full bg-red-600 text-white text-xs font-bold">2</span>
        <h2 className="text-[1.35rem] font-black uppercase tracking-[-0.02em] text-slate-950">Phương thức thanh toán</h2>
      </div>

      {/* Methods container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((m) => {
          const isSelected = selectedMethod === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onMethodChange(m.id)}
              className={`relative text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-center min-h-[82px] cursor-pointer ${
                isSelected
                  ? "border-red-600 bg-red-50/20 shadow-sm"
                  : "border-slate-100 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center">
                <span className={`text-[14px] font-black tracking-[-0.01em] ${isSelected ? "text-red-600" : "text-slate-950"}`}>
                  {m.title}
                </span>
                {m.badge}
              </div>
              <p className="mt-1 text-[12px] font-semibold leading-normal text-slate-600">
                {m.desc}
              </p>

              {/* Selected Check Indicator */}
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full size-4.5 flex items-center justify-center border border-white">
                  <Check className="size-3 text-white font-black" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
