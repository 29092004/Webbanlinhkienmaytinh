import SearchProductCard from "./SearchProductCard";

export default function SearchResultsGrid({ products = [] }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <SearchProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
