import { BadgeCheck, Cpu, Zap } from "lucide-react";

const HARDWARE_IMAGE =
  "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1400&auto=format&fit=crop";

const panelContent = {
  login: {
    brandMode: "simple",
    headline: "Precision Engineering for the Elite Builder.",
    description:
      "Kiến tạo nên những bộ máy mạnh mẽ nhất với linh kiện chất lượng cao từ những thương hiệu hàng đầu thế giới.",
  },
  register: {
    brandMode: "icon",
    headline: "Trải nghiệm sức mạnh phần cứng tối thượng.",
    description:
      "Khám phá kho linh kiện máy tính cao cấp được tuyển chọn cho những game thủ và chuyên gia đồ họa hàng đầu. Precision engineering for the elite builder.",
  },
};

export function AuthVisualPanel({ variant = "login" }) {
  const content = panelContent[variant] ?? panelContent.login;
  const isRegister = variant === "register";

  return (
    <aside className="relative hidden min-h-svh overflow-hidden bg-[#06182d] text-white lg:flex">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HARDWARE_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-[#06182d]/82" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,45,0.14),rgba(2,13,25,0.9))]" />
      {isRegister && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.34) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      )}

      <div
        className={
          isRegister
            ? "relative z-10 flex w-full flex-col justify-center px-[9vw] py-16"
            : "relative z-10 flex w-full flex-col justify-between px-[6.4vw] py-16"
        }
      >
        <Brand mode={content.brandMode} />

        <div className={isRegister ? "mt-12 max-w-[620px]" : "max-w-[610px]"}>
          <p className="max-w-[540px] text-[40px] font-extrabold leading-[1.15] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">
            {content.headline}
          </p>
          <p className="mt-7 max-w-[620px] text-[24px] leading-[1.45] text-slate-300">
            {content.description}
          </p>

          {isRegister && (
            <div className="mt-14 flex flex-wrap gap-5">
              <TrustBadge icon={BadgeCheck}>Chính hãng 100%</TrustBadge>
              <TrustBadge icon={Zap}>Giao hàng 2h</TrustBadge>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function Brand({ mode }) {
  if (mode === "icon") {
    return (
      <div className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-xl bg-[#071d35] shadow-[0_12px_28px_rgba(0,0,0,0.28)]">
          <Cpu className="size-9 text-white" strokeWidth={2.6} />
        </div>
        <span className="text-[52px] font-extrabold leading-none text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.42)]">
          LinhKienMayTinh
        </span>
      </div>
    );
  }

  return (
    <span className="text-[52px] font-extrabold leading-none text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.42)]">
      LinhKienMayTinh
    </span>
  );
}

function TrustBadge({ icon: Icon, children }) {
  return (
    <span className="inline-flex h-12 items-center gap-3 rounded-full border border-white/40 bg-white/70 px-6 text-[18px] font-semibold text-white shadow-[0_14px_30px_rgba(0,0,0,0.2)] backdrop-blur-md">
      <Icon className="size-5" />
      {children}
    </span>
  );
}
