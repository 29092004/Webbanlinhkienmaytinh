import { LockKeyhole } from "lucide-react";

export function OtpVerificationCard({ children }) {
  return (
    <div className="w-full max-w-[560px] rounded-[14px] border border-white/80 bg-white/95 px-7 py-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.25)] sm:px-10 sm:py-10">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#eef2ff] text-[#071f3b]">
        <LockKeyhole className="size-8" strokeWidth={2.4} />
      </div>

      <h1 className="!mb-0 !mt-6 !text-[32px] !font-extrabold !leading-tight !text-[#07111f] tracking-normal">
        Xác thực OTP
      </h1>
      <p className="mx-auto mt-4 max-w-[430px] text-[17px] leading-7 text-[#2c313b]">
        Nhập mã xác thực gồm 6 chữ số đã được gửi đến email hoặc số điện thoại của bạn
      </p>

      {children}
    </div>
  );
}
