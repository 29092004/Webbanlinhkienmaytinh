import otpBackground from "@/assets/otp-bg.jpg";

export function OtpLayout({ children }) {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#071b31] px-5 py-4 text-slate-950">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center opacity-100 blur-[4px]"
        style={{ backgroundImage: `url(${otpBackground})` }}
      />
      <div className="absolute inset-0 bg-[#06182d]/62" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(17,52,88,0.06),rgba(2,13,25,0.8)_78%)]" />

      <section className="relative z-10 flex w-full flex-col items-center">
        <a
          href="/"
          className="mb-5 text-[28px] font-extrabold leading-none text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.42)] sm:mb-6"
        >
          LinhKienMayTinh
        </a>

        {children}
      </section>
    </main>
  );
}
