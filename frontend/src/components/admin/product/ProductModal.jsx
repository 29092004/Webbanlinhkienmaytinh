import { BadgePercent, ChevronDown, ChevronUp, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { calculateDiscountedPrice, formatSalePercentage, renderSpecPreviewContent } from "./productUtils";

export function ProductModal({
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
  validationErrors = {},
  isDelete = false,
  brands = [],
  categories = [],
}) {
  if (!open) return null;

  const totalSelectedImages = formData.imageSlots.filter(Boolean).length;
  const hasSpecPreview =
    specPreview !== null &&
    specPreview !== undefined &&
    !(typeof specPreview === "string" && !specPreview.trim()) &&
    !(Array.isArray(specPreview) && specPreview.length === 0) &&
    !(typeof specPreview === "object" && !Array.isArray(specPreview) && Object.keys(specPreview).length === 0);
  const salePreview = calculateDiscountedPrice({
    retailPrice: formData.retailPrice,
    saleType: formData.saleType,
    saleValue: formData.saleValue,
    isOnSale: formData.isOnSale,
  });

  const getFieldClassName = (fieldName, baseClassName) =>
    `${baseClassName} ${validationErrors[fieldName] ? "border-rose-300 bg-rose-50/60 focus:border-rose-300 focus:ring-4 focus:ring-rose-100" : ""}`;

  const renderFieldError = (fieldName) =>
    validationErrors[fieldName] ? (
      <p className="mt-2 text-xs font-medium text-rose-600">{validationErrors[fieldName]}</p>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
        <div className="mb-5 flex items-start justify-between gap-4">
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
              Bạn có chắc muốn xóa sản phẩm <span className="font-bold text-slate-900">{formData.name}</span> không?
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tên sản phẩm</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  disabled={isSubmitting}
                  className={getFieldClassName("name", "h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100")}
                  required
                />
                {renderFieldError("name")}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Giá nhập</label>
                  <input
                    name="importPrice"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.importPrice}
                    onChange={(e) => onChange("importPrice", e.target.value)}
                    disabled={isSubmitting}
                    className={getFieldClassName("importPrice", "h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100")}
                    required
                  />
                  {renderFieldError("importPrice")}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Giá bán</label>
                  <input
                    name="retailPrice"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.retailPrice}
                    onChange={(e) => onChange("retailPrice", e.target.value)}
                    disabled={isSubmitting}
                    className={getFieldClassName("retailPrice", "h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100")}
                    required
                  />
                  {renderFieldError("retailPrice")}
                </div>
              </div>

              <div className={`overflow-hidden rounded-[26px] border ${
                formData.isOnSale
                  ? "border-amber-200 bg-[linear-gradient(180deg,#fff8ec_0%,#fff2df_100%)]"
                  : "border-slate-200 bg-[linear-gradient(180deg,#fbfcfe_0%,#f5f7fb_100%)]"
              }`}>
                <div className={`flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between ${
                  formData.isOnSale ? "border-amber-200" : "border-slate-200"
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`inline-flex size-11 items-center justify-center rounded-2xl ${
                        formData.isOnSale ? "bg-amber-500 text-white" : "bg-slate-900 text-white"
                      }`}>
                        <BadgePercent className="size-5" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-950">Khuyến mãi sản phẩm</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onChange("isOnSale", !formData.isOnSale)}
                    disabled={isSubmitting}
                    className={`inline-flex min-w-[144px] items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition ${
                      formData.isOnSale
                        ? "bg-amber-500 text-white shadow-[0_12px_24px_rgba(245,158,11,0.28)] hover:bg-amber-600"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <BadgePercent className="mr-2 size-4" />
                    {formData.isOnSale ? "Đang sale" : "Không sale"}
                  </button>
                </div>

                {formData.isOnSale ? (
                  <div className="space-y-5 p-5">
                    <div className="grid gap-4 lg:grid-cols-3">
                      <div className="rounded-[22px] border border-amber-200 bg-white p-4 shadow-sm">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Kiểu giảm giá</label>
                        <select
                          name="saleType"
                          value={formData.saleType}
                          onChange={(e) => onChange("saleType", e.target.value)}
                          disabled={isSubmitting}
                          className="h-11 w-full rounded-2xl border border-amber-200 bg-amber-50/40 px-4 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
                        >
                          <option value="percentage">Giảm theo %</option>
                          <option value="fixed">Giảm trực tiếp</option>
                        </select>
                      </div>

                      <div className="rounded-[22px] border border-amber-200 bg-white p-4 shadow-sm">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Mức giảm giá</label>
                        <input
                          name="saleValue"
                          type="number"
                          min="0"
                          step={formData.saleType === "fixed" ? "1000" : "1"}
                          value={formData.saleValue}
                          onChange={(e) => onChange("saleValue", e.target.value)}
                          disabled={isSubmitting}
                          placeholder={formData.saleType === "fixed" ? "Ví dụ: 500000" : "Ví dụ: 10"}
                          className={getFieldClassName("saleValue", "h-11 w-full rounded-2xl border border-amber-200 bg-amber-50/40 px-4 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100")}
                          required={formData.isOnSale}
                        />
                        {renderFieldError("saleValue")}
                        {Number(formData.saleValue) > 0 ? (
                          <p className="mt-3 text-xs font-semibold text-amber-700">
                            {formData.saleType === "fixed"
                              ? `Giảm ${Number(formData.saleValue || 0).toLocaleString("vi-VN")} đ`
                              : `Giảm ${formatSalePercentage(formData.saleValue)}`}
                          </p>
                        ) : null}
                      </div>

                      <div className="rounded-[22px] border border-amber-200 bg-white p-4 shadow-sm">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Thời lượng sale (ngày)</label>
                        <input
                          name="saleDuration"
                          type="number"
                          min="1"
                          step="1"
                          value={formData.saleDuration}
                          onChange={(e) => onChange("saleDuration", e.target.value)}
                          disabled={isSubmitting}
                          placeholder="Ví dụ: 7"
                          className={getFieldClassName("saleDuration", "h-11 w-full rounded-2xl border border-amber-200 bg-amber-50/40 px-4 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100")}
                          required={formData.isOnSale}
                        />
                        {renderFieldError("saleDuration")}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-amber-200 bg-white p-5 shadow-sm">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-lg font-bold text-slate-950">Xem trước giá sau giảm</p>
                        </div>
                        {Number(formData.saleValue) > 0 ? (
                          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
                            {formData.saleType === "fixed"
                              ? `-${Number(formData.saleValue || 0).toLocaleString("vi-VN")} đ`
                              : `-${formatSalePercentage(formData.saleValue)}`}
                          </span>
                        ) : null}
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-[22px] bg-slate-50 px-5 py-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Giá gốc</div>
                          <div className="mt-3 whitespace-nowrap text-lg font-extrabold text-slate-900 lg:text-[1.45rem]">
                            {salePreview.basePrice.toLocaleString("vi-VN")} đ
                          </div>
                        </div>
                        <div className="rounded-[22px] bg-rose-50 px-5 py-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">Mức giảm</div>
                          <div className="mt-3 whitespace-nowrap text-lg font-extrabold text-rose-600 lg:text-[1.45rem]">
                            {salePreview.discountAmount.toLocaleString("vi-VN")} đ
                          </div>
                        </div>
                        <div className="rounded-[22px] bg-emerald-50 px-5 py-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Giá sau giảm</div>
                          <div className="mt-3 whitespace-nowrap text-lg font-extrabold text-emerald-600 lg:text-[1.45rem]">
                            {salePreview.finalPrice.toLocaleString("vi-VN")} đ
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,0.4fr)]">
                    <div className="w-full rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 inline-flex size-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                          <BadgePercent className="size-4" />
                        </div>
                        <div className="w-full max-w-[820px]">
                          <p className="text-base font-bold text-slate-950">Sản phẩm chưa chạy chương trình giảm giá</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Thương hiệu</label>
                  <select
                    name="brandId"
                    value={formData.brandId}
                    onChange={(e) => onChange("brandId", e.target.value)}
                    disabled={isSubmitting}
                    className={getFieldClassName("brandId", "h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100")}
                    required
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
                    ))}
                  </select>
                  {renderFieldError("brandId")}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Danh mục</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={(e) => onChange("categoryId", e.target.value)}
                    disabled={isSubmitting}
                    className={getFieldClassName("categoryId", "h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100")}
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {renderFieldError("categoryId")}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Xuất xứ</label>
                  <input
                    name="origin"
                    type="text"
                    value={formData.origin}
                    onChange={(e) => onChange("origin", e.target.value)}
                    disabled={isSubmitting}
                    className={getFieldClassName("origin", "h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100")}
                  />
                  {renderFieldError("origin")}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Bảo hành</label>
                  <input
                    name="warranty"
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => onChange("warranty", e.target.value)}
                    disabled={isSubmitting}
                    className={getFieldClassName("warranty", "h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100")}
                  />
                  {renderFieldError("warranty")}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Số lượng</label>
                  <input
                    name="quantity"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.quantity}
                    onChange={(e) => onChange("quantity", e.target.value)}
                    disabled={isSubmitting}
                    className={getFieldClassName("quantity", "h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100")}
                    required
                  />
                  {renderFieldError("quantity")}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => onChange("description", e.target.value)}
                  disabled={isSubmitting}
                  className="min-h-[100px] w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">File cấu hình (.xlsx, .xls, .json)</label>
                <input
                  name="specFile"
                  type="file"
                  accept=".xlsx,.xls,.json,application/json,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={(e) => onSpecFileChange(e.target.files?.[0] ?? null)}
                  disabled={isSubmitting}
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <p className="mt-2 text-xs text-slate-500">
                  {formData.specFileName ? `Đã chọn: ${formData.specFileName}` : "Chọn file cấu hình từ máy tính ở định dạng Excel hoặc JSON."}
                </p>
                {(formData.specFileName || hasSpecPreview) && (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <button
                      type="button"
                      onClick={onToggleSpecPreview}
                      className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-100"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Xem trước thông số kỹ thuật</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {isSpecPreviewLoading ? "Đang đọc dữ liệu từ file cấu hình..." : "Bấm để mở hoặc thu gọn phần xem trước."}
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
                        ) : hasSpecPreview ? (
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
                {!formData.specFileName && formData.specs && !hasSpecPreview && (
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
                  name="imageSlots"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    onChange("imageFiles", files);
                    e.target.value = "";
                  }}
                  disabled={isSubmitting}
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                {renderFieldError("imageSlots")}

                {formData.imageSlots.some(Boolean) && (
                  <div className="mt-4 overflow-hidden rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#f1f5f9_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Thứ tự ảnh sản phẩm</p>
                      </div>
                      <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {totalSelectedImages} ảnh
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={preview.key}
                          className={`group overflow-hidden rounded-[24px] border bg-white shadow-sm transition ${
                            index === 0 && preview.kind !== "empty" ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200"
                          }`}
                        >
                          {preview.kind === "empty" ? (
                            <div className="flex h-44 flex-col items-center justify-center gap-3 bg-slate-50 p-4 text-center">
                              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">Ảnh {index + 1}</span>
                              <div className="text-sm font-semibold text-slate-500">Vị trí đang trống</div>
                              <div className="text-xs text-slate-400">Ảnh bạn chọn tiếp theo sẽ vào ô này trước.</div>
                            </div>
                          ) : (
                            <div className="relative">
                              <img
                                src={preview.url}
                                alt={preview.name}
                                className="h-44 w-full bg-slate-100 object-contain p-2"
                              />
                              <div className="absolute left-3 top-3 flex items-center gap-2">
                                <span className={`rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm ${
                                  index === 0 ? "bg-blue-600" : "bg-slate-900/80"
                                }`}>
                                  Ảnh {index + 1}
                                </span>
                                {index === 0 && (
                                  <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
                                    Ảnh chính
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => onChange("removeImageAtIndex", index)}
                                className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-sm transition hover:bg-white hover:text-rose-600"
                                aria-label={`Xóa Ảnh ${index + 1}`}
                              >
                                <X className="size-4" />
                              </button>
                            </div>
                          )}

                          <div className="space-y-2 border-t border-slate-100 px-4 py-3">
                            <p className="truncate text-sm font-semibold text-slate-800" title={preview.name}>
                              {preview.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {preview.kind === "empty"
                                ? "Ô trống chờ ảnh mới."
                                : preview.kind === "existing"
                                  ? "Ảnh đang có của sản phẩm."
                                  : "Ảnh mới vừa chọn từ máy tính."}
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
