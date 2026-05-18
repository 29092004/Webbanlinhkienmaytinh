import { Pencil, Plus, Search, Layers, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

function CategoryModal({
  open,
  title,
  submitLabel,
  value,
  onChange,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  isDelete = false,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-4" />
          </button>
        </div>

        <form className="mt-5" onSubmit={onSubmit}>
          {isDelete ? (
            <p className="text-sm leading-7 text-slate-600">
              Bạn có chắc muốn xóa danh mục{" "}
              <span className="font-bold text-slate-900">{value}</span> không?
            </p>
          ) : (
            <div>
              <label
                htmlFor="category-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Tên danh mục
              </label>
              <input
                id="category-name"
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={isSubmitting}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder="Nhập tên danh mục"
              />
            </div>
          )}

          {error ? (
            <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>
          ) : null}

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
                isDelete
                  ? "bg-rose-600 text-white hover:bg-rose-700"
                  : "bg-slate-900 text-white hover:bg-slate-800"
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

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [modalError, setModalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCategories = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.get("/categories");
      setCategories(data.data ?? []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Không tải được dữ liệu danh mục từ database."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return categories;
    }

    return categories.filter((category) =>
      String(category.name ?? "")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [categories, searchTerm]);

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setModalMode(null);
    setSelectedCategory(null);
    setCategoryName("");
    setModalError("");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedCategory(null);
    setCategoryName("");
    setModalError("");
  };

  const openEditModal = (category) => {
    setModalMode("edit");
    setSelectedCategory(category);
    setCategoryName(category.name ?? "");
    setModalError("");
  };

  const openDeleteModal = (category) => {
    setModalMode("delete");
    setSelectedCategory(category);
    setCategoryName(category.name ?? "");
    setModalError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setModalError("");

    if (modalMode !== "delete" && !categoryName.trim()) {
      setModalError("Vui lòng nhập tên danh mục.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (modalMode === "create") {
        await api.post("/categories", { name: categoryName.trim() });
      }

      if (modalMode === "edit" && selectedCategory) {
        await api.put(`/categories/${selectedCategory.id}`, {
          name: categoryName.trim(),
        });
      }

      if (modalMode === "delete" && selectedCategory) {
        await api.delete(`/categories/${selectedCategory.id}`);
      }

      closeModal();
      await loadCategories();
    } catch (requestError) {
      setModalError(
        requestError.response?.data?.message ||
          "Không thể cập nhật dữ liệu danh mục."
      );
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
              <h2 className="m-0 text-2xl font-bold tracking-tight text-[#071328]">
                Trang danh mục
              </h2>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  onClick={openCreateModal}
                  className="h-10 rounded-xl bg-[#2563eb] px-4 text-[0.88rem] font-semibold text-white hover:bg-[#1d4ed8]"
                >
                  <Plus className="mr-1.5 size-4" />
                  Thêm danh mục
                </Button>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Tìm kiếm..."
                    className="h-10 w-full rounded-xl border border-[#d7e0ec] bg-white pl-11 pr-4 text-[0.88rem] text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 sm:w-[320px]"
                  />
                </div>
              </div>
            </div>

            {error ? (
              <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-4 text-sm font-medium text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="mt-7 grid gap-5 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <p className="text-[0.85rem] text-slate-500">Tổng danh mục</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">{categories.length}</p>
              </div>
              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <p className="text-[0.85rem] text-slate-500">Đang hoạt động</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">{categories.length}</p>
              </div>
              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <p className="text-[0.85rem] text-slate-500">Đang ẩn</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">0</p>
              </div>
            </div>

            <div className="mt-7 overflow-hidden rounded-[22px] border border-[#d7e0ec] bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-white">
                    <tr className="border-b border-[#d7e0ec] text-left text-[0.9rem] font-bold text-slate-900">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Tên danh mục</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-8 text-center text-sm font-medium text-slate-500"
                        >
                          Đang tải dữ liệu...
                        </td>
                      </tr>
                    ) : filteredCategories.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-8 text-center text-sm font-medium text-slate-500"
                        >
                          Chưa có dữ liệu danh mục trong database.
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((category) => (
                        <tr
                          key={category.id}
                          className="text-sm text-slate-700 transition hover:bg-slate-50/70"
                        >
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {category.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-10 items-center justify-center rounded-xl bg-[#eef3f9] text-slate-500">
                                <Layers className="size-4" />
                              </div>
                              <div className="text-[0.9rem] font-semibold text-slate-950">
                                {category.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex rounded-full bg-[#dffbe8] px-3 py-1 text-[0.75rem] font-semibold text-[#13a34b]">
                              Đang hoạt động
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(category)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#ffc107] px-3 py-2 text-[0.75rem] font-semibold text-white transition hover:bg-[#e9b000]"
                              >
                                <Pencil className="size-3.5" />
                                Sửa
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeleteModal(category)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#ff0a0a] px-3 py-2 text-[0.75rem] font-semibold text-white transition hover:bg-[#e00000]"
                              >
                                <Trash2 className="size-3.5" />
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>

      <CategoryModal
        open={modalMode === "create"}
        title="Thêm danh mục"
        submitLabel="Tạo danh mục"
        value={categoryName}
        onChange={setCategoryName}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
      />

      <CategoryModal
        open={modalMode === "edit"}
        title="Sửa danh mục"
        submitLabel="Lưu thay đổi"
        value={categoryName}
        onChange={setCategoryName}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
      />

      <CategoryModal
        open={modalMode === "delete"}
        title="Xóa danh mục"
        submitLabel="Xóa"
        value={categoryName}
        onChange={setCategoryName}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
        isDelete
      />
    </div>
  );
}

export default AdminCategories;
