import { ArrowRight, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AuthCheckbox } from "@/components/auth/AuthCheckbox";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthLayout } from "@/components/auth/AuthLayout";
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
    <AuthLayout>
      <div className="w-full max-w-[480px] rounded-[32px] bg-white px-6 py-7 shadow-[0_20px_50px_rgba(3,21,37,0.4)] sm:px-7 sm:py-8">
        <h2 className="text-center text-[24px] font-extrabold text-[#031525] tracking-tight leading-none">
          Đăng nhập
        </h2>

        <form className="mx-auto mt-7 flex w-full max-w-[360px] flex-col items-start space-y-4 text-left" onSubmit={handleSubmit}>
          <div className="w-full">
            <InputField
              label="Email"
              icon={Mail}
              type="text"
              name="identifier"
              autoComplete="username"
              placeholder="name@example.com"
              value={form.identifier}
              onChange={handleChange}
              disabled={isSubmitting || isGoogleSubmitting}
            />
          </div>

          <div className="w-full">
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
          </div>

          <div className="w-full">
            <AuthCheckbox
              name="remember"
              label="Ghi nhớ đăng nhập"
              checked={form.remember}
              onChange={handleChange}
              disabled={isSubmitting || isGoogleSubmitting}
            />
          </div>

          {error ? (
            <p className="w-full text-left text-sm font-medium text-red-600">{error}</p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting || isGoogleSubmitting}
            className="h-[52px] w-full rounded-full bg-[#031525] text-[16px] font-bold text-white shadow-md hover:bg-[#0c2238] transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            <ArrowRight className="size-5" />
          </Button>

          <div className="w-full pt-1">
            <AuthDivider />
          </div>

          <GoogleButton
            onClick={handleGoogleLogin}
            disabled={isSubmitting || isGoogleSubmitting}
          >
            {isGoogleSubmitting ? "Đang xử lý Google..." : "Tiếp tục với Google"}
          </GoogleButton>

          <div className="w-full pt-1 text-center text-[14px] font-medium text-slate-400">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="font-semibold text-blue-400 hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
