import { useState, useMemo } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { ProductBanner } from "@/components/products/ProductBanner";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";

const mockGpus = [
  {
    id: 1,
    name: "NVIDIA RTX 4090 Founders Edition",
    brand: "NVIDIA",
    vram: "24GB",
    price: 45990000,
    originalPrice: 49990000,
    rating: 5,
    reviewsCount: 24,
    tag: "NEW ARRIVAL",
    tagColor: "bg-blue-600",
    discount: "-10%",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "MSI RTX 4080 Super Gaming X Trio",
    brand: "MSI",
    vram: "16GB",
    price: 32490000,
    originalPrice: 39990000,
    rating: 5,
    reviewsCount: 18,
    tag: "SELLING FAST",
    tagColor: "bg-orange-500",
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "ASUS ROG Strix RTX 4070 Ti Super",
    brand: "ASUS",
    vram: "16GB",
    price: 26150000,
    originalPrice: 28500000,
    rating: 5,
    reviewsCount: 42,
    tag: "HOT",
    tagColor: "bg-indigo-600",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "AORUS Master RTX 4080",
    brand: "Gigabyte",
    vram: "16GB",
    price: 49990000,
    rating: 5,
    reviewsCount: 12,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Zotac Gaming RTX 4070 Twin Edge",
    brand: "Gigabyte",
    vram: "12GB",
    price: 15490000,
    rating: 5,
    reviewsCount: 8,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Gigabyte RTX 4060 Ti Aero OC",
    brand: "Gigabyte",
    vram: "8GB",
    price: 11890000,
    originalPrice: 12990000,
    rating: 4,
    reviewsCount: 31,
    tag: "NEW",
    tagColor: "bg-green-600",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "MSI RTX 4060 Ventus 2X Black",
    brand: "MSI",
    vram: "8GB",
    price: 8290000,
    rating: 4.5,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "ASUS Dual RTX 4060 Ti OC",
    brand: "ASUS",
    vram: "16GB",
    price: 13790000,
    rating: 5,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 9,
    name: "Gigabyte RTX 4090 Gaming OC",
    brand: "Gigabyte",
    vram: "24GB",
    price: 54990000,
    rating: 5,
    reviewsCount: 7,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 10,
    name: "NVIDIA RTX 4080 Founders Edition",
    brand: "NVIDIA",
    vram: "16GB",
    price: 35990000,
    rating: 4.8,
    reviewsCount: 15,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 11,
    name: "ASUS TUF RX 7900 XTX OC",
    brand: "ASUS",
    vram: "24GB",
    price: 28990000,
    originalPrice: 31990000,
    rating: 5,
    reviewsCount: 11,
    tag: "HOT",
    tagColor: "bg-red-600",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 12,
    name: "MSI RX 7800 XT Gaming Trio",
    brand: "MSI",
    vram: "16GB",
    price: 15990000,
    rating: 4.7,
    reviewsCount: 22,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 13,
    name: "Gigabyte RX 7600 XT Gaming OC",
    brand: "Gigabyte",
    vram: "16GB",
    price: 9490000,
    rating: 4.2,
    reviewsCount: 5,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 14,
    name: "ASUS ROG Strix RTX 4060 OC",
    brand: "ASUS",
    vram: "8GB",
    price: 9990000,
    rating: 4.6,
    reviewsCount: 17,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 15,
    name: "MSI RTX 4070 Ti Ventus 3X OC",
    brand: "MSI",
    vram: "12GB",
    price: 21990000,
    originalPrice: 23990000,
    rating: 4.9,
    reviewsCount: 30,
    tag: "HOT",
    tagColor: "bg-red-600",
    discount: "-8%",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop"
  }
];

function Products() {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedVram, setSelectedVram] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100]); // in millions
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const handleBrandToggle = (brand) => {
    setCurrentPage(1);
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleVramToggle = (vram) => {
    setCurrentPage(1);
    setSelectedVram((prev) => (prev === vram ? null : vram));
  };

  const handlePriceChange = (range) => {
    setCurrentPage(1);
    setPriceRange(range);
  };

  // Filtered & Sorted Products
  const filteredSortedProducts = useMemo(() => {
    let result = [...mockGpus];

    // Filter by Brand
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Filter by VRAM
    if (selectedVram) {
      result = result.filter((p) => p.vram === selectedVram);
    }

    // Filter by Price range (min and max limits)
    const minPriceLimit = priceRange[0] * 1000000;
    const maxPriceLimit = priceRange[1] * 1000000;
    result = result.filter((p) => p.price >= minPriceLimit && p.price <= maxPriceLimit);

    // Sort products
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedBrands, selectedVram, priceRange, sortBy]);

  // Paginated Slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSortedProducts.slice(start, start + pageSize);
  }, [filteredSortedProducts, currentPage, pageSize]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />
      
      {/* Dynamic Banner */}
      <ProductBanner totalProducts={filteredSortedProducts.length} />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <ProductFilters
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              selectedVram={selectedVram}
              onVramToggle={handleVramToggle}
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
            />
          </aside>

          {/* Product Grid */}
          <main className="flex-1 w-full">
            <ProductGrid
              products={paginatedProducts}
              totalProducts={filteredSortedProducts.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              sortBy={sortBy}
              onSortChange={(val) => {
                setCurrentPage(1);
                setSortBy(val);
              }}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Products;
