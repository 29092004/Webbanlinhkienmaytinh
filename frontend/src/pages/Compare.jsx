import { useEffect, useState, useMemo } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { mapProductDetailForView } from "@/lib/productMappers";
import { CompareHeader } from "@/components/products/CompareHeader";
import { CompareSpecsTable } from "@/components/products/CompareSpecsTable";
import { CompareSelectionModal } from "@/components/products/CompareSelectionModal";
import { showToast } from "@/lib/toast";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function Compare() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const idsStr = searchParams.get("ids") || "";
  const productIds = useMemo(() => {
    return idsStr
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id) && id > 0);
  }, [idsStr]);

  // Fetch all products to get details for comparison
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/products");
        if (isMounted) {
          setAllProducts(Array.isArray(response.data?.data) ? response.data.data : []);
        }
      } catch (error) {
        console.error("Failed to fetch products for comparison", error);
        showToast({ message: "Không thể tải dữ liệu sản phẩm.", type: "error" });
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

  // Filter and map the products being compared
  const comparedProducts = useMemo(() => {
    if (allProducts.length === 0 || productIds.length === 0) return [];
    
    // Get full product objects matching IDs
    const matched = productIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter(Boolean);

    // Validate categories: all compared products must have the same category
    if (matched.length > 1) {
      const firstCatId = matched[0].category_id;
      const hasDifferentCategory = matched.some((p) => p.category_id !== firstCatId);

      if (hasDifferentCategory) {
        // Enforce same category constraint by filtering out invalid categories
        showToast({
          message: "Chỉ có thể so sánh các sản phẩm cùng loại. Hệ thống đã lọc bớt sản phẩm khác loại.",
          type: "warning",
        });
        const validMatched = matched.filter((p) => p.category_id === firstCatId);
        
        // Update URL to match valid items
        const validIds = validMatched.map((p) => p.id).join(",");
        setTimeout(() => {
          setSearchParams({ ids: validIds });
        }, 0);
        
        return validMatched.map(mapProductDetailForView);
      }
    }

    return matched.map(mapProductDetailForView);
  }, [allProducts, productIds, setSearchParams]);

  // Determine current category metadata for the selection modal
  const categoryMetadata = useMemo(() => {
    if (comparedProducts.length === 0) return null;
    return {
      category_id: comparedProducts[0].specs?.["Danh mục"] 
        ? allProducts.find(p => p.id === comparedProducts[0].id)?.category_id 
        : allProducts.find(p => p.id === comparedProducts[0].id)?.category_id,
      category_name: comparedProducts[0].categoryName || "",
    };
  }, [comparedProducts, allProducts]);

  // Handle removing a product from comparison
  const handleRemoveProduct = (productId) => {
    const nextIds = productIds.filter((id) => id !== productId);
    if (nextIds.length === 0) {
      setSearchParams({});
    } else {
      setSearchParams({ ids: nextIds.join(",") });
    }
    showToast({ message: "Đã xóa sản phẩm khỏi danh sách so sánh.", type: "success" });
  };

  // Handle adding a product from selector modal
  const handleSelectProduct = (selectedProduct) => {
    // Check limit
    if (productIds.length >= 3) {
      showToast({ message: "So sánh tối đa 3 sản phẩm.", type: "warning" });
      setIsModalOpen(false);
      return;
    }

    // Check same category
    if (comparedProducts.length > 0 && selectedProduct.category_id !== categoryMetadata.category_id) {
      showToast({ message: "Chỉ có thể so sánh sản phẩm cùng loại.", type: "warning" });
      setIsModalOpen(false);
      return;
    }

    // Update query string
    const nextIds = [...productIds, selectedProduct.id].join(",");
    setSearchParams({ ids: nextIds });
    setIsModalOpen(false);
    showToast({ message: `Đã thêm ${selectedProduct.name} vào so sánh.`, type: "success" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Linh kiện PC", href: "/products" },
            { label: "So sánh sản phẩm" },
          ]}
        />

        {/* Back and Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white hover:bg-slate-100 rounded-full border border-slate-200 transition text-slate-600 cursor-pointer"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight">
                So sánh sản phẩm
              </h1>
              {comparedProducts.length > 0 && (
                <p className="text-xs text-slate-400 font-bold mt-1">
                  Đang hiển thị so sánh chi tiết giữa các sản phẩm {categoryMetadata?.category_name}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="text-xs font-bold text-slate-900 hover:text-slate-700 transition flex items-center gap-1.5"
          >
            Quay lại trang sản phẩm
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center text-sm font-semibold text-slate-400 shadow-sm flex items-center justify-center gap-2">
            <RefreshCw className="size-4 animate-spin" />
            Đang tải dữ liệu so sánh...
          </div>
        ) : comparedProducts.length > 0 ? (
          <div className="space-y-6">
            {/* Header Product Grid */}
            <CompareHeader
              products={comparedProducts}
              onRemove={handleRemoveProduct}
              onAddClick={() => setIsModalOpen(true)}
              categoryName={categoryMetadata?.category_name}
            />

            {/* Spec Comparison Table */}
            <CompareSpecsTable products={comparedProducts} />
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
            <div className="text-slate-400 text-sm font-semibold">
              Chưa có sản phẩm nào được chọn để so sánh.
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Vui lòng quay lại trang danh sách sản phẩm hoặc trang chi tiết sản phẩm và bấm nút "So sánh".
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate("/products")}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-6 py-3 text-xs font-black transition cursor-pointer"
              >
                TỚI DANH SÁCH SẢN PHẨM
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Selector modal for adding products on this page */}
      {categoryMetadata && (
        <CompareSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentProduct={{
            id: comparedProducts[0]?.id,
            category_id: categoryMetadata.category_id,
            category_name: categoryMetadata.category_name,
          }}
          onSelect={handleSelectProduct}
          alreadySelectedIds={productIds}
        />
      )}

      <Footer />
    </div>
  );
}
