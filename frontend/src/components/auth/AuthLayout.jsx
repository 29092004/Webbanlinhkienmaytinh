import { AuthVisualPanel } from "./AuthVisualPanel";

export function AuthLayout({ children, variant = "login" }) {
  return (
    <main className="min-h-svh bg-[#eef3ff] text-slate-950 lg:grid lg:grid-cols-2">
      <AuthVisualPanel variant={variant} />

      <section className="flex min-h-svh items-center justify-center px-5 py-6 sm:px-8 lg:px-10 lg:py-5">
        {children}
      </section>
    </main>
  );
}
