export function OtpCodeInputs({ otp, onOtpChange, refs }) {
  const handleChange = (index, rawValue) => {
    const sanitized = rawValue.replace(/\D/g, "");
    const value = sanitized.slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = value;
    onOtpChange(nextOtp);

    if (value && index < refs.current.length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
        />
      ))}
    </div>
  );
}
