import { useState } from "react";

import { OtpCodeInput } from "@/components/auth/OtpCodeInput";
import { OtpLayout } from "@/components/auth/OtpLayout";
import { OtpResend } from "@/components/auth/OtpResend";
import { OtpVerificationCard } from "@/components/auth/OtpVerificationCard";
import { Button } from "@/components/ui/button";

export default function Otp() {
  const [otp, setOtp] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (otp.length < 6) {
      return;
    }
  };

  return (
    <OtpLayout>
      <OtpVerificationCard>
        <form className="mt-2" onSubmit={handleSubmit}>
          <OtpCodeInput onChange={setOtp} />

          <Button
            type="submit"
            className="mt-9 h-[58px] w-full max-w-[480px] rounded-[8px] bg-[#0b2d4d] text-[18px] font-medium text-white shadow-[0_10px_18px_rgba(7,17,31,0.22)] hover:bg-[#08243e] disabled:opacity-60"
          >
            Xác nhận
          </Button>
        </form>

        <OtpResend />
      </OtpVerificationCard>
    </OtpLayout>
  );
}
