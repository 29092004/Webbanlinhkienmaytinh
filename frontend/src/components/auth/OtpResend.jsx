export function OtpResend({ seconds = 59, onResend, disabled = false }) {
  return (
    <div className="mt-8 text-center">
      <p className="text-[16px] font-medium text-[#4a4f59]">Không nhận được mã?</p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[16px]">
        <button
          type="button"
          onClick={onResend}
          disabled={disabled}
          className="font-medium text-[#07111f] transition hover:text-[#0b2d4d] hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
        >
          Gửi lại mã
        </button>
        <span className="text-slate-300">•</span>
        <span className="text-slate-500">
          Gửi lại sau 00:{String(seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
