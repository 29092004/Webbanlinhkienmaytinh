import { ArrowRight, Lock, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthCheckbox } from "@/components/auth/AuthCheckbox";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthSwitch } from "@/components/auth/AuthSwitch";
import { InputField } from "@/components/auth/InputField";
import { Button } from "@/components/ui/button";
import {
  clearAuthSession,
  clearOtpAutoSentState,
  savePendingRegistration,
} from "@/lib/auth";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }

    if (!form.password) {
      setError("Vui lòng nhập mật khẩu.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!form.terms) {
      setError("Bạn cần đồng ý với điều khoản sử dụng.");
      return;
    }

    setIsSubmitting(true);

    try {
      const email = form.email.trim().toLowerCase();

      clearAuthSession();
      clearOtpAutoSentState();
      savePendingRegistration({
        phone: form.phone.trim(),
        username: email,
        password: form.password,
      });

      navigate("/otp", { replace: true });
    } catch {
      setError("Không thể chuyển sang bước xác thực OTP. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout variant="register">
      <AuthCard
        title="Đăng ký tài khoản"
        subtitle="Tạo tài khoản để mua linh kiện nhanh chóng hơn"
        className="max-w-[540px]"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <InputField
            label="Email"
            icon={Mail}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="example@gmail.com"
            value={form.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <InputField
            label="Số điện thoại"
            icon={Phone}
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="0123 456 789"
            value={form.phone}
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <InputField
              label="Mật khẩu"
              icon={Lock}
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="••••••••"
              showPasswordToggle
              value={form.password}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <InputField
              label="Xác nhận mật khẩu"
              icon={Lock}
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="••••••••"
              showPasswordToggle
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <AuthCheckbox
            name="terms"
            label="Tôi đồng ý với điều khoản sử dụng"
            checked={form.terms}
            onChange={handleChange}
            disabled={isSubmitting}
          />

          {error ? (
            <p className="text-sm font-medium text-red-600">{error}</p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-[58px] w-full rounded-[12px] bg-[#021326] text-[17px] font-bold text-white shadow-[0_10px_20px_rgba(7,17,31,0.2)] hover:bg-[#061d36]"
          >
            {isSubmitting ? "Đang chuyển bước..." : "Đăng ký"}
            <ArrowRight className="size-5" />
          </Button>

          <div className="pt-3">
            <AuthSwitch text="Đã có tài khoản?" linkText="Đăng nhập" to="/login" />
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
