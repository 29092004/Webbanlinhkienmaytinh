import { ShieldCheck } from "lucide-react";

export function OtpCardHeader({ emailMasked }) {
  return (
    <div className="text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-6">
        <ShieldCheck className="w-7 h-7 text-blue-600" />
      </div>

      <p className="text-[52px] leading-[1.1] font-extrabold text-slate-900 mb-3 tracking-tight">
        Xác thực OTP
      </p>
      <p className="text-[17px] text-slate-500 leading-relaxed max-w-[420px] mx-auto">
        Chúng tôi đã gửi mã xác minh gồm 6 chữ số đến
      </p>
      <p className="text-[18px] font-bold text-blue-600 mt-1">{emailMasked}</p>
    </div>
  );
}
