import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function InputField({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  name,
  autoComplete,
  showPasswordToggle = false,
  className = "",
}) {
  const generatedId = useId();
  const inputId = name ?? generatedId;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const canTogglePassword = type === "password" && showPasswordToggle;
  const inputType = canTogglePassword && isPasswordVisible ? "text" : type;

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="mb-2 block text-[16px] font-medium leading-none text-[#202531]"
      >
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Icon className="size-5 text-[#202531]" strokeWidth={2} />
        </div>
        <input
          id={inputId}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="h-[56px] w-full rounded-[14px] border border-[#dde2eb] bg-white pl-12 pr-4 text-[17px] text-[#111827] shadow-[inset_0_1px_0_rgba(15,23,42,0.03)] outline-none transition focus:border-[#0b2d4d] focus:ring-4 focus:ring-[#0b2d4d]/12 placeholder:text-slate-500"
        />
        {canTogglePassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-[14px] text-[#202531] transition hover:text-[#0b2d4d] focus:outline-none focus:ring-4 focus:ring-[#0b2d4d]/12"
            aria-label={isPasswordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            onClick={() => setIsPasswordVisible((current) => !current)}
          >
            {isPasswordVisible ? (
              <EyeOff className="size-5" strokeWidth={2} />
            ) : (
              <Eye className="size-5" strokeWidth={2} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
