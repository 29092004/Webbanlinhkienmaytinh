import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 relative">
      <Header />

      <main>
        <HeroSection />
        <CategorySection />
        <FlashSaleSection />
        <FeaturedProductsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
