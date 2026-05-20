export function AuthLayout({ children }) {
  return (
    <main className="relative flex h-svh w-full flex-col items-center justify-start bg-[#031525] px-4 py-8 md:py-12 text-slate-900 overflow-y-auto">
      {/* Fixed Grid Lines */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Fixed Soft Blue Glow / Radial Gradients */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.04),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="fixed left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none rounded-full bg-blue-500/8 blur-[100px]" />

      <section className="relative z-10 w-full flex flex-col items-center">
        {children}
      </section>
    </main>
  );
}
