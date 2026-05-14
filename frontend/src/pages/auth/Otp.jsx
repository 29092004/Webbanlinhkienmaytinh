import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { OtpCodeInput } from "@/components/auth/OtpCodeInput";
import { OtpLayout } from "@/components/auth/OtpLayout";
import { OtpResend } from "@/components/auth/OtpResend";
import { OtpVerificationCard } from "@/components/auth/OtpVerificationCard";
import { Button } from "@/components/ui/button";
import {
  clearPendingRegistration,
  getPendingRegistration,
  hasOtpBeenAutoSent,
  markOtpAutoSent,
} from "@/lib/auth";
import { api } from "@/lib/api";

const RESEND_SECONDS = 59;

export default function Otp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [pendingRegistration] = useState(() => getPendingRegistration());
  const [isCompletingRegistration, setIsCompletingRegistration] = useState(false);

  useEffect(() => {
    if (!pendingRegistration && !isCompletingRegistration) {
      navigate("/register", { replace: true });
    }
  }, [isCompletingRegistration, navigate, pendingRegistration]);

  useEffect(() => {
    if (!pendingRegistration) {
      return;
    }

    if (hasOtpBeenAutoSent(pendingRegistration.username)) {
      return;
    }

    let isMounted = true;

    const sendOtp = async () => {
      try {
        await api.post("/auth/send-register-otp", {
          username: pendingRegistration.username,
        });
        markOtpAutoSent(pendingRegistration.username);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(
          requestError.response?.data?.message ||
            "Không gửi được OTP. Vui lòng bấm gửi lại mã."
        );
      }
    };

    sendOtp();

    return () => {
      isMounted = false;
    };
  }, [pendingRegistration]);

  useEffect(() => {
    if (seconds <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [seconds]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (otp.length < 6) {
      setError("Vui lòng nhập đủ 6 số OTP.");
      return;
    }

    if (!pendingRegistration) {
      setError("Phiên đăng ký đã hết hạn. Vui lòng đăng ký lại.");
      return;
    }

    setIsSubmitting(true);

    try {
      setIsCompletingRegistration(true);

      await api.post("/auth/register", {
        username: pendingRegistration.username,
        password: pendingRegistration.password,
        fullName: pendingRegistration.fullName,
        phone: pendingRegistration.phone,
        otp,
      });

      clearPendingRegistration();
      navigate("/login", {
        replace: true,
        state: {
          registeredEmail: pendingRegistration.username,
        },
      });
    } catch (requestError) {
      setIsCompletingRegistration(false);
      setError(
        requestError.response?.data?.message ||
          "Xác thực OTP thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!pendingRegistration || seconds > 0) {
      return;
    }

    setError("");
    setIsResending(true);

    try {
      await api.post("/auth/send-register-otp", {
        username: pendingRegistration.username,
      });

      markOtpAutoSent(pendingRegistration.username);
      setSeconds(RESEND_SECONDS);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Không gửi lại được OTP. Vui lòng thử lại."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <OtpLayout>
      <OtpVerificationCard
        description={
          pendingRegistration?.username
            ? `Nhập mã xác thực gồm 6 chữ số đã được gửi đến ${pendingRegistration.username}.`
            : undefined
        }
      >
        <form className="mt-2" onSubmit={handleSubmit}>
          <OtpCodeInput onChange={setOtp} />

          {error ? (
            <p className="mt-5 text-sm font-medium text-red-600">{error}</p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting || otp.length < 6}
            className="mt-9 h-[58px] w-full max-w-[480px] rounded-[8px] bg-[#0b2d4d] text-[18px] font-medium text-white shadow-[0_10px_18px_rgba(7,17,31,0.22)] hover:bg-[#08243e] disabled:opacity-60"
          >
            {isSubmitting ? "Đang xác thực..." : "Xác nhận"}
          </Button>
        </form>

        <OtpResend
          seconds={seconds}
          onResend={handleResend}
          disabled={seconds > 0 || isResending}
        />
      </OtpVerificationCard>
    </OtpLayout>
  );
}
