import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";

const mockProductsList = [
  {
    id: 1,
    name: "ASUS ROG Strix GeForce RTX 4090 OC Edition",
    brand: "ASUS",
    category: "gpu",
    price: 56990000,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 128,
    tag: "NEW ARRIVAL",
    tagColor: "bg-blue-600",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Intel Core i9-14900K Desktop Processor",
    brand: "Intel",
    category: "cpu",
    price: 14490000,
    originalPrice: 16990000,
    rating: 4.8,
    reviewsCount: 95,
    tag: "SALE -15%",
    tagColor: "bg-orange-500",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Corsair Dominator Titanium RGB 32GB DDR5 6000MHz",
    brand: "Corsair",
    category: "ram",
    price: 5250000,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 210,
    tag: null,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Samsung 990 PRO PCIe 4.0 NVMe SSD 2TB",
    brand: "Samsung",
    category: "ssd",
    price: 4890000,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 340,
    tag: null,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "MSI MEG Z790 GODLIKE LGA 1700 Motherboard",
    brand: "MSI",
    category: "motherboard",
    price: 28490000,
    originalPrice: null,
    rating: 4.6,
    reviewsCount: 56,
    tag: null,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Corsair AX1600i Digital ATX Power Supply",
    brand: "Corsair",
    category: "psu",
    price: 12990000,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 82,
    tag: null,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "NZXT H9 Flow Dual-Chamber Mid-Tower Case",
    brand: "NZXT",
    category: "case",
    price: 4290000,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 112,
    tag: null,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "Lian Li Galahad II LCD 360 Liquid Cooler",
    brand: "Lian Li",
    category: "cooler",
    price: 6850000,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 89,
    tag: null,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop"
  }
];

// Generate exactly 96 products (12 pages of 8 products)
const allProducts = [];
for (let i = 0; i < 12; i++) {
  mockProductsList.forEach((p, idx) => {
    allProducts.push({
      ...p,
      id: i * 8 + idx + 1,
      name: i === 0 ? p.name : `${p.name} (Lô ${i + 1})`,
    });
  });
}

function Products() {
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategories([category]);
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]); // percentage 0% to 100% (mapped to 0 - 100 million)
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const handleCategoryToggle = (categoryId) => {
    setCurrentPage(1);
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleBrandToggle = (brandId) => {
    setCurrentPage(1);
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handlePriceChange = (range) => {
    setCurrentPage(1);
    setPriceRange(range);
  };

  // Filtered & Sorted Products
  const filteredSortedProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by Category
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Filter by Brand
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Filter by Price range (0M - 100M)
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
  }, [selectedCategories, selectedBrands, priceRange, sortBy]);

  // Paginated Slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSortedProducts.slice(start, start + pageSize);
  }, [filteredSortedProducts, currentPage, pageSize]);

  // If no filters are active, display 482 count to match layout design exactly
  const displayTotalCount = useMemo(() => {
    if (selectedCategories.length === 0 && selectedBrands.length === 0 && priceRange[0] === 0 && priceRange[1] === 100) {
      return 482;
    }
    // Scale count proportionally for realistic feel
    return Math.round(filteredSortedProducts.length * (482 / 96));
  }, [filteredSortedProducts, selectedCategories, selectedBrands, priceRange]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />
      
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        
        {/* Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Sản phẩm" }
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-8 items-start pt-2">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <ProductFilters
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
            />
          </aside>

          {/* Product Grid */}
          <main className="flex-1 w-full">
            <ProductGrid
              products={paginatedProducts}
              totalProducts={filteredSortedProducts.length}
              displayTotalCount={displayTotalCount}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              sortBy={sortBy}
              onSortChange={(val) => {
                setCurrentPage(1);
                setSortBy(val);
              }}
            />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Products;
