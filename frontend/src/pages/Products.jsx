import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { api } from "@/lib/api";
import {
  mapAvailableBrands,
  mapAvailableCategories,
  mapProductForListing,
  normalizeCategoryIdsFromQuery,
  searchProductsByName,
} from "@/lib/productMappers";

function Products() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.trim() || "";
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategories(normalizeCategoryIdsFromQuery(category));
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]); // percentage 0% to 100% (mapped to 0 - 100 million)
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/products");
        const rows = Array.isArray(response.data?.data) ? response.data.data : [];
        const mappedProducts = rows.map(mapProductForListing);

        if (!isMounted) {
          return;
        }

        setAllProducts(mappedProducts);
        setAvailableCategories(mapAvailableCategories(rows));
        setAvailableBrands(mapAvailableBrands(rows));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to fetch products", error);
        setAllProducts([]);
        setAvailableCategories([]);
        setAvailableBrands([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

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

    if (searchQuery) {
      result = searchProductsByName(result, searchQuery);
    }

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
    if (sortBy === "newest") {
      result.sort((a, b) => b.id - a.id);
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [allProducts, selectedCategories, selectedBrands, priceRange, sortBy, searchQuery]);

  // Paginated Slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSortedProducts.slice(start, start + pageSize);
  }, [filteredSortedProducts, currentPage, pageSize]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredSortedProducts.length / pageSize));

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, filteredSortedProducts.length, pageSize]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />
      
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        
        {/* Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Sản phẩm" },
            ...(searchQuery ? [{ label: `Tìm: ${searchQuery}` }] : []),
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
              categoriesList={availableCategories}
              brandsList={availableBrands}
            />
          </aside>

          {/* Product Grid */}
          <main className="flex-1 w-full">
            <ProductGrid
              products={paginatedProducts}
              totalProducts={filteredSortedProducts.length}
              displayTotalCount={filteredSortedProducts.length}
              title={searchQuery ? `Kết quả cho "${searchQuery}"` : "Tất cả sản phẩm"}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              sortBy={sortBy}
              onSortChange={(val) => {
                setCurrentPage(1);
                setSortBy(val);
              }}
              isLoading={isLoading}
            />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Products;
