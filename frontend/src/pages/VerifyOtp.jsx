import { useEffect, useRef, useState } from "react";
import { OtpPageLayout } from "@/components/auth/otp/OtpPageLayout";
import { OtpCardHeader } from "@/components/auth/otp/OtpCardHeader";
import { OtpCodeInputs } from "@/components/auth/otp/OtpCodeInputs";
import { OtpResendSection } from "@/components/auth/otp/OtpResendSection";
import { OtpSecurityNote } from "@/components/auth/otp/OtpSecurityNote";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(45);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <OtpPageLayout>
      <div className="bg-white/95 rounded-[28px] border border-slate-200 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.24)] px-6 sm:px-10 py-8 sm:py-10">
        <OtpCardHeader emailMasked="otp********@gmail.com" />

        <div className="mt-7">
          <OtpCodeInputs otp={otp} onOtpChange={setOtp} refs={otpRefs} />
        </div>

        <div className="mt-6">
          <OtpResendSection secondsLeft={secondsLeft} />
        </div>

        <button
          type="button"
          disabled={!isOtpComplete}
          className="mt-8 w-full h-12 sm:h-14 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[17px] sm:text-[20px] font-bold shadow-lg shadow-blue-300/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          Xác nhận bảo mật
        </button>

        <div className="mt-7">
          <OtpSecurityNote />
        </div>
      </div>
    </OtpPageLayout>
  );
}
