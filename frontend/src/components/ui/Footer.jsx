import { Globe, MessageCircle, Share2, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0f1115] text-gray-400 py-16 border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <a href="/" className="mb-4 block text-lg font-extrabold uppercase tracking-widest text-white">
              EXO CORE
            </a>
            <p className="mb-6 text-[12px] leading-relaxed text-gray-400">
              Leading provider of high-performance PC systems and premium components. Build your dream machine with EXO CORE engineering.
            </p>
            <div className="flex gap-3">
              <SocialLink>
                <Globe className="size-4" />
              </SocialLink>
              <SocialLink>
                <MessageCircle className="size-4" />
              </SocialLink>
              <SocialLink>
                <Share2 className="size-4" />
              </SocialLink>
            </div>
          </div>

          {/* Support Column */}
          <FooterColumn
            title="SUPPORT"
            links={[
              { text: "Help Center", href: "#" },
              { text: "Warranty Support", href: "#" },
              { text: "Shipping Info", href: "#" },
              { text: "Return Policy", href: "#" }
            ]}
          />

          {/* Legal Column */}
          <FooterColumn
            title="LEGAL"
            links={[
              { text: "Terms of Service", href: "#" },
              { text: "Privacy Policy", href: "#" },
              { text: "Cookie Policy", href: "#" },
              { text: "Disclaimer", href: "#" }
            ]}
          />

          {/* Newsletter Column */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">NEWSLETTER</h4>
            <p className="mb-4 text-[12px] leading-relaxed text-gray-400">
              Stay updated with the latest hardware news and exclusive deals.
            </p>
            <form className="flex rounded-md overflow-hidden bg-[#1f222b] border border-gray-700" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your email"
                className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                required
              />
              <button type="submit" className="bg-[#2d323f] hover:bg-gray-700 text-white px-3 flex items-center justify-center transition-colors">
                <ArrowRight className="size-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between border-t border-gray-800 pt-8 text-[11px] text-gray-500 md:flex-row">
          <p>© 2024 EXO CORE High-Performance Systems. All rights reserved.</p>
          <div className="mt-4 flex gap-4 md:mt-0">
            <span className="cursor-pointer hover:text-white transition-colors">EN</span>
            <span className="cursor-pointer hover:text-white transition-colors">VN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">{title}</h4>
      <ul className="space-y-3 text-[12px]">
        {links.map((link, idx) => (
          <li key={idx}>
            <a href={link.href} className="transition-colors hover:text-white">
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ children }) {
  return (
    <a
      href="#"
      className="flex size-8 items-center justify-center rounded-full bg-[#1f222b] hover:bg-blue-600 text-gray-400 hover:text-white transition-colors border border-gray-800"
    >
      {children}
    </a>
  );
}
