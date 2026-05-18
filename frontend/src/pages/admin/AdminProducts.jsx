import { Pencil, Plus, Search, Trash2, X, Package, Box, DollarSign } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

function ProductModal({
  open,
  title,
  submitLabel,
  formData,
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
                <label className="mb-2 block text-sm font-semibold text-slate-700">Cấu hình chi tiết</label>
                <textarea
                  value={formData.specs}
                  onChange={(e) => onChange("specs", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 min-h-[100px]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Hình ảnh (URL, cách nhau bởi dấu phẩy)</label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => onChange("images", e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
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
  const [modalError, setModalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    images: "",
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

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return products;
    return products.filter((p) => String(p.name ?? "").toLowerCase().includes(normalizedSearch));
  }, [products, searchTerm]);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setModalMode(null);
    setSelectedProduct(null);
    setFormData(initialFormData);
    setModalError("");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedProduct(null);
    setFormData(initialFormData);
    setModalError("");
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
      images: (product.images || []).map(img => img.url).join(","),
    });
    setModalError("");
  };

  const openDeleteModal = (product) => {
    setModalMode("delete");
    setSelectedProduct(product);
    setFormData({ name: product.name });
    setModalError("");
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
      const payload = {
        name: formData.name,
        description: formData.description,
        importPrice: Number(formData.importPrice),
        retailPrice: Number(formData.retailPrice),
        brandId: Number(formData.brandId),
        categoryId: Number(formData.categoryId),
        origin: formData.origin,
        warranty: formData.warranty,
        quantity: Number(formData.quantity),
        specs: formData.specs,
        images: formData.images.split(",").map(url => url.trim()).filter(url => url)
      };

      if (modalMode === "create") {
        await api.post("/products", payload);
      } else if (modalMode === "edit" && selectedProduct) {
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
                                  <img src={image} alt="" className="size-10 rounded-xl object-cover bg-slate-100" />
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
    </div>
  );
}

export default AdminProducts;
