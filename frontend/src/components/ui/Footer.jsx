import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-16 bg-[#292f31] text-slate-200">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <Link
            to="/"
            className="text-3xl font-black uppercase tracking-normal text-white"
          >
            EXO CORE
          </Link>
          <p className="mt-7 max-w-[290px] text-base font-medium uppercase leading-relaxed tracking-[0.04em] text-slate-300">
            © 2024 EXO CORE. Precision engineered performance.
          </p>
        </div>

        <FooterColumn
          title="Quick Links"
          links={[
            { label: "Warranty", href: "#" },
            { label: "Privacy Policy", href: "#" },
            { label: "Contact", href: "#" },
          ]}
        />

        <FooterColumn
          title="Community"
          links={[
            { label: "Press Kit", href: "#" },
            { label: "Affiliates", href: "#" },
          ]}
        />

        <div>
          <h4 className="mb-8 text-base font-black uppercase tracking-[0.08em] text-slate-100">
            Newsletter
          </h4>
          <form
            className="flex h-14 max-w-sm items-center border border-slate-500 bg-transparent"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email của bạn"
              className="min-w-0 flex-1 bg-transparent px-5 text-lg font-medium text-white placeholder:text-slate-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-5 text-2xl leading-none text-blue-600 transition hover:text-blue-400"
              aria-label="Đăng ký newsletter"
            >
              →
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="mb-8 text-base font-black uppercase tracking-[0.08em] text-slate-100">
        {title}
      </h4>
      <ul className="space-y-5 text-lg font-medium text-slate-200">
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
