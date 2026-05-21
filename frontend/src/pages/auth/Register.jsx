import { ArrowRight, Lock, Mail, Phone, User, Shield, Cpu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthCheckbox } from "@/components/auth/AuthCheckbox";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { InputField } from "@/components/auth/InputField";
import { Button } from "@/components/ui/button";
import {
  clearAuthSession,
  clearOtpAutoSentState,
  savePendingRegistration,
  saveAuthSession,
  getPostLoginRoute,
} from "@/lib/auth";
import { api } from "@/lib/api";
import { loadGoogleIdentityScript } from "@/lib/google";

export default function Register() {
  const navigate = useNavigate();
  const googleClientId = import.meta.env.GOOGLE_CLIENT_ID?.trim();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    let isMounted = true;

    loadGoogleIdentityScript()
      .then((google) => {
        if (!isMounted || !google?.accounts?.id) {
          return;
        }

        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (!response.credential) {
              setError("Không nhận được token từ Google.");
              return;
            }

            setError("");
            setIsGoogleSubmitting(true);

            try {
              const { data } = await api.post("/auth/google-login", {
                idToken: response.credential,
              });

              saveAuthSession(data);
              navigate(getPostLoginRoute(data.user?.role), { replace: true });
            } catch (requestError) {
              setError(
                requestError.response?.data?.message ||
                  "Đăng ký Google thất bại."
              );
            } finally {
              setIsGoogleSubmitting(false);
            }
          },
        });
      })
      .catch((scriptError) => {
        setError(scriptError.message);
      });

    return () => {
      isMounted = false;
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [googleClientId, navigate]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGoogleRegister = async () => {
    if (!googleClientId) {
      setError("Thiếu cấu hình GOOGLE_CLIENT_ID cho frontend.");
      return;
    }

    setError("");

    try {
      const google = await loadGoogleIdentityScript();

      if (!google?.accounts?.id) {
        throw new Error("Google Identity chưa sẵn sàng.");
      }

      google.accounts.id.prompt();
    } catch (scriptError) {
      setError(scriptError.message || "Không thể khởi tạo Google Register.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.fullName.trim()) {
      setError("Vui lòng nhập họ và tên.");
      return;
    }

    if (!form.email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Vui lòng nhập số điện thoại.");
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
      setError("Bạn cần đồng ý với điều khoản sử dụng và chính sách bảo mật.");
      return;
    }

    setIsSubmitting(true);

    try {
      const email = form.email.trim().toLowerCase();

      clearAuthSession();
      clearOtpAutoSentState();
      savePendingRegistration({
        fullName: form.fullName.trim(),
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

  const checkboxLabel = (
    <span className="text-[14px]">
      Tôi đồng ý với{" "}
      <a href="#" className="font-semibold text-blue-600 hover:underline">
        điều khoản sử dụng
      </a>{" "}
      và{" "}
      <a href="#" className="font-semibold text-blue-600 hover:underline">
        chính sách bảo mật
      </a>{" "}
      của hệ thống.
    </span>
  );

  return (
    <AuthLayout>
      {/* Main card */}
      <div className="w-full max-w-[620px] rounded-[32px] bg-white px-7 py-8 shadow-[0_20px_50px_rgba(3,21,37,0.4)] sm:px-9 sm:py-10">
        {/* Header inside the card */}
        <div className="flex items-center gap-3 mb-6 select-none">
          <div className="flex items-center justify-center size-10 rounded-full bg-[#031525] text-white">
            <Cpu className="size-5 text-blue-400" strokeWidth={2.2} />
          </div>
          <span className="text-[17px] font-extrabold text-[#031525] tracking-wide">
            LinhKienMayTinh
          </span>
        </div>

        <h2 className="text-[24px] font-extrabold text-[#031525] tracking-tight leading-none">
          Đăng ký tài khoản
        </h2>
        <p className="text-slate-500 text-[14px] mt-2 mb-7">
          Tham gia cộng đồng linh kiện máy tính cao cấp ngay hôm nay.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Row 1: Name and Email */}
          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Họ và tên"
              icon={User}
              type="text"
              name="fullName"
              placeholder="Nguyễn Văn A"
              value={form.fullName}
              onChange={handleChange}
              disabled={isSubmitting || isGoogleSubmitting}
            />

            <InputField
              label="Email"
              icon={Mail}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              disabled={isSubmitting || isGoogleSubmitting}
            />
          </div>

          {/* Row 2: Phone */}
          <InputField
            label="Số điện thoại"
            icon={Phone}
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="0123 456 789"
            value={form.phone}
            onChange={handleChange}
            disabled={isSubmitting || isGoogleSubmitting}
          />

          {/* Row 3: Password and Confirmation */}
          <div className="grid gap-5 sm:grid-cols-2">
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
              disabled={isSubmitting || isGoogleSubmitting}
            />
            <InputField
              label="Xác nhận"
              icon={Shield}
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="••••••••"
              showPasswordToggle
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting || isGoogleSubmitting}
            />
          </div>

          <AuthCheckbox
            name="terms"
            label={checkboxLabel}
            checked={form.terms}
            onChange={handleChange}
            disabled={isSubmitting || isGoogleSubmitting}
          />

          {error ? (
            <p className="text-sm font-medium text-red-600">{error}</p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting || isGoogleSubmitting}
            className="h-[52px] w-full rounded-full bg-[#031525] text-[16px] font-bold text-white shadow-md hover:bg-[#0c2238] transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng ký ngay"}
            <ArrowRight className="size-5" />
          </Button>

          <div className="pt-1">
            <AuthDivider />
          </div>

          <GoogleButton
            onClick={handleGoogleRegister}
            disabled={isSubmitting || isGoogleSubmitting}
          >
            {isGoogleSubmitting ? "Đang xử lý Google..." : "Đăng ký với Google"}
          </GoogleButton>
        </form>
      </div>

      {/* Footer below the card */}
      <div className="mt-8 text-center text-[15px] font-medium text-slate-400 select-none">
        Đã có tài khoản?{" "}
        <Link to="/login" className="font-semibold text-blue-400 hover:underline">
          Đăng nhập
        </Link>
      </div>
    </AuthLayout>
  );
}
