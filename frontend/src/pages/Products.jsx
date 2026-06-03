/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { api } from "@/lib/api";
import {
  mapProductForListing,
  normalizeBrandIdsFromQuery,
  normalizeCategoryIdsFromQuery,
  slugifyCategory,
} from "@/lib/productMappers";

const normalizePageFromQuery = (searchParams) => {
  const pageFromQuery = Number(searchParams.get("page") || 1);
  return Number.isInteger(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1;
};

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.trim() || "";
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]); // percentage 0% to 100% (mapped to 0 - 100 million)
  const [sortBy, setSortBy] = useState("newest");
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 8;
  const currentPage = normalizePageFromQuery(searchParams);

  const updatePageQuery = (nextPage) => {
    const normalizedPage = Math.max(1, Number(nextPage) || 1);
    const nextParams = new URLSearchParams(searchParams);

    if (normalizedPage <= 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(normalizedPage));
    }

    setSearchParams(nextParams, { replace: false });
  };

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategories(normalizeCategoryIdsFromQuery(category));
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  useEffect(() => {
    const brand = searchParams.get("brand");
    if (brand) {
      setSelectedBrands(normalizeBrandIdsFromQuery(brand));
    } else {
      setSelectedBrands([]);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    const fetchFilterOptions = async () => {
      try {
        const [categoryResponse, brandResponse] = await Promise.all([
          api.get("/categories"),
          api.get("/brands"),
        ]);

        if (!isMounted) {
          return;
        }

        const categoryRows = Array.isArray(categoryResponse.data?.data) ? categoryResponse.data.data : [];
        const brandRows = Array.isArray(brandResponse.data?.data) ? brandResponse.data.data : [];

        setAvailableCategories(
          categoryRows.map((category) => ({
            id: slugifyCategory(category.name),
            label: category.name || "Khac",
          }))
        );
        setAvailableBrands(
          brandRows.map((brand) => ({
            id: brand.brand_name || "Khac",
            label: brand.brand_name || "Khac",
          }))
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to fetch filter options", error);
        setAvailableCategories([]);
        setAvailableBrands([]);
      }
    };

    fetchFilterOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const selectedCategoryNames = selectedCategories
          .map((slug) => availableCategories.find((category) => category.id === slug)?.label)
          .filter(Boolean);
        const params = {
          page: currentPage,
          limit: pageSize,
          sort: sortBy,
        };

        if (searchQuery) {
          params.q = searchQuery;
        }

        if (selectedCategoryNames.length > 0) {
          params.categories = selectedCategoryNames.join(",");
        }

        if (selectedBrands.length > 0) {
          params.brands = selectedBrands.join(",");
        }

        const minPriceLimit = priceRange[0] * 1000000;
        const maxPriceLimit = priceRange[1] * 1000000;

        if (minPriceLimit > 0) {
          params.minPrice = minPriceLimit;
        }

        if (maxPriceLimit > 0) {
          params.maxPrice = maxPriceLimit;
        }

        const response = await api.get("/products", { params });
        const rows = Array.isArray(response.data?.data) ? response.data.data : [];
        const mappedProducts = rows.map(mapProductForListing);
        const pagination = response.data?.pagination ?? {};

        if (!isMounted) {
          return;
        }

        setProducts(mappedProducts);
        setTotalProducts(Number(pagination.totalItems || 0));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to fetch products", error);
        setProducts([]);
        setTotalProducts(0);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (availableCategories.length === 0 && selectedCategories.length > 0) {
      return () => {
        isMounted = false;
      };
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [availableCategories, currentPage, pageSize, priceRange, searchQuery, selectedBrands, selectedCategories, sortBy]);

  const handleCategoryToggle = (categoryId) => {
    updatePageQuery(1);
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleBrandToggle = (brandId) => {
    updatePageQuery(1);
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handlePriceChange = (range) => {
    updatePageQuery(1);
    setPriceRange(range);
  };

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
              products={products}
              totalProducts={totalProducts}
              displayTotalCount={totalProducts}
              title={searchQuery ? `Kết quả cho "${searchQuery}"` : "Tất cả sản phẩm"}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={updatePageQuery}
              sortBy={sortBy}
              onSortChange={(val) => {
                updatePageQuery(1);
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
