import { Shield } from "lucide-react";

export function OtpSecurityNote() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-5 py-2">
        <Shield className="w-4 h-4 text-emerald-600" />
        <span className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
          KẾT NỐI ĐƯỢC MÃ HÓA SSL 256-BIT
        </span>
      </div>
      <p className="mt-4 text-sm italic text-slate-400">
        Mã OTP có hiệu lực trong 5 phút
      </p>
    </div>
  );
}
