import {
  ArrowRight,
  Cpu,
  Headphones,
  Monitor,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const categories = [
  {
    name: "Graphics Card",
    description: "RTX 40 Series, Radeon RX, workstation GPUs cho game va render.",
    icon: Zap,
  },
  {
    name: "CPU & Mainboard",
    description: "Bo doi Intel, AMD va mainboard toi uu cho moi nhu cau build may.",
    icon: Cpu,
  },
  {
    name: "Monitor Gaming",
    description: "Man hinh 2K, 4K, 144Hz va 240Hz cho trai nghiem muot va sac net.",
    icon: Monitor,
  },
  {
    name: "Phu Kien Setup",
    description: "Ban phim, chuot, tai nghe va phu kien RGB de hoan thien goc may.",
    icon: Headphones,
  },
];

const featuredProducts = [
  {
    name: "RTX 4070 Super",
    price: "18.990.000d",
    badge: "Ban chay",
    description: "Hieu nang manh cho gaming 2K, stream va dung cac cong viec sang tao.",
    image:
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Ryzen 7 7800X3D",
    price: "10.490.000d",
    badge: "Gaming pick",
    description: "Lua chon rat can bang cho FPS cao, nhiet do on va de nang cap.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "GearHub Pro TKL",
    price: "1.690.000d",
    badge: "Moi ve",
    description: "Ban phim co layout gon, switch em va den RGB phu hop ca game lan viec.",
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1200&auto=format&fit=crop",
  },
];

const highlights = [
  {
    title: "Build can doi va de chon",
    description: "Goi y cau hinh ro rang theo ngan sach, khong bi roi boi qua nhieu lua chon.",
    icon: Sparkles,
  },
  {
    title: "Bao hanh minh bach",
    description: "Thong tin bao hanh, doi tra va tinh trang hang duoc hien thi ro tren tung san pham.",
    icon: ShieldCheck,
  },
  {
    title: "Giao nhanh toan quoc",
    description: "Dong goi ky, giao nhanh va ho tro kiem tra linh kien truoc khi lap dat.",
    icon: Truck,
  },
];

function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_32%),linear-gradient(180deg,_#08111f_0%,_#0d1728_38%,_#f5f7fb_38%,_#f5f7fb_100%)] text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_20%_15%,rgba(14,165,233,0.2),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.18),transparent_26%)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300/80">
              GearHub
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Web Linh Kiện Máy Tính
            </h1>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="/" className="transition hover:text-white">
              Trang chu
            </a>
            <a href="/products" className="transition hover:text-white">
              San pham
            </a>
            <a href="/cart" className="transition hover:text-white">
              Gio hang
            </a>
            <a href="/login" className="transition hover:text-white">
              Dang nhap
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="px-4 pb-18 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-200">
                <Sparkles className="size-4" />
                Setup gaming va work station duoc chon san de de mua hon
              </div>

              <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Trang home can doi hon, de nhin hon va van giu chat cong nghe.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                GearHub tap trung vao cac linh kien dang duoc quan tam nhieu, layout ro
                rang va khung noi dung thong thoang de nguoi xem de tim san pham ngay tu
                man hinh dau tien.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-sky-400 px-6 text-slate-950 hover:bg-sky-300"
                >
                  Mua ngay
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10"
                >
                  Xem bo suu tap
                </Button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { value: "10.000+", label: "San pham san kho" },
                  { value: "48h", label: "Giao nhanh noi thanh" },
                  { value: "24/7", label: "Ho tro tu van build" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-white/10 bg-white/6 p-5 shadow-[0_18px_50px_rgba(4,10,24,0.24)] backdrop-blur"
                  >
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[2rem] bg-sky-400/20 blur-3xl" />
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/75 p-3 shadow-[0_28px_80px_rgba(2,8,23,0.42)]">
                <img
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1400&auto=format&fit=crop"
                  alt="Gaming PC setup"
                  className="h-[420px] w-full rounded-[1.4rem] object-cover sm:h-[520px]"
                />

                <div className="grid gap-3 p-4 sm:grid-cols-3">
                  {highlights.map(({ title, description, icon: Icon }) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-white/8 bg-white/5 p-4 text-left"
                    >
                      <div className="mb-3 inline-flex rounded-2xl bg-sky-400/15 p-2 text-sky-200">
                        <Icon className="size-4" />
                      </div>
                      <p className="text-sm font-medium text-white">{title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">
                  Danh muc noi bat
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Cac nhom san pham duoc sap xep gon va de quet mat hon.
                </h2>
              </div>
              <Button
                variant="outline"
                className="rounded-full border-slate-200 bg-white px-5 text-slate-700 hover:bg-slate-100"
              >
                Xem tat ca
              </Button>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-4">
              {categories.map(({ name, description, icon: Icon }) => (
                <article
                  key={name}
                  className="group rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-lg"
                >
                  <div className="inline-flex rounded-2xl bg-slate-950 p-3 text-sky-300 transition group-hover:bg-sky-500 group-hover:text-slate-950">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">{name}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-18 sm:px-6 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
                  Featured products
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Card san pham duoc can doi lai de dong deu va sang hon.
                </h2>
              </div>
              <Button className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800">
                Kham pha them
              </Button>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <article
                  key={product.name}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.14)]"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-64 w-full object-cover"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">
                      {product.badge}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-slate-950">
                          {product.name}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {product.description}
                        </p>
                      </div>
                      <div className="shrink-0 rounded-2xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700">
                        Moi
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500">Gia tham khao</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-950">
                          {product.price}
                        </p>
                      </div>
                      <Button className="rounded-full bg-sky-500 px-5 text-white hover:bg-sky-600">
                        Them vao gio
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-[0_28px_90px_rgba(2,8,23,0.3)] sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
                Tu van build PC
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Can mot landing page dep, ro va de chuyen doi hon thi day la huong dung.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Phan hero, danh muc va featured da duoc chia lai theo tung lop thong tin,
                tao trong tam ro hon thay vi de moi khoi cung nang ve thi giac.
              </p>
            </div>

            <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              {[
                "Tieu de va khoang trang de doc hon tren desktop",
                "Card dong deu, can do rong va nhin gon tren mobile",
                "Mau sac xanh - slate sach se, dung chat tech store",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/8 bg-white/6 px-4 py-3 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
