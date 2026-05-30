import { useEffect, useState, useMemo } from "react";
import { Search, X, ImageOff, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { resolveAssetUrl } from "@/components/admin/product/productUtils";
import { searchProductsByName } from "@/lib/productMappers";

const getCategoryKeys = (categoryName) => {
  const norm = String(categoryName || "").toLowerCase();
  if (norm.includes("cpu") || norm.includes("vi xử lý")) return ["cpu"];
  if (norm.includes("gpu") || norm.includes("vga") || norm.includes("card")) return ["gpu"];
  if (norm.includes("mainboard") || norm.includes("bo mạch")) return ["mainboard"];
  if (norm.includes("ram") || norm.includes("bộ nhớ")) return ["ram"];
  if (norm.includes("ssd")) return ["ssd"];
  if (norm.includes("hdd")) return ["hdd"];
  if (norm.includes("power") || norm.includes("nguồn")) return ["power supply"];
  if (norm.includes("case") || norm.includes("vỏ")) return ["case pc"];
  if (norm.includes("cooling") || norm.includes("tản")) return ["cooling fan"];
  if (norm.includes("monitor") || norm.includes("màn hình")) return ["monitor"];
  if (norm.includes("keyboard") || norm.includes("bàn phím")) return ["keyboard"];
  if (norm.includes("mouse") || norm.includes("chuột")) return ["mouse"];
  if (norm.includes("headphone") || norm.includes("tai nghe")) return ["headphone"];
  if (norm.includes("speaker") || norm.includes("loa")) return ["speaker"];
  if (norm.includes("router") || norm.includes("mạng")) return ["router"];
  return [norm];
};

export function PCBuilderSelectorModal({
  isOpen,
  onClose,
  slot,
  onSelect,
}) {
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products when modal opens
  useEffect(() => {
    if (!isOpen || !slot) return;

    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/products");
        if (isMounted) {
          setAllProducts(Array.isArray(response.data?.data) ? response.data.data : []);
        }
      } catch (error) {
        console.error("Failed to fetch products for PC Builder slot", error);
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
  }, [isOpen, slot]);

  // Filter products by slot's category
  const filteredByCategory = useMemo(() => {
    if (!slot) return [];
    const keys = getCategoryKeys(slot.category_name);
    return allProducts.filter((p) => {
      const pCat = String(p.category_name || "").toLowerCase();
      return keys.some((k) => pCat.includes(k) || k.includes(pCat));
    });
  }, [allProducts, slot]);

  // Filter products by search text
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return filteredByCategory;
    }
    return searchProductsByName(filteredByCategory, searchQuery);
  }, [filteredByCategory, searchQuery]);

  if (!isOpen || !slot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Chọn linh kiện: {slot.name}
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Danh mục tương thích: {slot.category_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition">
            <Search className="size-4.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
              placeholder={`Tìm kiếm ${slot.category_name} phù hợp...`}
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

        {/* Products List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <div className="text-center py-12 text-sm text-slate-400 font-semibold">
              Đang tải danh sách linh kiện...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {searchResults.map((product) => {
                const mainImage = product.images?.[0]?.url
                  ? resolveAssetUrl(product.images[0].url)
                  : null;
                return (
                  <div
                    key={product.id}
                    className="py-3 flex items-center gap-4 hover:bg-slate-50/50 rounded-xl px-2 transition"
                  >
                    <div className="size-14 bg-slate-50 rounded-xl overflow-hidden p-1 flex items-center justify-center border border-slate-100 shrink-0">
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
                      <h4 className="text-sm font-extrabold text-slate-800 line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">
                        Thương hiệu: {product.brand_name || "Linh kiện"} | Tồn kho: {product.quantity}
                      </p>
                      <p className="text-xs font-extrabold text-red-600 mt-1">
                        {Number(product.retail_price).toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                    <button
                      onClick={() => onSelect(product)}
                      disabled={product.quantity <= 0}
                      className={`rounded-xl px-4 py-2 text-xs font-black transition shrink-0 uppercase cursor-pointer ${
                        product.quantity <= 0
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      }`}
                    >
                      {product.quantity <= 0 ? "Hết hàng" : "Chọn"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-sm text-slate-400 font-medium">
              Không tìm thấy linh kiện {slot.category_name} phù hợp.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
