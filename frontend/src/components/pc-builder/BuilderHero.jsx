import { Bot, ShieldCheck, Sparkles } from "lucide-react";

const benefits = [
  { icon: Bot, label: "Dễ hiểu cho người mới bắt đầu" },
  { icon: Sparkles, label: "Gợi ý thông minh từ AI" },
  { icon: ShieldCheck, label: "Tương thích 100%" },
];

export default function BuilderHero() {
  return (
    <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_420px]">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.1em] text-blue-700">
          Build PC dễ dàng cùng EXO CORE
        </p>
        <h1 className="m-0 mt-4 max-w-3xl text-[40px] font-black leading-tight tracking-normal text-slate-950 sm:text-[52px]">
          Tự tay xây dựng PC của bạn
        </h1>
        <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-slate-600">
          Chỉ với 8 bước đơn giản, AI sẽ giúp bạn chọn linh kiện phù hợp nhất
          với nhu cầu và ngân sách.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.label}
                className="inline-flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm"
              >
                <Icon className="size-4 text-blue-700" />
                {benefit.label}
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative hidden min-h-[190px] lg:block">
        <div className="absolute left-0 top-8 max-w-[250px] rounded-3xl border border-slate-200 bg-white px-7 py-5 text-sm font-black leading-relaxed text-slate-950 shadow-sm">
          Bạn không cần là chuyên gia, chúng tôi sẽ giúp bạn!
        </div>
        <div className="absolute bottom-0 right-0 h-44 w-40 rounded-[28px] bg-blue-700 shadow-xl">
          <div className="absolute left-1/2 top-8 size-16 -translate-x-1/2 rounded-full bg-[#f5b08b]" />
          <div className="absolute left-8 top-24 h-24 w-24 rounded-t-[32px] bg-blue-600" />
          <div className="absolute right-[-72px] bottom-0 h-40 w-32 rounded-xl border border-slate-700 bg-slate-950 shadow-2xl">
            <div className="mx-auto mt-5 size-12 rounded-full border-[6px] border-blue-600 bg-slate-800" />
            <div className="mx-auto mt-4 size-12 rounded-full border-[6px] border-blue-600 bg-slate-800" />
          </div>
        </div>
      </div>
    </section>
  );
}
