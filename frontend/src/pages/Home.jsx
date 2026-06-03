import { useEffect, useState } from "react";

import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { CategoryProductSection } from "@/components/home/CategoryProductSection";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { StorePolicies } from "@/components/home/StorePolicies";
import { PromoBanners } from "@/components/home/PromoBanners";
import { BrandShowcase } from "@/components/home/BrandShowcase";
import {
  mapCategoryProductsForHome,
  mapSaleProductsForHome,
} from "@/lib/productMappers";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { api } from "@/lib/api";

const HOME_CATEGORY_SECTIONS = [
  {
    key: "laptop",
    title: "Laptop",
    subtitle: "Các mẫu laptop nổi bật đang có trong cửa hàng",
    categoryNames: ["Laptop", "Gaming Laptop"],
  },
  {
    key: "keyboard",
    title: "Bàn phím",
    subtitle: "Phụ kiện bàn phím phục vụ làm việc và gaming",
    categoryNames: ["Bàn phím", "Keyboard"],
  },
  {
    key: "mouse",
    title: "Chuột",
    subtitle: "Các mẫu chuột máy tính cho công việc và gaming",
    categoryNames: ["Chuột", "Mouse"],
  },
  {
    key: "case",
    title: "Case",
    subtitle: "Các mẫu vỏ case cho nhiều nhu cầu lắp ráp PC",
    categoryNames: ["Case", "Case PC", "Vỏ Case"],
  },
  {
    key: "monitor",
    title: "Màn hình",
    subtitle: "Màn hình cho công việc, giải trí và gaming",
    categoryNames: ["Màn hình", "Monitor"],
  },
];

function buildHomeSections(products = []) {
  return HOME_CATEGORY_SECTIONS.map((section) => ({
    ...section,
    products: mapCategoryProductsForHome(products, section.categoryNames),
  }));
}

function Home() {
  const [saleProducts, setSaleProducts] = useState([]);
  const [categorySections, setCategorySections] = useState(() => buildHomeSections([]));

  useEffect(() => {
    let isMounted = true;

    const fetchHomeProducts = async () => {
      try {
        const response = await api.get("/products");
        const products = Array.isArray(response.data?.data) ? response.data.data : [];

        if (!isMounted) {
          return;
        }

        setSaleProducts(mapSaleProductsForHome(products));
        setCategorySections(buildHomeSections(products));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to fetch home products", error);
        setSaleProducts([]);
        setCategorySections(buildHomeSections([]));
      }
    };

    fetchHomeProducts();
    const intervalId = window.setInterval(fetchHomeProducts, 60000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <HeroSection />
        <StorePolicies />
        <CategorySection />
        <FlashSaleSection products={saleProducts} />
        
        {/* Render first two categories */}
        {categorySections.slice(0, 2).map((section) => (
          <CategoryProductSection
            key={section.key}
            title={section.title}
            subtitle={section.subtitle}
            products={section.products}
          />
        ))}

        <PromoBanners />

        {/* Render remaining categories */}
        {categorySections.slice(2).map((section) => (
          <CategoryProductSection
            key={section.key}
            title={section.title}
            subtitle={section.subtitle}
            products={section.products}
          />
        ))}

        <BrandShowcase />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
