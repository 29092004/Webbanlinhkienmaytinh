import { ArrowRight, Lock, Mail, Phone, User } from "lucide-react";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthCheckbox } from "@/components/auth/AuthCheckbox";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthSwitch } from "@/components/auth/AuthSwitch";
import { InputField } from "@/components/auth/InputField";
import { Button } from "@/components/ui/button";

export default function Register() {
  return (
    <AuthLayout variant="register">
      <AuthCard
        title="Đăng ký tài khoản"
        subtitle="Tạo tài khoản để mua linh kiện nhanh chóng hơn"
        className="max-w-[540px]"
      >
        <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
          <InputField
            label="Họ và tên"
            icon={User}
            type="text"
            name="fullName"
            autoComplete="name"
            placeholder="Nguyễn Văn A"
          />

          <InputField
            label="Email"
            icon={Mail}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="example@gmail.com"
          />

          <InputField
            label="Số điện thoại"
            icon={Phone}
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="0123 456 789"
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <InputField
              label="Mật khẩu"
              icon={Lock}
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="••••••••"
            />
            <InputField
              label="Xác nhận mật khẩu"
              icon={Lock}
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>

          <AuthCheckbox name="terms" label="Tôi đồng ý với điều khoản sử dụng" />

          <Button
            type="submit"
            className="h-[58px] w-full rounded-[12px] bg-[#021326] text-[17px] font-bold text-white shadow-[0_10px_20px_rgba(7,17,31,0.2)] hover:bg-[#061d36]"
          >
            Đăng ký
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
