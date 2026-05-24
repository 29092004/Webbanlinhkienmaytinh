import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-16 bg-[#292f31] text-slate-200">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:px-8">
        <div>
          <Link
            to="/"
            className="text-3xl font-black uppercase tracking-normal text-white"
          >
            EXO CORE
          </Link>
          <p className="mt-6 max-w-[230px] text-sm font-medium uppercase leading-relaxed tracking-[0.04em] text-slate-400">
            Precision engineered performance.
          </p>
        </div>

        <FooterColumn
          title="Support"
          links={[
            { label: "Warranty", href: "#" },
            { label: "Privacy Policy", href: "#" },
            { label: "Contact", href: "#" },
          ]}
        />

        <FooterColumn
          title="Company"
          links={[
            { label: "Press Kit", href: "#" },
            { label: "Affiliates", href: "#" },
          ]}
        />

        <div>
          <h4 className="mb-5 text-sm font-black tracking-[0.08em] text-white">
            Newsletter
          </h4>
          <form
            className="flex max-w-sm gap-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email"
              className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <button
              type="submit"
              className="rounded-md bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10 py-8 text-center text-sm font-medium uppercase tracking-[0.04em] text-slate-500">
        © 2024 EXO CORE. Precision engineered performance.
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="mb-5 text-sm font-black tracking-[0.08em] text-white">
        {title}
      </h4>
      <ul className="space-y-4 text-sm font-medium text-slate-200">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="transition hover:text-white">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
