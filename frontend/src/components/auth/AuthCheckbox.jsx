import { useId } from "react";

export function AuthCheckbox({
  label,
  name,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
}) {
  const generatedId = useId();
  const id = name ?? generatedId;

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 text-[16px] font-medium leading-6 text-[#2c313b]"
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={disabled}
        className="size-5 shrink-0 cursor-pointer rounded border border-[#b9c1cf] accent-[#0b2d4d] transition focus:outline-none focus:ring-4 focus:ring-[#0b2d4d]/12"
      />
      <span>{label}</span>
    </label>
  );
}
