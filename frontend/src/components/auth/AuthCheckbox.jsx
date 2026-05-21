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
      className="flex cursor-pointer items-center gap-3 text-[15px] font-medium leading-6 text-slate-600 select-none"
    >
      <div className="relative flex items-center justify-center">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          className="peer size-5 shrink-0 cursor-pointer appearance-none rounded-full border border-slate-300 bg-white transition-all checked:border-[#031525] focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
        {/* Center dot inside the circle when checked */}
        <span className="pointer-events-none absolute scale-0 rounded-full bg-[#031525] transition-transform peer-checked:scale-100 size-2.5" />
      </div>
      <span>{label}</span>
    </label>
  );
}
