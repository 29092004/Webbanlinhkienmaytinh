import { Mail, Lock, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { InputField } from "@/components/auth/InputField";

export default function Login() {
  return (
    <AuthLayout>
      <AuthHeader title="Chào mừng quay trở lại" />

      {/* Form */}
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        
        <InputField 
          label="Email của bạn" 
          icon={Mail} 
          type="email" 
          placeholder="example@exocore.vn" 
        />

        <InputField 
          label="Mật khẩu" 
          icon={Lock} 
          type="password" 
          placeholder="........" 
          extraLabel={
            <a href="#" className="text-[11px] text-[#0052cc] hover:underline font-medium">
              Quên mật khẩu?
            </a>
          }
        />

        {/* Remember me */}
        <div className="flex items-center pt-1">
          <input 
            id="remember-me" 
            name="remember-me" 
            type="checkbox" 
            className="h-4 w-4 text-[#0052cc] focus:ring-[#0052cc] border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="remember-me" className="ml-2.5 block text-[13px] font-bold text-gray-700 cursor-pointer">
            Duy trì đăng nhập
          </label>
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded shadow-sm text-sm font-bold text-white bg-[#0052cc] hover:bg-[#0047b3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052cc] transition-colors tracking-wide mt-2"
        >
          ĐĂNG NHẬP
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <AuthFooter 
        dividerText="Hoặc tiếp tục với"
        bottomText="Bạn chưa có tài khoản?"
        linkText="Đăng ký ngay"
        linkHref="/register"
      />
    </AuthLayout>
  );
}
