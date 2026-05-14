import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { InputField } from "@/components/auth/InputField";

export default function Register() {
  return (
    <AuthLayout>
      <AuthHeader title="Tạo tài khoản mới" />

      {/* Form */}
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        
        <InputField 
          label="Họ và tên" 
          icon={User} 
          type="text" 
          placeholder="Nguyễn Văn A" 
        />

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
        />

        <InputField 
          label="Nhập lại mật khẩu" 
          icon={Lock} 
          type="password" 
          placeholder="........" 
        />

        {/* Terms */}
        <div className="flex items-start pt-1">
          <input 
            id="terms" 
            name="terms" 
            type="checkbox" 
            className="h-4 w-4 mt-0.5 text-[#0052cc] focus:ring-[#0052cc] border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="terms" className="ml-2.5 block text-xs text-gray-500 cursor-pointer">
            Tôi đồng ý với các <a href="#" className="text-[#0052cc] hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-[#0052cc] hover:underline">Chính sách bảo mật</a>
          </label>
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded shadow-sm text-sm font-bold text-white bg-[#0052cc] hover:bg-[#0047b3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052cc] transition-colors tracking-wide mt-2"
        >
          ĐĂNG KÝ
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <AuthFooter 
        dividerText="Hoặc đăng ký bằng"
        bottomText="Bạn đã có tài khoản?"
        linkText="Đăng nhập"
        linkHref="/login"
      />
    </AuthLayout>
  );
}
