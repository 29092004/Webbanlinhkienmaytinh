import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 relative">
      <Header />

      {/* Left Sticky Banner */}
      <div className="hidden xl:block fixed top-32 left-0 w-[160px] h-[70vh] z-40">
        <img 
          src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=320&h=1000&auto=format&fit=crop" 
          alt="Left Banner" 
          className="w-full h-full object-cover rounded-r-xl shadow-2xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer origin-left border border-gray-100"
        />
      </div>

      {/* Right Sticky Banner */}
      <div className="hidden xl:block fixed top-32 right-0 w-[160px] h-[70vh] z-40">
        <img 
          src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=320&h=1000&auto=format&fit=crop" 
          alt="Right Banner" 
          className="w-full h-full object-cover rounded-l-xl shadow-2xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer origin-right border border-gray-100"
        />
      </div>

      <main>
        <HeroSection />
        <CategorySection />
        <FlashSaleSection />
        <FeaturedProductsSection />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
