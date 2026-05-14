import { AtSign, Lock } from "lucide-react";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthCheckbox } from "@/components/auth/AuthCheckbox";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthSwitch } from "@/components/auth/AuthSwitch";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { InputField } from "@/components/auth/InputField";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <AuthLayout variant="login">
      <AuthCard title="Đăng nhập" subtitle="Chào mừng bạn quay lại" align="center">
        <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
          <InputField
            label="Email hoặc số điện thoại"
            icon={AtSign}
            type="text"
            name="identifier"
            autoComplete="username"
            placeholder="name@example.com"
          />

          <InputField
            label="Mật khẩu"
            icon={Lock}
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            showPasswordToggle
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <AuthCheckbox name="remember" label="Ghi nhớ đăng nhập" />
            <button
              type="button"
              className="text-[16px] font-medium text-[#0b2d4d] underline underline-offset-2"
            >
              Quên mật khẩu?
            </button>
          </div>

          <Button
            type="submit"
            className="h-[58px] w-full rounded-[12px] bg-[#0b2d4d] text-[17px] font-bold text-white shadow-[0_10px_20px_rgba(7,17,31,0.2)] hover:bg-[#08243e]"
          >
            Đăng nhập
          </Button>

          <div className="pt-2">
            <AuthDivider />
          </div>

          <GoogleButton>Đăng nhập với Google</GoogleButton>

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
