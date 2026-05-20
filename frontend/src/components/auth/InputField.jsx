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
  value,
  onChange,
  disabled = false,
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
        className="mb-2 block text-[15px] font-semibold leading-none text-slate-700"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Icon className="size-5 text-slate-400" strokeWidth={1.8} />
          </div>
        )}
        <input
          id={inputId}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="h-[52px] w-full rounded-full border border-slate-200 bg-white pl-12 pr-12 text-[16px] text-slate-800 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 placeholder:text-slate-400"
        />
        {canTogglePassword && (
          <button
            type="button"
            disabled={disabled}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-full text-slate-400 transition hover:text-slate-600 focus:outline-none"
            aria-label={isPasswordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            onClick={() => setIsPasswordVisible((current) => !current)}
          >
            {isPasswordVisible ? (
              <EyeOff className="size-5" strokeWidth={1.8} />
            ) : (
              <Eye className="size-5" strokeWidth={1.8} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
