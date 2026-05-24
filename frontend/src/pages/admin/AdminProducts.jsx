import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ProductDetailModal } from "@/components/admin/product/ProductDetailModal";
import { ProductModal } from "@/components/admin/product/ProductModal";
import { ProductRow } from "@/components/admin/product/ProductRow";
import {
  createImageSlotFromExisting,
  fillImageSlots,
  getImageDisplayName,
  normalizeExistingImage,
  parseStoredSpecs,
  resolveAssetUrl,
} from "@/components/admin/product/productUtils";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

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
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [specPreview, setSpecPreview] = useState(null);
  const [isSpecPreviewOpen, setIsSpecPreviewOpen] = useState(false);
  const [isSpecPreviewLoading, setIsSpecPreviewLoading] = useState(false);
  const [isProductModalLoading, setIsProductModalLoading] = useState(false);

  const initialFormData = {
    name: "",
    description: "",
    importPrice: "",
    retailPrice: "",
    isOnSale: false,
    saleId: "",
    saleType: "percentage",
    saleValue: "",
    saleDuration: "",
    brandId: "",
    categoryId: "",
    origin: "",
    warranty: "",
    quantity: "",
    specs: "",
    specFile: null,
    specFileName: "",
    imageSlots: [],
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
    const previews = formData.imageSlots.map((slot, index) => {
      if (!slot) {
        return {
          key: `empty-${index}`,
          name: `Vị trí ảnh ${index + 1}`,
          url: "",
          kind: "empty",
        };
      }

      if (slot.kind === "existing") {
        const existingImage = normalizeExistingImage(slot.image);

        if (!existingImage?.url) {
          return {
            key: `empty-${index}`,
            name: `Vị trí ảnh ${index + 1}`,
            url: "",
            kind: "empty",
          };
        }

        return {
          key: `existing-${existingImage.id ?? existingImage.url}-${index}`,
          name: getImageDisplayName(existingImage.url, `Ảnh ${index + 1}`),
          url: resolveAssetUrl(existingImage.url),
          kind: "existing",
        };
      }

      return {
        key: `upload-${slot.file.name}-${slot.file.lastModified}-${index}`,
        name: slot.file.name,
        url: URL.createObjectURL(slot.file),
        kind: "upload",
      };
    });

    setImagePreviews(previews);

    return () => {
      previews.forEach((preview) => {
        if (preview.kind === "upload") {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [formData.imageSlots]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchingProducts = !normalizedSearch
      ? products
      : products.filter((p) => String(p.name ?? "").toLowerCase().includes(normalizedSearch));

    return [...matchingProducts].sort((leftProduct, rightProduct) => {
      const leftSaleRank = leftProduct.sale_id ? 0 : 1;
      const rightSaleRank = rightProduct.sale_id ? 0 : 1;

      if (leftSaleRank !== rightSaleRank) {
        return leftSaleRank - rightSaleRank;
      }

      return String(leftProduct.name ?? "").localeCompare(String(rightProduct.name ?? ""), "vi");
    });
  }, [products, searchTerm]);

  const groupedProducts = useMemo(() => ({
    onSale: filteredProducts.filter((product) => Boolean(product.sale_id)),
    regular: filteredProducts.filter((product) => !product.sale_id),
  }), [filteredProducts]);

  const normalizePriceInputValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return String(value);
    }

    return String(numericValue);
  };

  const normalizeTextInputValue = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value);
  };

  const normalizeSpecsInputValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  const serializeSpecsValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  const validateProductForm = (data = formData) => {
    const errors = {};
    const trimmedName = normalizeTextInputValue(data.name).trim();
    const trimmedOrigin = normalizeTextInputValue(data.origin).trim();
    const trimmedWarranty = normalizeTextInputValue(data.warranty).trim();
    const importPrice = Number(data.importPrice);
    const retailPrice = Number(data.retailPrice);
    const quantity = Number(data.quantity);
    const hasImages = data.imageSlots.some(Boolean);

    if (!trimmedName) {
      errors.name = "Vui lòng nhập tên sản phẩm.";
    }

    if (!Number.isFinite(importPrice) || importPrice <= 0) {
      errors.importPrice = "Giá nhập phải là số lớn hơn 0.";
    }

    if (!Number.isFinite(retailPrice) || retailPrice <= 0) {
      errors.retailPrice = "Giá bán phải là số lớn hơn 0.";
    }

    if (
      Number.isFinite(importPrice) &&
      importPrice > 0 &&
      Number.isFinite(retailPrice) &&
      retailPrice > 0 &&
      retailPrice <= importPrice
    ) {
      errors.importPrice = "Giá nhập phải nhỏ hơn giá bán.";
      errors.retailPrice = "Giá bán phải lớn hơn giá nhập.";
    }

    if (!data.brandId) {
      errors.brandId = "Vui lòng chọn thương hiệu.";
    }

    if (!data.categoryId) {
      errors.categoryId = "Vui lòng chọn danh mục.";
    }

    if (!trimmedOrigin) {
      errors.origin = "Vui lòng nhập xuất xứ sản phẩm.";
    } else if (!/\p{L}/u.test(trimmedOrigin) || /\d/.test(trimmedOrigin)) {
      errors.origin = "Xuất xứ chỉ được nhập bằng chữ, không được chứa số.";
    }

    if (!trimmedWarranty) {
      errors.warranty = "Vui lòng nhập thông tin bảo hành.";
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      errors.quantity = "Số lượng phải là số nguyên từ 0 trở lên.";
    }

    if (modalMode === "create" && !hasImages) {
      errors.imageSlots = "Vui lòng chọn ít nhất 1 ảnh sản phẩm.";
    }

    if (data.isOnSale) {
      const saleValue = Number(data.saleValue);
      const saleDuration = Number(data.saleDuration);

      if (!Number.isFinite(saleValue) || saleValue <= 0) {
        errors.saleValue = "Vui lòng nhập mức giảm giá lớn hơn 0.";
      }

      if (data.saleType === "percentage" && saleValue > 100) {
        errors.saleValue = "Giảm theo % không được lớn hơn 100.";
      }

      if (data.saleType === "fixed" && saleValue >= retailPrice) {
        errors.saleValue = "Giảm trực tiếp phải nhỏ hơn giá bán.";
      }

      if (!Number.isInteger(saleDuration) || saleDuration < 1) {
        errors.saleDuration = "Thời lượng sale phải là số nguyên từ 1 ngày trở lên.";
      }
    }

    return errors;
  };

  const filterErrorsForTouchedFields = (errors, touched) => {
    const nextErrors = {};

    Object.entries(errors).forEach(([field, message]) => {
      if (touched[field]) {
        nextErrors[field] = message;
      }
    });

    if ((touched.importPrice || touched.retailPrice) && (errors.importPrice || errors.retailPrice)) {
      if (errors.importPrice) {
        nextErrors.importPrice = errors.importPrice;
      }

      if (errors.retailPrice) {
        nextErrors.retailPrice = errors.retailPrice;
      }
    }

    if ((touched.saleValue || touched.saleType) && errors.saleValue) {
      nextErrors.saleValue = errors.saleValue;
    }

    if (touched.saleDuration && errors.saleDuration) {
      nextErrors.saleDuration = errors.saleDuration;
    }

    if (touched.imageSlots && errors.imageSlots) {
      nextErrors.imageSlots = errors.imageSlots;
    }

    return nextErrors;
  };

  const runLiveValidation = (nextFormData, nextTouchedFields) => {
    const nextErrors = validateProductForm(nextFormData);
    setValidationErrors(filterErrorsForTouchedFields(nextErrors, nextTouchedFields));
  };

  const handleFormChange = (field, value) => {
    if (field === "imageFiles") {
      setModalError("");
      const nextFormData = {
        ...formData,
        imageSlots: fillImageSlots(formData.imageSlots, value),
      };
      const nextTouchedFields = { ...touchedFields, imageSlots: true };
      setFormData(nextFormData);
      setTouchedFields(nextTouchedFields);
      runLiveValidation(nextFormData, nextTouchedFields);
      return;
    }

    if (field === "removeImageAtIndex") {
      setModalError("");
      const nextFormData = {
        ...formData,
        imageSlots: formData.imageSlots.map((slot, index) => (index === value ? null : slot)),
      };
      const nextTouchedFields = { ...touchedFields, imageSlots: true };
      setFormData(nextFormData);
      setTouchedFields(nextTouchedFields);
      runLiveValidation(nextFormData, nextTouchedFields);
      return;
    }

    if (field === "isOnSale") {
      setModalError("");
      const nextFormData = {
        ...formData,
        isOnSale: value,
        saleType: value ? formData.saleType || "percentage" : "percentage",
        saleValue: value ? formData.saleValue : "",
        saleDuration: value ? formData.saleDuration || "7" : "",
      };
      const nextTouchedFields = {
        ...touchedFields,
        saleValue: true,
        saleDuration: true,
        saleType: true,
      };
      setFormData(nextFormData);
      setTouchedFields(nextTouchedFields);
      runLiveValidation(nextFormData, nextTouchedFields);
      return;
    }

    const nextFormData = { ...formData, [field]: value };
    const nextTouchedFields = { ...touchedFields, [field]: true };
    setFormData(nextFormData);
    setTouchedFields(nextTouchedFields);
    runLiveValidation(nextFormData, nextTouchedFields);
  };

  const handleSpecFileChange = async (file) => {
    setModalError("");

    if (!file) {
      setFormData((prev) => ({
        ...prev,
        specFile: null,
        specFileName: "",
      }));
      setSpecPreview(parseStoredSpecs(formData.specs));
      setIsSpecPreviewOpen(false);
      setIsSpecPreviewLoading(false);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      specFile: file,
      specFileName: file.name ?? "",
    }));

    setIsSpecPreviewLoading(true);
    setIsSpecPreviewOpen(true);

    try {
      const payload = new FormData();
      payload.append("specFile", file);
      const response = await api.post("/products/spec-preview", payload);
      const previewData = response.data.data;

      if (
        previewData === null ||
        previewData === undefined ||
        (Array.isArray(previewData) && previewData.length === 0)
      ) {
        setSpecPreview(null);
        setModalError("File cấu hình đã được tải lên nhưng không đọc được dữ liệu xem trước.");
        return;
      }

      setModalError("");
      setFormData((prev) => ({
        ...prev,
        specs: serializeSpecsValue(previewData),
      }));
      setSpecPreview(previewData);
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
    setValidationErrors({});
    setTouchedFields({});
    setSpecPreview(null);
    setIsSpecPreviewOpen(false);
    setIsSpecPreviewLoading(false);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedProduct(null);
    setFormData(initialFormData);
    setModalError("");
    setValidationErrors({});
    setTouchedFields({});
    setSpecPreview(null);
    setIsSpecPreviewOpen(false);
    setIsSpecPreviewLoading(false);
  };

  const hydrateEditForm = (product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setFormData({
      name: normalizeTextInputValue(product.name),
      description: normalizeTextInputValue(product.description),
      importPrice: normalizePriceInputValue(product.import_price),
      retailPrice: normalizePriceInputValue(product.retail_price),
      isOnSale: Boolean(product.sale_id),
      saleId: product.sale_id ?? "",
      saleType: product.sale_type ?? "percentage",
      saleValue: product.sale_value ?? "",
      saleDuration: product.sale_duration ? String(product.sale_duration) : "",
      brandId: product.brand_id ?? "",
      categoryId: product.category_id ?? "",
      origin: normalizeTextInputValue(product.origin),
      warranty: normalizeTextInputValue(product.warranty),
      quantity: product.quantity ?? "",
      specs: normalizeSpecsInputValue(product.specs),
      specFile: null,
      specFileName: "",
      imageSlots: (product.images ?? [])
        .map(createImageSlotFromExisting)
        .filter((slot) => Boolean(slot?.image?.url)),
    });
    setModalError("");
    setValidationErrors({});
    setTouchedFields({});
    setSpecPreview(parseStoredSpecs(product.specs ?? ""));
    setIsSpecPreviewOpen(Boolean(product.specs));
    setIsSpecPreviewLoading(false);
  };

  const fetchProductDetails = async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data?.data ?? null;
  };

  const openEditModal = async (product) => {
    setModalError("");
    setIsProductModalLoading(true);

    try {
      const detailedProduct = await fetchProductDetails(product.id);
      hydrateEditForm(detailedProduct ?? product);
    } catch (requestError) {
      setModalError(requestError.response?.data?.message || "Không tải được chi tiết sản phẩm.");
      hydrateEditForm(product);
    } finally {
      setIsProductModalLoading(false);
    }
  };

  const openDeleteModal = (product) => {
    setModalMode("delete");
    setSelectedProduct(product);
    setFormData({ ...initialFormData, name: product.name });
    setModalError("");
    setValidationErrors({});
    setTouchedFields({});
    setSpecPreview(null);
    setIsSpecPreviewOpen(false);
    setIsSpecPreviewLoading(false);
  };

  const openDetailModal = async (product) => {
    setError("");

    try {
      const detailedProduct = await fetchProductDetails(product.id);
      setDetailProduct(detailedProduct ?? product);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không tải được chi tiết sản phẩm.");
      setDetailProduct(product);
    }
  };

  const appendProductPayloadBase = (payload, saleId, options = {}) => {
    const { includeSpecs = true, specsValue = formData.specs } = options;

    payload.append("name", normalizeTextInputValue(formData.name).trim());
    payload.append("description", normalizeTextInputValue(formData.description).trim());
    payload.append("importPrice", String(Number(formData.importPrice)));
    payload.append("retailPrice", String(Number(formData.retailPrice)));
    payload.append("saleId", saleId ? String(saleId) : "");
    payload.append("brandId", String(Number(formData.brandId)));
    payload.append("categoryId", String(Number(formData.categoryId)));
    payload.append("origin", normalizeTextInputValue(formData.origin).trim());
    payload.append("warranty", normalizeTextInputValue(formData.warranty).trim());
    payload.append("quantity", String(Number(formData.quantity)));

    if (formData.specFile) {
      payload.append("specFile", formData.specFile);
    }

    if (includeSpecs && specsValue) {
      payload.append("specs", specsValue);
    }
  };

  const fetchSpecPreviewData = async (file) => {
    const payload = new FormData();
    payload.append("specFile", file);
    const response = await api.post("/products/spec-preview", payload);
    return response.data?.data ?? null;
  };

  const resolveSpecsForSubmit = async () => {
    if (!formData.specFile) {
      return serializeSpecsValue(formData.specs);
    }

    const previewData = await fetchSpecPreviewData(formData.specFile);
    const serializedSpecs = serializeSpecsValue(previewData);

    setSpecPreview(previewData);
    setFormData((prev) => ({
      ...prev,
      specs: serializedSpecs,
    }));

    return serializedSpecs;
  };

  const appendImageSlotsToPayload = (payload) => {
    const activeSlots = formData.imageSlots.filter(Boolean);
    const imageSlotsPayload = [];
    const existingImageUrls = [];
    let uploadIndex = 0;

    activeSlots.forEach((slot) => {
      if (slot.kind === "existing") {
        existingImageUrls.push(slot.image.url);
        imageSlotsPayload.push({
          type: "existing",
          url: slot.image.url,
        });
        return;
      }

      payload.append("images", slot.file);
      imageSlotsPayload.push({
        type: "upload",
        uploadIndex,
      });
      uploadIndex += 1;
    });

    payload.append("existingImages", JSON.stringify(existingImageUrls));
    payload.append("imageSlots", JSON.stringify(imageSlotsPayload));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setModalError("");

    if (modalMode !== "delete") {
      const nextValidationErrors = validateProductForm();
      const nextTouchedFields = {
        name: true,
        importPrice: true,
        retailPrice: true,
        brandId: true,
        categoryId: true,
        origin: true,
        warranty: true,
        quantity: true,
        saleType: true,
        saleValue: true,
        saleDuration: true,
        imageSlots: true,
      };
      setTouchedFields(nextTouchedFields);
      setValidationErrors(nextValidationErrors);

      if (Object.keys(nextValidationErrors).length > 0) {
        setModalError("Vui lòng kiểm tra lại các trường đang báo lỗi.");
        const [firstInvalidField] = Object.keys(nextValidationErrors);

        requestAnimationFrame(() => {
          const target = document.querySelector(`[name="${firstInvalidField}"]`);

          if (target instanceof HTMLElement) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
            target.focus();
          }
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let resolvedSaleId = null;
      let resolvedSpecsValue = serializeSpecsValue(formData.specs);

      if (modalMode !== "delete" && formData.isOnSale) {
        const salePayload = {
          saleType: formData.saleType,
          saleValue: Number(formData.saleValue),
          saleDuration: Number(formData.saleDuration || 7),
        };

        if (formData.saleId) {
          await api.put(`/sale-events/${formData.saleId}`, salePayload);
          resolvedSaleId = formData.saleId;
        } else {
          const saleResponse = await api.post("/sale-events", salePayload);
          resolvedSaleId = saleResponse.data.saleId;
        }
      }

      if (modalMode !== "delete" && formData.specFile) {
        resolvedSpecsValue = await resolveSpecsForSubmit();
      }

      if (modalMode === "create") {
        const payload = new FormData();
        appendProductPayloadBase(payload, resolvedSaleId, {
          specsValue: resolvedSpecsValue,
        });
        appendImageSlotsToPayload(payload);

        await api.post("/products", payload);
      } else if (modalMode === "edit" && selectedProduct) {
        const payload = new FormData();
        appendProductPayloadBase(payload, resolvedSaleId, {
          includeSpecs: Boolean(formData.specFile),
          specsValue: resolvedSpecsValue,
        });
        appendImageSlotsToPayload(payload);

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
              <div className="grid grid-cols-[minmax(0,2.2fr)_minmax(120px,1fr)_minmax(120px,0.9fr)_minmax(140px,0.9fr)_90px_132px] gap-4 border-b border-[#d7e0ec] px-4 py-4 text-left text-[0.9rem] font-bold text-slate-900">
                <div>Sản phẩm</div>
                <div>Phân loại</div>
                <div>Sale</div>
                <div>Giá</div>
                <div>Kho</div>
                <div className="text-right">Hành động</div>
              </div>

              {isLoading ? (
                <div className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                  Đang tải dữ liệu...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                  Chưa có dữ liệu.
                </div>
              ) : (
                <div className="space-y-6 px-4 py-5">
                  <div className="overflow-hidden rounded-[20px] border border-amber-200 bg-[linear-gradient(180deg,#fffaf2_0%,#fff6ea_100%)]">
                    <div className="flex items-center justify-between border-b border-amber-200 px-5 py-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-950">Đang sale</h3>
                        
                      </div>
                      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                        {groupedProducts.onSale.length} sản phẩm
                      </span>
                    </div>
                    {groupedProducts.onSale.length === 0 ? (
                      <div className="px-5 py-8 text-center text-sm font-medium text-slate-500">
                        Chưa có sản phẩm nào đang sale.
                      </div>
                    ) : (
                      groupedProducts.onSale.map((product) => (
                        <ProductRow
                          key={product.id}
                          product={product}
                          brands={brands}
                          categories={categories}
                          onView={openDetailModal}
                          onEdit={openEditModal}
                          onDelete={openDeleteModal}
                        />
                      ))
                    )}
                  </div>

                  <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-950">Không sale</h3>
                        
                      </div>
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {groupedProducts.regular.length} sản phẩm
                      </span>
                    </div>
                    {groupedProducts.regular.length === 0 ? (
                      <div className="px-5 py-8 text-center text-sm font-medium text-slate-500">
                        Không có sản phẩm giá thường.
                      </div>
                    ) : (
                      groupedProducts.regular.map((product) => (
                        <ProductRow
                          key={product.id}
                          product={product}
                          brands={brands}
                          categories={categories}
                          onView={openDetailModal}
                          onEdit={openEditModal}
                          onDelete={openDeleteModal}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}
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
        validationErrors={validationErrors}
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
        isSubmitting={isSubmitting || isProductModalLoading}
        error={modalError}
        validationErrors={validationErrors}
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
        validationErrors={validationErrors}
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
