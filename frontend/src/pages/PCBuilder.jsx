import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

import BuilderHero from "@/components/pc-builder/BuilderHero";
import BuilderSteps from "@/components/pc-builder/BuilderSteps";
import ComponentSelector from "@/components/pc-builder/ComponentSelector";
import BuildSummary from "@/components/pc-builder/BuildSummary";
import CompatibilityCard from "@/components/pc-builder/CompatibilityCard";
import AIRecommendationCard from "@/components/pc-builder/AIRecommendationCard";
import PerformanceEstimateCard from "@/components/pc-builder/PerformanceEstimateCard";
import BuildPresetList from "@/components/pc-builder/BuildPresetList";

const selectedParts = [
  {
    id: "cpu",
    category: "CPU - Bộ vi xử lý",
    description: "Giữ vai trò bộ não của PC",
    product: "Intel Core i5-13400F",
    detail: "10 nhân / 16 luồng",
    price: 4290000,
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=160&auto=format&fit=crop",
  },
  {
    id: "gpu",
    category: "GPU - Card đồ họa",
    description: "Quyết định hiệu năng chơi game, đồ họa",
    product: "NVIDIA GeForce RTX 4060",
    detail: "8GB GDDR6",
    price: 8990000,
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=160&auto=format&fit=crop",
  },
  {
    id: "mainboard",
    category: "Mainboard - Bo mạch chủ",
    description: "Kết nối tất cả linh kiện với nhau",
    product: "MSI B760M-A WIFI",
    detail: "mATX - WiFi - DDR5",
    price: 2690000,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=160&auto=format&fit=crop",
  },
  {
    id: "ram",
    category: "RAM - Bộ nhớ trong",
    description: "Đa nhiệm mượt mà, không giật lag",
    product: "16GB (2x8GB) DDR5 5600MHz",
    detail: "Tản nhiệt nhôm",
    price: 1390000,
    image:
      "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?q=80&w=160&auto=format&fit=crop",
  },
  {
    id: "storage",
    category: "Storage - Ổ lưu trữ",
    description: "Lưu hệ điều hành, game, dữ liệu",
    product: "1TB SSD NVMe Gen4",
    detail: "Tốc độ cao",
    price: 1790000,
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=160&auto=format&fit=crop",
  },
  {
    id: "cooling",
    category: "Cooling - Tản nhiệt",
    description: "Giữ cho máy luôn mát mẻ, bền bỉ",
    product: "Tản khí ID-COOLING SE-224-XTS",
    detail: "Hiệu năng tốt, êm ái",
    price: 590000,
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=160&auto=format&fit=crop",
  },
  {
    id: "psu",
    category: "PSU - Nguồn máy tính",
    description: "Cung cấp điện ổn định cho hệ thống",
    product: "650W - 80 Plus Bronze",
    detail: "An toàn, ổn định",
    price: 1190000,
    image:
      "https://images.unsplash.com/photo-1592664474505-51c549ad15c5?q=80&w=160&auto=format&fit=crop",
  },
  {
    id: "case",
    category: "Case - Vỏ máy tính",
    description: "Bảo vệ linh kiện, tối ưu luồng gió",
    product: "XIGMATEK MESH X",
    detail: "Mid Tower - 3 fan RGB",
    price: 790000,
    image:
      "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?q=80&w=160&auto=format&fit=crop",
  },
];

const recommendedBuilds = [
  {
    id: "budget",
    name: "Tiết kiệm",
    description: "Phù hợp chơi game eSports, học tập",
    price: 15490000,
    image:
      "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?q=80&w=180&auto=format&fit=crop",
  },
  {
    id: "balanced",
    name: "Cân bằng",
    description: "Chơi game AAA, làm việc mượt mà",
    price: 21710000,
    selected: true,
    image:
      "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?q=80&w=180&auto=format&fit=crop",
  },
  {
    id: "premium",
    name: "Cao cấp",
    description: "Hiệu năng mạnh mẽ cho game 2K/4K",
    price: 32990000,
    image:
      "https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=180&auto=format&fit=crop",
  },
];

export default function PCBuilder() {
  const subtotal = selectedParts.reduce((sum, part) => sum + part.price, 0);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] font-sans text-slate-950">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <BuilderHero />
        <BuilderSteps />

        <div className="mt-6 grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
          <ComponentSelector parts={selectedParts} />
          <BuildSummary total={subtotal} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <CompatibilityCard />
          <AIRecommendationCard />
          <PerformanceEstimateCard />
        </div>

        <BuildPresetList builds={recommendedBuilds} />
      </main>

      <Footer />
    </div>
  );
}
