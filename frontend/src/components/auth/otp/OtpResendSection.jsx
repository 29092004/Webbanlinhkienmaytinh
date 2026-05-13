export function OtpResendSection({ secondsLeft }) {
  return (
    <div className="text-center">
      <p className="text-[16px] text-slate-500">
        Gửi lại mã sau <span className="font-extrabold text-slate-700">00:{String(secondsLeft).padStart(2, "0")}</span>
      </p>
      <button type="button" className="mt-1 text-[16px] font-semibold text-blue-500 hover:text-blue-600 transition-colors">
        Gửi lại mã
      </button>
    </div>
  );
}
