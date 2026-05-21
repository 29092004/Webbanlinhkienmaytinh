export function AuthLayout({ children }) {
  return (
    <main className="relative flex h-svh w-full flex-col items-center justify-start overflow-y-auto bg-[linear-gradient(180deg,#fff8f1_0%,#fff1e6_44%,#ffe4cf_100%)] px-4 py-8 text-slate-900 md:py-12">
      {/* Fixed Grid Lines */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(to_right,rgba(148,163,184,0.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.28)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Soft orange mixed-color glows */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_18%,rgba(251,146,60,0.22),transparent_34%),radial-gradient(circle_at_82%_22%,rgba(245,158,11,0.18),transparent_30%),radial-gradient(circle_at_50%_88%,rgba(253,186,116,0.16),transparent_28%)]" />
      <div className="fixed left-1/2 top-[28%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full bg-white/50 blur-[110px]" />

      <section className="relative z-10 w-full flex flex-col items-center">
        {children}
      </section>
    </main>
  );
}
