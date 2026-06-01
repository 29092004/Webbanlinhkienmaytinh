/* eslint-disable react-hooks/set-state-in-effect */
import { BadgePercent, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

function formatVnd(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

function VoucherModal({
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
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] max-h-[90vh] overflow-y-auto">
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
              Bạn có chắc muốn xóa voucher{" "}
              <span className="font-bold text-slate-900">{formData.voucherCode}</span> không?
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Mã Voucher</label>
                <input
                  type="text"
                  value={formData.voucherCode}
                  onChange={(e) => onChange("voucherCode", e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Ví dụ: SALE50"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Giá trị giảm</label>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => onChange("discountValue", e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Ví dụ: 50000"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Loại giảm giá</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => onChange("discountType", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="PERCENT">Theo phần trăm</option>
                    <option value="FIXED">Giảm số tiền cố định</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Trạng thái</label>
                  <select
                    value={formData.isActive}
                    onChange={(e) => onChange("isActive", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Ẩn</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Đơn tối thiểu</label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => onChange("minOrderValue", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="Ví dụ: 5000000"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Giảm tối đa</label>
                  <input
                    type="number"
                    value={formData.maxDiscountValue}
                    onChange={(e) => onChange("maxDiscountValue", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="Để trống nếu không giới hạn"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={formData.startDate ? formData.startDate.split("T")[0] : ""}
                    onChange={(e) => onChange("startDate", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={formData.expiredDate ? formData.expiredDate.split("T")[0] : ""}
                    onChange={(e) => onChange("expiredDate", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Số lượt dùng tối đa</label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => onChange("usageLimit", e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Ví dụ: 100"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Đã dùng</label>
                  <input
                    type="number"
                    value={formData.usedCount}
                    onChange={(e) => onChange("usedCount", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="Ví dụ: 0"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Mỗi khách dùng tối đa</label>
                  <input
                    type="number"
                    value={formData.usagePerCustomer}
                    onChange={(e) => onChange("usagePerCustomer", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="Ví dụ: 1"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}

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

function AdminVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [modalError, setModalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormData = {
    voucherCode: "",
    discountType: "PERCENT",
    discountValue: "",
    minOrderValue: "",
    maxDiscountValue: "",
    startDate: "",
    expiredDate: "",
    isActive: 1,
    usageLimit: "",
    usedCount: 0,
    usagePerCustomer: 1,
  };
  const [formData, setFormData] = useState(initialFormData);

  const loadVouchers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await api.get("/vouchers");
      setVouchers(data.data ?? []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không tải được dữ liệu voucher từ database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const filteredVouchers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return vouchers;
    return vouchers.filter((voucher) => String(voucher.voucherCode ?? voucher.voucher_code ?? "").toLowerCase().includes(normalizedSearch));
  }, [vouchers, searchTerm]);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setModalMode(null);
    setSelectedVoucher(null);
    setFormData(initialFormData);
    setModalError("");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedVoucher(null);
    setFormData(initialFormData);
    setModalError("");
  };

  const openEditModal = (voucher) => {
    setModalMode("edit");
    setSelectedVoucher(voucher);
    setFormData({
      voucherCode: voucher.voucherCode ?? voucher.voucher_code ?? "",
      discountType: voucher.discountType ?? voucher.discount_type ?? "PERCENT",
      discountValue: voucher.discountValue ?? voucher.discount_value ?? "",
      minOrderValue: voucher.minOrderValue ?? voucher.min_order_value ?? 0,
      maxDiscountValue: voucher.maxDiscountValue ?? voucher.max_discount_value ?? "",
      startDate: voucher.startDate ?? voucher.start_date ?? "",
      expiredDate: voucher.expiredDate ?? voucher.expired_date ?? "",
      isActive: voucher.isActive ?? voucher.is_active ?? 1,
      usageLimit: voucher.usageLimit ?? voucher.usage_limit ?? "",
      usedCount: voucher.usedCount ?? voucher.used_count ?? 0,
      usagePerCustomer: voucher.usagePerCustomer ?? voucher.usage_per_customer ?? 1,
    });
    setModalError("");
  };

  const openDeleteModal = (voucher) => {
    setModalMode("delete");
    setSelectedVoucher(voucher);
    setFormData({ voucherCode: voucher.voucherCode ?? voucher.voucher_code });
    setModalError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setModalError("");

    if (modalMode !== "delete" && !formData.voucherCode.trim()) {
      setModalError("Vui lòng nhập mã voucher.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        voucherCode: formData.voucherCode,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue),
        maxDiscountValue: formData.maxDiscountValue === "" ? null : Number(formData.maxDiscountValue),
        startDate: formData.startDate,
        expiredDate: formData.expiredDate,
        isActive: Number(formData.isActive),
        usageLimit: Number(formData.usageLimit),
        usedCount: Number(formData.usedCount),
        usagePerCustomer: Number(formData.usagePerCustomer),
      };

      if (modalMode === "create") {
        await api.post("/vouchers", payload);
      } else if (modalMode === "edit" && selectedVoucher) {
        await api.put(`/vouchers/${selectedVoucher.id}`, payload);
      } else if (modalMode === "delete" && selectedVoucher) {
        await api.delete(`/vouchers/${selectedVoucher.id}`);
      }

      closeModal();
      await loadVouchers();
    } catch (requestError) {
      setModalError(requestError.response?.data?.message || "Không thể cập nhật dữ liệu voucher.");
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
              <h2 className="m-0 text-2xl font-bold tracking-tight text-[#071328]">Trang khuyến mãi</h2>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  onClick={openCreateModal}
                  className="h-10 rounded-xl bg-[#2563eb] px-4 text-[0.88rem] font-semibold text-white hover:bg-[#1d4ed8]"
                >
                  <Plus className="mr-1.5 size-4" /> Thêm voucher
                </Button>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Tìm kiếm mã..."
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
                <p className="text-[0.85rem] text-slate-500">Tổng voucher</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">{vouchers.length}</p>
              </div>
              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <p className="text-[0.85rem] text-slate-500">Đang hoạt động</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">
                  {vouchers.filter((v) => Number(v.isActive) === 1).length}
                </p>
              </div>
              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <p className="text-[0.85rem] text-slate-500">Đã hết hạn / Ẩn</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">
                  {vouchers.filter((v) => Number(v.isActive) !== 1).length}
                </p>
              </div>
            </div>

            <div className="mt-7 overflow-hidden rounded-[22px] border border-[#d7e0ec] bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-white">
                    <tr className="border-b border-[#d7e0ec] text-left text-[0.9rem] font-bold text-slate-900">
                      <th className="px-6 py-4">Mã Voucher</th>
                      <th className="px-6 py-4">Giá trị</th>
                      <th className="px-6 py-4">Đã dùng / Giới hạn</th>
                      <th className="px-6 py-4">Đơn tối thiểu</th>
                      <th className="px-6 py-4">Ngày hết hạn</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                          Đang tải dữ liệu...
                        </td>
                      </tr>
                    ) : filteredVouchers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                          Chưa có dữ liệu voucher trong database.
                        </td>
                      </tr>
                    ) : (
                      filteredVouchers.map((voucher) => (
                        <tr key={voucher.id} className="text-sm text-slate-700 transition hover:bg-slate-50/70">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-10 items-center justify-center rounded-xl bg-[#eef3f9] text-slate-500">
                                <BadgePercent className="size-4" />
                              </div>
                              <div className="text-[0.9rem] font-semibold text-slate-950">{voucher.voucherCode}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {voucher.discountType === "PERCENT"
                              ? `${Number(voucher.discountValue).toLocaleString("vi-VN")}%`
                              : formatVnd(voucher.discountValue)}
                          </td>
                          <td className="px-6 py-4">
                            {voucher.usedCount} / {voucher.usageLimit}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {formatVnd(voucher.minOrderValue)}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {voucher.expiredDate ? new Date(voucher.expiredDate).toLocaleDateString('vi-VN') : ""}
                          </td>
                          <td className="px-6 py-4">
                            {Number(voucher.isActive) === 1 ? (
                              <span className="inline-flex rounded-full bg-[#dffbe8] px-3 py-1 text-[0.75rem] font-semibold text-[#13a34b]">
                                Hoạt động
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-[#fce4e4] px-3 py-1 text-[0.75rem] font-semibold text-[#d32f2f]">
                                Đã ẩn
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(voucher)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#ffc107] px-3 py-2 text-[0.75rem] font-semibold text-white transition hover:bg-[#e9b000]"
                              >
                                <Pencil className="size-3.5" /> Sửa
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeleteModal(voucher)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#ff0a0a] px-3 py-2 text-[0.75rem] font-semibold text-white transition hover:bg-[#e00000]"
                              >
                                <Trash2 className="size-3.5" /> Xóa
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

      <VoucherModal
        open={modalMode === "create"}
        title="Thêm voucher"
        submitLabel="Tạo voucher"
        formData={formData}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
      />

      <VoucherModal
        open={modalMode === "edit"}
        title="Sửa voucher"
        submitLabel="Lưu thay đổi"
        formData={formData}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
      />

      <VoucherModal
        open={modalMode === "delete"}
        title="Xóa voucher"
        submitLabel="Xóa"
        formData={formData}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
        isDelete
      />
    </div>
  );
}

export default AdminVouchers;
