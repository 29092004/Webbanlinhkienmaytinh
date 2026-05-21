import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { formatSalePercentage, renderSpecPreviewContent, resolveAssetUrl } from "./productUtils";

export function ProductDetailModal({ open, product, brands = [], categories = [], onClose }) {
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  useEffect(() => {
    setIsSpecsOpen(false);
  }, [product?.id, open]);

  if (!open || !product) return null;

  const brand = brands.find((item) => item.brand_id === product.brand_id);
  const category = categories.find((item) => item.id === product.category_id);
  const parsedSpecs = (() => {
    if (typeof product.specs !== "string" || !product.specs.trim()) {
      return null;
    }

    try {
      let parsedValue = JSON.parse(product.specs);

      while (typeof parsedValue === "string") {
        try {
          parsedValue = JSON.parse(parsedValue);
        } catch {
          break;
        }
      }

      return parsedValue;
    } catch {
      return product.specs;
    }
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900">Chi tiết sản phẩm</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Tên sản phẩm</label>
            <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
              {product.name || "Chưa cập nhật"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Giá nhập</label>
              <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                {Number(product.import_price || 0).toLocaleString("vi-VN")} đ
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Giá bán</label>
              <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                {Number(product.retail_price || 0).toLocaleString("vi-VN")} đ
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Thương hiệu</label>
              <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                {brand?.brand_name || "N/A"}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Danh mục</label>
              <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                {category?.name || "N/A"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Xuất xứ</label>
              <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                {product.origin || "Chưa cập nhật"}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Bảo hành</label>
              <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                {product.warranty || "Chưa cập nhật"}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Số lượng</label>
              <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                {product.quantity ?? 0}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Khuyến mãi</label>
            <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
              {product.sale_id ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    Đang sale
                  </span>
                  <span>
                    {product.sale_type === "fixed" ? "Giảm trực tiếp" : "Giảm phần trăm"}:{" "}
                    <strong>
                      {product.sale_type === "fixed"
                        ? `${Number(product.sale_value || 0).toLocaleString("vi-VN")} đ`
                        : formatSalePercentage(product.sale_value)}
                    </strong>
                  </span>
                  {product.sale_duration ? (
                    <span className="text-slate-500">Thời lượng: {product.sale_duration} ngày</span>
                  ) : null}
                </div>
              ) : (
                "Không có khuyến mãi"
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Mô tả</label>
            <div className="min-h-[100px] border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
              {product.description?.trim() ? product.description : "Chưa có mô tả."}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Cấu hình chi tiết</label>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsSpecsOpen((prev) => !prev)}
                className="flex w-full items-center justify-between border-b border-slate-200 px-4 py-3 text-left transition hover:bg-slate-100"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-700">File thông số kỹ thuật</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Nhấn để {isSpecsOpen ? "thu gọn" : "xem"} nội dung thông số kỹ thuật.
                  </div>
                </div>
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200">
                  {isSpecsOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </span>
              </button>
              {isSpecsOpen && (
                <div className="p-4">
                  {parsedSpecs ? (
                    renderSpecPreviewContent(parsedSpecs)
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
                      Chưa có thông số kỹ thuật.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Hình ảnh sản phẩm</label>
            <div className="border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                <span>Ảnh sản phẩm</span>
                <span>{product.images?.length ?? 0} ảnh</span>
              </div>
              {product.images?.length ? (
                <div className="grid gap-4 p-4 sm:grid-cols-3">
                  {product.images.map((image, index) => (
                    <div key={image.id ?? image.url} className="border border-slate-200 bg-white">
                      <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                        {index === 0 ? `Ảnh ${index + 1} - Ảnh chính` : `Ảnh ${index + 1}`}
                      </div>
                      <div className="flex h-44 items-center justify-center bg-white p-3">
                        <img
                          src={resolveAssetUrl(image.url)}
                          alt=""
                          className="max-h-full max-w-full object-contain"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                            const fallback = event.currentTarget.nextElementSibling;
                            if (fallback) {
                              fallback.classList.remove("hidden");
                            }
                          }}
                        />
                        <div className="hidden text-center text-sm text-slate-500">
                          Không tải được ảnh này
                        </div>
                      </div>
                      <div className="border-t border-slate-200 px-3 py-2 text-xs text-slate-500">
                        {index === 0 ? "Hiển thị đầu tiên ở trang chi tiết sản phẩm." : `Hiển thị sau Ảnh ${index}.`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-sm text-slate-500">Chưa có ảnh cho sản phẩm này.</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="button" variant="outline" onClick={onClose} className="h-11 px-5">
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
