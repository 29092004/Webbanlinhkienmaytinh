import { AtSign, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthCheckbox } from "@/components/auth/AuthCheckbox";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthSwitch } from "@/components/auth/AuthSwitch";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { InputField } from "@/components/auth/InputField";
import { Button } from "@/components/ui/button";
import { getPostLoginRoute, saveAuthSession } from "@/lib/auth";
import { api } from "@/lib/api";
import { loadGoogleIdentityScript } from "@/lib/google";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const googleClientId = import.meta.env.GOOGLE_CLIENT_ID?.trim();
  const [form, setForm] = useState({
    identifier: location.state?.registeredEmail ?? "",
    password: "",
    remember: true,
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
                  "Đăng nhập Google thất bại."
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { data } = await api.post("/auth/login", {
        username: form.identifier.trim().toLowerCase(),
        password: form.password,
      });

      saveAuthSession(data);
      navigate(getPostLoginRoute(data.user?.role), { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
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
      setError(scriptError.message || "Không thể khởi tạo Google Login.");
    }
  };

  return (
    <AuthLayout variant="login">
      <AuthCard title="Đăng nhập" subtitle="Chào mừng bạn quay lại" align="center">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <InputField
            label="Email"
            icon={AtSign}
            type="text"
            name="identifier"
            autoComplete="username"
            placeholder="name@example.com"
            value={form.identifier}
            onChange={handleChange}
            disabled={isSubmitting || isGoogleSubmitting}
          />

          <InputField
            label="Mật khẩu"
            icon={Lock}
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            showPasswordToggle
            value={form.password}
            onChange={handleChange}
            disabled={isSubmitting || isGoogleSubmitting}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <AuthCheckbox
              name="remember"
              label="Ghi nhớ đăng nhập"
              checked={form.remember}
              onChange={handleChange}
              disabled={isSubmitting || isGoogleSubmitting}
            />
            <button
              type="button"
              className="text-[16px] font-medium text-[#0b2d4d] underline underline-offset-2"
            >
              Quên mật khẩu?
            </button>
          </div>

          {error ? (
            <p className="text-sm font-medium text-red-600">{error}</p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting || isGoogleSubmitting}
            className="h-[58px] w-full rounded-[12px] bg-[#0b2d4d] text-[17px] font-bold text-white shadow-[0_10px_20px_rgba(7,17,31,0.2)] hover:bg-[#08243e]"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <div className="pt-2">
            <AuthDivider />
          </div>

          <GoogleButton
            onClick={handleGoogleLogin}
            disabled={isSubmitting || isGoogleSubmitting}
          >
            {isGoogleSubmitting ? "Đang xử lý Google..." : "Đăng nhập với Google"}
          </GoogleButton>

          <div className="pt-3">
            <AuthSwitch
              text="Chưa có tài khoản?"
              linkText="Đăng ký ngay"
              to="/register"
            />
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
