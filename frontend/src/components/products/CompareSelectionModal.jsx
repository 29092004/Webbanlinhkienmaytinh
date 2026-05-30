import { useEffect, useState, useMemo } from "react";
import { Search, X, ImageOff, Check } from "lucide-react";
import { api } from "@/lib/api";
import { searchProductsByName } from "@/lib/productMappers";
import { resolveAssetUrl } from "@/components/admin/product/productUtils";

export function CompareSelectionModal({
  isOpen,
  onClose,
  currentProduct,
  onSelect,
  alreadySelectedIds = [],
}) {
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all products when modal opens
  useEffect(() => {
    if (!isOpen || !currentProduct) return;

    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/products");
        const products = Array.isArray(response.data?.data) ? response.data.data : [];
        if (isMounted) {
          setAllProducts(products);
        }
      } catch (error) {
        console.error("Failed to fetch products for comparison", error);
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
  }, [isOpen, currentProduct]);

  // Filter products: must be same category, not the current product, and not already selected
  const sameCategoryProducts = useMemo(() => {
    if (!currentProduct) return [];
    return allProducts.filter(
      (p) =>
        p.category_id === currentProduct.category_id &&
        p.id !== currentProduct.id &&
        !alreadySelectedIds.includes(p.id)
    );
  }, [allProducts, currentProduct, alreadySelectedIds]);

  // Handle Search filtering
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return sameCategoryProducts.slice(0, 3); // show top 3 same category products by default
    }
    return searchProductsByName(sameCategoryProducts, searchQuery);
  }, [sameCategoryProducts, searchQuery]);

  if (!isOpen || !currentProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-slate-900">
            Chọn sản phẩm so sánh
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Recently Viewed / Suggestion Section */}
          {!searchQuery.trim() && sameCategoryProducts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                {currentProduct.category_name || "Sản phẩm"} cùng danh mục
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {sameCategoryProducts.slice(0, 2).map((product) => {
                  const mainImage = product.images?.[0]?.url
                    ? resolveAssetUrl(product.images[0].url)
                    : null;
                  return (
                    <div
                      key={product.id}
                      className="border border-slate-100 rounded-2xl p-3 flex flex-col items-center text-center bg-slate-50/50 hover:bg-slate-50 transition"
                    >
                      <div className="size-20 bg-white rounded-xl overflow-hidden p-1 flex items-center justify-center mb-3">
                        {mainImage ? (
                          <img
                            src={mainImage}
                            alt={product.name}
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <ImageOff className="size-8 text-slate-300" />
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-2 min-h-[32px] mb-2">
                        {product.name}
                      </h4>
                      <p className="text-xs font-extrabold text-red-600 mb-3">
                        {Number(product.retail_price).toLocaleString("vi-VN")} đ
                      </p>
                      <button
                        onClick={() => onSelect(product)}
                        className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1 transition"
                      >
                        <Check className="size-3.5" />
                        So sánh
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Hoặc nhập tên để tìm
            </h3>
            <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition">
              <Search className="size-4.5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                placeholder={`Nhập tên sản phẩm để tìm...`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Results list */}
          <div className="space-y-3 pt-2">
            {isLoading ? (
              <div className="text-center py-6 text-sm text-slate-400 font-semibold">
                Đang tải danh sách sản phẩm...
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const mainImage = product.images?.[0]?.url
                    ? resolveAssetUrl(product.images[0].url)
                    : null;
                  return (
                    <div
                      key={product.id}
                      className="py-3 flex items-center gap-4 hover:bg-slate-50/50 rounded-xl px-2 transition"
                    >
                      <div className="size-12 bg-slate-100 rounded-lg overflow-hidden p-1 flex items-center justify-center shrink-0">
                        {mainImage ? (
                          <img
                            src={mainImage}
                            alt={product.name}
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <ImageOff className="size-6 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs font-semibold text-slate-400">
                          {product.brand_name || "Linh kiện"}
                        </p>
                        <p className="text-xs font-extrabold text-red-600 mt-0.5">
                          {Number(product.retail_price).toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                      <button
                        onClick={() => onSelect(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-bold transition shrink-0"
                      >
                        So sánh
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-slate-400 font-medium">
                Không tìm thấy sản phẩm phù hợp.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
