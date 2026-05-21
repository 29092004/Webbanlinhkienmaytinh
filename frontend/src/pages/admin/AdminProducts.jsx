import { ChevronDown, ChevronUp, Eye, Package, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const resolveAssetUrl = (value) => {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (/^\/\//.test(value)) {
    return `http:${value}`;
  }

  const apiBaseUrl = api.defaults.baseURL ?? "";
  const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, "");

  try {
    return new URL(value, `${apiOrigin}/`).toString();
  } catch {
    return `${apiOrigin}${value.startsWith("/") ? value : `/${value}`}`;
  }
};

function renderSpecPreviewContent(specPreview) {
  if (typeof specPreview === "string") {
    return (
      <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-sm font-medium leading-7 text-slate-700 whitespace-pre-wrap">{specPreview}</p>
      </div>
    );
  }

  if (Array.isArray(specPreview) && specPreview.length > 0 && typeof specPreview[0] !== "object") {
    return (
      <div className="grid gap-3">
        {specPreview.map((item, index) => (
          <div key={`${item}-${index}`} className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            {String(item)}
          </div>
        ))}
      </div>
    );
  }

  if (Array.isArray(specPreview) && specPreview.length > 0 && typeof specPreview[0] === "object" && specPreview[0] !== null) {
    const columns = Array.from(
      specPreview.reduce((set, row) => {
        Object.keys(row).forEach((key) => set.add(key));
        return set;
      }, new Set())
    );

    return (
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 text-left font-semibold text-slate-700">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {specPreview.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column}`} className="px-4 py-3 align-top text-slate-600">
                    {String(row[column] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <pre className="overflow-x-auto rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
      {JSON.stringify(specPreview, null, 2)}
    </pre>
  );
}

function ProductDetailModal({ open, product, brands = [], categories = [], onClose }) {
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
                <span>{product.images?.length ?? 0}/3 ảnh</span>
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

function ProductModal({
  open,
  title,
  submitLabel,
  formData,
  imagePreviews = [],
  specPreview,
  isSpecPreviewOpen,
  isSpecPreviewLoading,
  onToggleSpecPreview,
  onSpecFileChange,
  onChange,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  isDelete = false,
  brands = [],
  categories = []
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-3xl rounded-[24px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 mb-5">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          {isDelete ? (
            <p className="text-sm leading-7 text-slate-600">
              Bạn có chắc muốn xóa sản phẩm{" "}
              <span className="font-bold text-slate-900">{formData.name}</span> không?
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tên sản phẩm</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Giá nhập</label>
                  <input
                    type="number"
                    value={formData.importPrice}
                    onChange={(e) => onChange("importPrice", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Giá bán</label>
                  <input
                    type="number"
                    value={formData.retailPrice}
                    onChange={(e) => onChange("retailPrice", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Thương hiệu</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => onChange("brandId", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    required
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map(b => (
                      <option key={b.brand_id} value={b.brand_id}>{b.brand_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Danh mục</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => onChange("categoryId", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Xuất xứ</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => onChange("origin", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Bảo hành</label>
                  <input
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => onChange("warranty", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Số lượng</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => onChange("quantity", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => onChange("description", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 min-h-[100px]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  File cấu hình (.xlsx, .xls, .json)
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.json,application/json,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={(e) => onSpecFileChange(e.target.files?.[0] ?? null)}
                  disabled={isSubmitting}
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <p className="mt-2 text-xs text-slate-500">
                  {formData.specFileName
                    ? `Đã chọn: ${formData.specFileName}`
                    : "Chọn file cấu hình từ máy tính ở định dạng Excel hoặc JSON."}
                </p>
                {(formData.specFileName || specPreview) && (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <button
                      type="button"
                      onClick={onToggleSpecPreview}
                      className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-100"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Xem trước thông số kỹ thuật</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {isSpecPreviewLoading
                            ? "Đang đọc dữ liệu từ file cấu hình..."
                            : "Bấm để mở hoặc thu gọn phần xem trước."}
                        </p>
                      </div>
                      <span className="inline-flex size-9 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200">
                        {isSpecPreviewOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </span>
                    </button>

                    {isSpecPreviewOpen && (
                      <div className="border-t border-slate-200 p-4">
                        {isSpecPreviewLoading ? (
                          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
                            Đang tải xem trước thông số kỹ thuật...
                          </div>
                        ) : specPreview ? (
                          renderSpecPreviewContent(specPreview)
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
                            Chưa có dữ liệu để xem trước.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {!formData.specFileName && formData.specs && !specPreview && (
                  <textarea
                    value={formData.specs}
                    readOnly
                    className="mt-3 min-h-[100px] w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 outline-none"
                  />
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Hình ảnh sản phẩm</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    onChange("imageFiles", files);
                  }}
                  disabled={isSubmitting}
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Chọn tối đa 3 hình ảnh trực tiếp từ máy tính.
                </p>
                <p className="mt-1 text-xs font-medium text-slate-600">
                  {formData.imageFiles.length > 0
                    ? `Đã chọn ${formData.imageFiles.length}/3 ảnh mới.`
                    : formData.existingImages.length > 0
                      ? `Hiện đang có ${formData.existingImages.length} ảnh đã lưu.`
                      : "Chưa chọn ảnh nào."}
                </p>
                {formData.imageFiles.length > 0 && (
                  <div className="mt-4 overflow-hidden rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#f1f5f9_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Ảnh đã chọn</p>
                        <p className="mt-1 text-xs text-slate-600">
                          Ảnh được lưu theo đúng thứ tự từ `Ảnh 1` đến `Ảnh 3`. `Ảnh 1` sẽ là ảnh chính ở trang chi tiết sản phẩm.
                        </p>
                      </div>
                      <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {imagePreviews.length}/3 ảnh
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={preview.key}
                          className={`group overflow-hidden rounded-[24px] border bg-white shadow-sm transition ${
                            index === 0
                              ? "border-blue-300 ring-2 ring-blue-100"
                              : "border-slate-200"
                          }`}
                        >
                          <div className="relative">
                            <img
                              src={preview.url}
                              alt={preview.name}
                              className="h-44 w-full bg-slate-100 object-contain p-2"
                            />
                            <div className="absolute left-3 top-3 flex items-center gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm ${
                                  index === 0 ? "bg-blue-600" : "bg-slate-900/80"
                                }`}
                              >
                                Ảnh {index + 1}
                              </span>
                              {index === 0 && (
                                <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
                                  Ảnh chính
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 border-t border-slate-100 px-4 py-3">
                            <p className="truncate text-sm font-semibold text-slate-800" title={preview.name}>
                              {preview.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {index === 0
                                ? "Sẽ hiển thị đầu tiên ở trang chi tiết sản phẩm."
                                : `Hiển thị sau Ảnh ${index}.`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {formData.imageFiles.length === 0 && formData.existingImages.length > 0 && (
                  <div className="mt-4 overflow-hidden rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#f1f5f9_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Ảnh hiện tại</p>
                        <p className="mt-1 text-xs text-slate-600">
                          Đây là các ảnh đang lưu cho sản phẩm. Nếu chọn ảnh mới, danh sách này sẽ được thay bằng ảnh mới.
                        </p>
                      </div>
                      <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {formData.existingImages.length}/3 ảnh
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
                      {formData.existingImages.map((image, index) => (
                        <div
                          key={image.id ?? image.url}
                          className={`overflow-hidden rounded-[24px] border bg-white shadow-sm ${
                            index === 0 ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200"
                          }`}
                        >
                          <div className="relative">
                            <img
                              src={resolveAssetUrl(image.url)}
                              alt=""
                              className="h-44 w-full bg-slate-100 object-contain p-2"
                            />
                            <div className="absolute left-3 top-3 flex items-center gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm ${
                                  index === 0 ? "bg-blue-600" : "bg-slate-900/80"
                                }`}
                              >
                                Ảnh {index + 1}
                              </span>
                              {index === 0 && (
                                <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
                                  Ảnh chính
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 border-t border-slate-100 px-4 py-3">
                            <p className="truncate text-sm font-semibold text-slate-800" title={image.url}>
                              {image.url.split("/").pop()}
                            </p>
                            <p className="text-xs text-slate-500">
                              {index === 0
                                ? "Đang hiển thị đầu tiên ở trang chi tiết sản phẩm."
                                : `Đang hiển thị sau Ảnh ${index}.`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 rounded-2xl px-5"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`h-11 rounded-2xl px-5 ${
                isDelete ? "bg-rose-600 text-white hover:bg-rose-700" : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {isSubmitting ? "Đang xử lý..." : submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [modalError, setModalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [specPreview, setSpecPreview] = useState(null);
  const [isSpecPreviewOpen, setIsSpecPreviewOpen] = useState(false);
  const [isSpecPreviewLoading, setIsSpecPreviewLoading] = useState(false);

  const initialFormData = {
    name: "",
    description: "",
    importPrice: "",
    retailPrice: "",
    brandId: "",
    categoryId: "",
    origin: "",
    warranty: "",
    quantity: "",
    specs: "",
    specFile: null,
    specFileName: "",
    imageFiles: [],
    existingImages: [],
  };
  const [formData, setFormData] = useState(initialFormData);

  const loadData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [prodRes, brandRes, catRes] = await Promise.all([
        api.get("/products"),
        api.get("/brands"),
        api.get("/categories")
      ]);
      setProducts(prodRes.data.data ?? []);
      setBrands(brandRes.data.data ?? []);
      setCategories(catRes.data.data ?? []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không tải được dữ liệu từ database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const previews = formData.imageFiles.map((file) => ({
      key: `${file.name}-${file.lastModified}`,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setImagePreviews(previews);

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [formData.imageFiles]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return products;
    return products.filter((p) => String(p.name ?? "").toLowerCase().includes(normalizedSearch));
  }, [products, searchTerm]);

  const parseStoredSpecs = (value) => {
    if (typeof value !== "string" || !value.trim()) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };

  const handleFormChange = (field, value) => {
    if (field === "imageFiles") {
      if (value.length > 3) {
        setModalError("Chỉ được chọn tối đa 3 hình ảnh.");
        setFormData((prev) => ({ ...prev, imageFiles: value.slice(0, 3) }));
        return;
      }

      setModalError("");
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecFileChange = async (file) => {
    handleFormChange("specFile", file);
    handleFormChange("specFileName", file?.name ?? "");

    if (!file) {
      setSpecPreview(parseStoredSpecs(formData.specs));
      setIsSpecPreviewOpen(false);
      setIsSpecPreviewLoading(false);
      return;
    }

    setIsSpecPreviewLoading(true);
    setIsSpecPreviewOpen(true);

    try {
      const payload = new FormData();
      payload.append("specFile", file);
      const response = await api.post("/products/spec-preview", payload);
      setSpecPreview(response.data.data ?? null);
    } catch (requestError) {
      setSpecPreview(null);
      setModalError(requestError.response?.data?.message || "Không xem trước được file cấu hình.");
    } finally {
      setIsSpecPreviewLoading(false);
    }
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setModalMode(null);
    setSelectedProduct(null);
    setFormData(initialFormData);
    setModalError("");
    setSpecPreview(null);
    setIsSpecPreviewOpen(false);
    setIsSpecPreviewLoading(false);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedProduct(null);
    setFormData(initialFormData);
    setModalError("");
    setSpecPreview(null);
    setIsSpecPreviewOpen(false);
    setIsSpecPreviewLoading(false);
  };

  const openEditModal = (product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setFormData({
      name: product.name ?? "",
      description: product.description ?? "",
      importPrice: product.import_price ?? "",
      retailPrice: product.retail_price ?? "",
      brandId: product.brand_id ?? "",
      categoryId: product.category_id ?? "",
      origin: product.origin ?? "",
      warranty: product.warranty ?? "",
      quantity: product.quantity ?? "",
      specs: product.specs ?? "",
      specFile: null,
      specFileName: "",
      imageFiles: [],
      existingImages: product.images ?? [],
    });
    setModalError("");
    setSpecPreview(parseStoredSpecs(product.specs ?? ""));
    setIsSpecPreviewOpen(false);
    setIsSpecPreviewLoading(false);
  };

  const openDeleteModal = (product) => {
    setModalMode("delete");
    setSelectedProduct(product);
    setFormData({ ...initialFormData, name: product.name });
    setModalError("");
    setSpecPreview(null);
    setIsSpecPreviewOpen(false);
    setIsSpecPreviewLoading(false);
  };

  const openDetailModal = (product) => {
    setDetailProduct(product);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setModalError("");

    if (modalMode !== "delete" && !formData.name.trim()) {
      setModalError("Vui lòng nhập tên sản phẩm.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalMode === "create") {
        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("description", formData.description);
        payload.append("importPrice", String(Number(formData.importPrice)));
        payload.append("retailPrice", String(Number(formData.retailPrice)));
        payload.append("brandId", String(Number(formData.brandId)));
        payload.append("categoryId", String(Number(formData.categoryId)));
        payload.append("origin", formData.origin);
        payload.append("warranty", formData.warranty);
        payload.append("quantity", String(Number(formData.quantity)));

        if (formData.specFile) {
          payload.append("specFile", formData.specFile);
        } else if (formData.specs) {
          payload.append("specs", formData.specs);
        }

        formData.imageFiles.forEach((file) => {
          payload.append("images", file);
        });

        await api.post("/products", payload);
      } else if (modalMode === "edit" && selectedProduct) {
        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("description", formData.description);
        payload.append("importPrice", String(Number(formData.importPrice)));
        payload.append("retailPrice", String(Number(formData.retailPrice)));
        payload.append("brandId", String(Number(formData.brandId)));
        payload.append("categoryId", String(Number(formData.categoryId)));
        payload.append("origin", formData.origin);
        payload.append("warranty", formData.warranty);
        payload.append("quantity", String(Number(formData.quantity)));

        if (formData.specFile) {
          payload.append("specFile", formData.specFile);
        } else if (formData.specs) {
          payload.append("specs", formData.specs);
        }

        formData.imageFiles.forEach((file) => {
          payload.append("images", file);
        });

        if (formData.imageFiles.length === 0 && formData.existingImages.length > 0) {
          payload.append(
            "existingImages",
            JSON.stringify(formData.existingImages.map((image) => image.url))
          );
        }

        await api.put(`/products/${selectedProduct.id}`, payload);
      } else if (modalMode === "delete" && selectedProduct) {
        await api.delete(`/products/${selectedProduct.id}`);
      }

      closeModal();
      await loadData();
    } catch (requestError) {
      setModalError(requestError.response?.data?.message || "Không thể cập nhật dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans flex">
      <AdminSidebar />
      <div className="relative ml-[290px] flex min-h-screen flex-1 flex-col">
        <main className="w-full flex-grow px-7 py-6">
          <section className="rounded-[24px] border border-[#dbe3ef] bg-white px-7 py-6 shadow-[0_10px_35px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-4">
              <h2 className="m-0 text-2xl font-bold tracking-tight text-[#071328]">Trang sản phẩm</h2>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  onClick={openCreateModal}
                  className="h-10 rounded-xl bg-[#2563eb] px-4 text-[0.88rem] font-semibold text-white hover:bg-[#1d4ed8]"
                >
                  <Plus className="mr-1.5 size-4" /> Thêm sản phẩm
                </Button>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="h-10 w-full rounded-xl border border-[#d7e0ec] bg-white pl-11 pr-4 text-[0.88rem] text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 sm:w-[320px]"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-4 text-sm font-medium text-rose-700">
                {error}
              </div>
            )}

            <div className="mt-7 grid gap-5 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <p className="text-[0.85rem] text-slate-500">Tổng sản phẩm</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">{products.length}</p>
              </div>
              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <p className="text-[0.85rem] text-slate-500">Tổng tồn kho</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">
                  {products.reduce((acc, curr) => acc + (curr.quantity || 0), 0)}
                </p>
              </div>
              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <p className="text-[0.85rem] text-slate-500">Hết hàng</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">
                  {products.filter(p => p.quantity <= 0).length}
                </p>
              </div>
            </div>

            <div className="mt-7 overflow-hidden rounded-[22px] border border-[#d7e0ec] bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-white">
                    <tr className="border-b border-[#d7e0ec] text-left text-[0.9rem] font-bold text-slate-900">
                      <th className="px-6 py-4">Sản phẩm</th>
                      <th className="px-6 py-4">Thương hiệu / DM</th>
                      <th className="px-6 py-4">Giá bán</th>
                      <th className="px-6 py-4">Tồn kho</th>
                      <th className="px-6 py-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                          Đang tải dữ liệu...
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                          Chưa có dữ liệu.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => {
                        const brand = brands.find(b => b.brand_id === product.brand_id);
                        const category = categories.find(c => c.id === product.category_id);
                        const image = product.images?.[0]?.url;

                        return (
                          <tr key={product.id} className="text-sm text-slate-700 transition hover:bg-slate-50/70">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {image ? (
                                  <img src={resolveAssetUrl(image)} alt="" className="size-10 rounded-xl object-cover bg-slate-100" />
                                ) : (
                                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#eef3f9] text-slate-500">
                                    <Package className="size-4" />
                                  </div>
                                )}
                                <div className="text-[0.9rem] font-semibold text-slate-950 max-w-[200px] truncate" title={product.name}>
                                  {product.name}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-[0.8rem]">
                                <div className="font-semibold">{brand?.brand_name || "N/A"}</div>
                                <div className="text-slate-500">{category?.name || "N/A"}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-medium text-[#2563eb]">
                              {Number(product.retail_price).toLocaleString('vi-VN')} đ
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex rounded-full px-3 py-1 text-[0.75rem] font-semibold ${
                                product.quantity > 0 ? "bg-[#dffbe8] text-[#13a34b]" : "bg-rose-100 text-rose-700"
                              }`}>
                                {product.quantity}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openDetailModal(product)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-2 text-[0.75rem] font-semibold text-white transition hover:bg-sky-600"
                                >
                                  <Eye className="size-3.5" /> Xem
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openEditModal(product)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#ffc107] px-3 py-2 text-[0.75rem] font-semibold text-white transition hover:bg-[#e9b000]"
                                >
                                  <Pencil className="size-3.5" /> Sửa
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openDeleteModal(product)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#ff0a0a] px-3 py-2 text-[0.75rem] font-semibold text-white transition hover:bg-[#e00000]"
                                >
                                  <Trash2 className="size-3.5" /> Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>

      <ProductModal
        open={modalMode === "create"}
        title="Thêm sản phẩm"
        submitLabel="Tạo sản phẩm"
        formData={formData}
        imagePreviews={imagePreviews}
        specPreview={specPreview}
        isSpecPreviewOpen={isSpecPreviewOpen}
        isSpecPreviewLoading={isSpecPreviewLoading}
        onToggleSpecPreview={() => setIsSpecPreviewOpen((prev) => !prev)}
        onSpecFileChange={handleSpecFileChange}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
        brands={brands}
        categories={categories}
      />

      <ProductModal
        open={modalMode === "edit"}
        title="Sửa sản phẩm"
        submitLabel="Lưu thay đổi"
        formData={formData}
        imagePreviews={imagePreviews}
        specPreview={specPreview}
        isSpecPreviewOpen={isSpecPreviewOpen}
        isSpecPreviewLoading={isSpecPreviewLoading}
        onToggleSpecPreview={() => setIsSpecPreviewOpen((prev) => !prev)}
        onSpecFileChange={handleSpecFileChange}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
        brands={brands}
        categories={categories}
      />

      <ProductModal
        open={modalMode === "delete"}
        title="Xóa sản phẩm"
        submitLabel="Xóa"
        formData={formData}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
      />

      <ProductDetailModal
        open={Boolean(detailProduct)}
        product={detailProduct}
        brands={brands}
        categories={categories}
        onClose={() => setDetailProduct(null)}
      />
    </div>
  );
}

export default AdminProducts;
