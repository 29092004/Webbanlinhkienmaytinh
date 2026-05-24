import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import SearchFilters from "@/components/search/SearchFilters";
import SearchResultsGrid from "@/components/search/SearchResultsGrid";
import SearchResultsHeader from "@/components/search/SearchResultsHeader";
import SearchPagination from "@/components/search/SearchPagination";

const searchProducts = [
  {
    id: 1,
    brand: "ASUS ROG STRIX",
    name: "GeForce RTX® 4090 OC Edition...",
    price: 54990000,
    tag: "Bán chạy",
    tagTone: "blue",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=700&auto=format&fit=crop",
    specs: [
      { label: "Core Clock", value: "2640 MHz" },
      { label: "VRAM", value: "24GB GDDR6X" },
    ],
  },
  {
    id: 2,
    brand: "MSI SUPRIM X",
    name: "GeForce RTX® 4090 SUPRIM...",
    price: 59450000,
    tag: "Cao cấp",
    tagTone: "orange",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=700&auto=format&fit=crop",
    specs: [
      { label: "Cooling", value: "AIO Liquid" },
      { label: "VRAM", value: "24GB GDDR6X" },
    ],
  },
  {
    id: 3,
    brand: "NVIDIA",
    name: "GeForce RTX® 4090 Founders...",
    price: 49990000,
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=700&auto=format&fit=crop",
    specs: [
      { label: "Design", value: "Founders" },
      { label: "VRAM", value: "24GB GDDR6X" },
    ],
  },
];

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "RTX 4090";
  const [sortBy, setSortBy] = useState("newest");

  const sortedProducts = useMemo(() => {
    const products = [...searchProducts];

    if (sortBy === "price-asc") {
      return products.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-desc") {
      return products.sort((a, b) => b.price - a.price);
    }

    return products;
  }, [sortBy]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f9] font-sans text-slate-950">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <SearchResultsHeader
          query={query}
          resultCount={24}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <SearchFilters />

          <div>
            <SearchResultsGrid products={sortedProducts} />
            <SearchPagination />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
