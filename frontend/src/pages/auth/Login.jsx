import { AtSign, Lock, Cpu } from "lucide-react";
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
      {/* Header outside the card */}
      <div className="flex flex-col items-center text-center mb-7 select-none">
        <div className="flex items-center justify-center size-14 rounded-full bg-[#081e35] border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)] mb-3">
          <Cpu className="size-7 text-blue-400" />
        </div>
        <span className="text-[16px] font-bold text-white/90 tracking-wide">
          LinhKienMayTinh
        </span>
        <h1 className="mt-1 text-3xl font-extrabold !text-white leading-none">
          Đăng nhập
        </h1>
        <p className="mt-2 text-[14px] text-slate-400">
          Chào mừng bạn quay lại hệ thống
        </p>
      </div>

      {/* Main card */}
      <div className="w-full max-w-[460px] rounded-[32px] bg-white px-7 py-8 shadow-[0_20px_50px_rgba(3,21,37,0.4)] sm:px-9 sm:py-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <InputField
            label="Email hoặc số điện thoại"
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
              className="text-[14px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
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
            className="h-[52px] w-full rounded-full bg-[#031525] text-[16px] font-bold text-white shadow-md hover:bg-[#0c2238] transition active:scale-[0.98] cursor-pointer"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <div className="pt-1">
            <AuthDivider />
          </div>

          <GoogleButton
            onClick={handleGoogleLogin}
            disabled={isSubmitting || isGoogleSubmitting}
          >
            {isGoogleSubmitting ? "Đang xử lý Google..." : "Tiếp tục với Google"}
          </GoogleButton>
        </form>
      </div>

      {/* Footer below the card */}
      <div className="mt-8 text-center text-[15px] font-medium text-slate-400 select-none">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="font-semibold text-blue-400 hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </AuthLayout>
  );
}
