import { Navigate, useSearchParams } from "react-router-dom";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";

  return (
    <Navigate
      to={query ? `/products?q=${encodeURIComponent(query)}` : "/products"}
      replace
    />
  );
}
