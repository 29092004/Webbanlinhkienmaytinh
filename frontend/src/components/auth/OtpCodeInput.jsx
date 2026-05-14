import { useRef, useState } from "react";

const OTP_LENGTH = 6;

export function OtpCodeInput({ value, onChange }) {
  const [internalValue, setInternalValue] = useState(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef([]);
  const digits = value ?? internalValue;

  const updateDigits = (nextDigits) => {
    if (!value) {
      setInternalValue(nextDigits);
    }
    onChange?.(nextDigits.join(""));
  };

  const focusInput = (index) => {
    inputsRef.current[index]?.focus();
    inputsRef.current[index]?.select();
  };

  const handleChange = (index, inputValue) => {
    const cleanValue = inputValue.replace(/\D/g, "");
    if (!cleanValue) {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      updateDigits(nextDigits);
      return;
    }

    const nextDigits = [...digits];
    cleanValue
      .slice(0, OTP_LENGTH - index)
      .split("")
      .forEach((digit, offset) => {
        nextDigits[index + offset] = digit;
      });

    updateDigits(nextDigits);
    focusInput(Math.min(index + cleanValue.length, OTP_LENGTH - 1));
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    if (!pastedDigits.length) {
      return;
    }

    const nextDigits = Array(OTP_LENGTH).fill("");
    pastedDigits.forEach((digit, index) => {
      nextDigits[index] = digit;
    });

    updateDigits(nextDigits);
    focusInput(Math.min(pastedDigits.length, OTP_LENGTH - 1));
  };

  return (
    <div className="mt-8 flex justify-center gap-3 sm:gap-4" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputsRef.current[index] = element;
          }}
          aria-label={`Mã OTP số ${index + 1}`}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={index === 0}
          maxLength={1}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className="size-[54px] rounded-[10px] border border-[#c6ccd8] bg-white text-center text-[22px] font-bold text-[#07111f] outline-none transition focus:border-[#1d63ff] focus:ring-2 focus:ring-[#1d63ff] sm:size-[64px]"
        />
      ))}
    </div>
  );
}
