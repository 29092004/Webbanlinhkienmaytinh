export function AuthCard({
  title,
  subtitle,
  align = "left",
  children,
  className = "",
}) {
  const isCentered = align === "center";

  return (
    <div
      className={`w-full max-w-[560px] rounded-[30px] border border-white/80 bg-white/95 px-7 py-8 shadow-[0_24px_58px_rgba(15,23,42,0.14)] sm:px-10 lg:px-12 lg:py-8 ${className}`}
    >
      <div className={isCentered ? "mb-8 text-center" : "mb-7 text-left"}>
        <h1 className="!m-0 !text-[32px] !font-extrabold !leading-tight !text-[#07111f] tracking-normal">
          {title}
        </h1>
        {subtitle && (
          <p
            className={
              isCentered
                ? "mt-2 text-[18px] leading-6 text-slate-700"
                : "mt-2 text-[17px] leading-6 text-slate-700"
            }
          >
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}
