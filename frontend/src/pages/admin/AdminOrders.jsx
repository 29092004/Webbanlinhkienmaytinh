/* eslint-disable react-hooks/set-state-in-effect */
import { Calendar, CheckCheck, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { getStoredUser } from "@/lib/auth";
import { api } from "@/lib/api";

function toMysqlDatetime(value) {
  if (!value) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value} 00:00:00`;
  }
  return value.replace("T", " ").replace("Z", "");
}

function buildOrderPayload(order, overrides = {}) {
  return {
    createdAt: toMysqlDatetime(overrides.createdAt ?? order.created_at ?? order.createdAt),
    paymentMethod: overrides.paymentMethod ?? order.payment_method ?? order.paymentMethod ?? "COD",
    status: overrides.status ?? order.status ?? "PENDING",
    accountId: Number(overrides.accountId ?? order.account_id ?? order.accountId),
    voucherId: overrides.voucherId ?? order.voucher_id ?? order.voucherId ?? null,
    totalPrice: Number(overrides.totalPrice ?? order.total_price ?? order.totalPrice ?? 0),
    discountAmount: Number(overrides.discountAmount ?? order.discount_amount ?? order.discountAmount ?? 0),
    finalPrice: Number(
      overrides.finalPrice ?? order.final_price ?? order.finalPrice ?? order.total_price ?? order.totalPrice ?? 0
    ),
    details: Array.isArray(overrides.details ?? order.details) ? (overrides.details ?? order.details) : [],
    productId: Number(overrides.productId ?? order.product_id ?? order.productId ?? 0),
    quantity: Number(overrides.quantity ?? order.quantity ?? 1),
    subtotalPrice: Number(overrides.subtotalPrice ?? order.subtotal_price ?? order.subtotalPrice ?? order.total_price ?? order.totalPrice ?? 0),
    note: overrides.note ?? order.note ?? null,
  };
}

function OrderModal({
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
  products = [],
  customers = []
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
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
              Bạn có chắc muốn xóa đơn hàng{" "}
              <span className="font-bold text-slate-900">#{formData.id}</span> không?
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Khách hàng</label>
                <select
                  value={formData.accountId}
                  onChange={(e) => onChange("accountId", e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
                >
                  <option value="">Chọn khách hàng</option>
                  {customers.map(c => (
                    <option key={c.customer_id} value={c.account_id || ''}>
                      {c.first_name} {c.last_name} ({c.phone || c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Sản phẩm</label>
                <select
                  value={formData.productId}
                  onChange={(e) => onChange("productId", e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Phương thức thanh toán</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => onChange("paymentMethod", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                    <option value="BANKING">Chuyển khoản ngân hàng</option>
                    <option value="MOMO">Ví MoMo</option>
                    <option value="VNPAY">VNPAY</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => onChange("status", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="PROCESSING">Đang xử lý</option>
                    <option value="SHIPPING">Đang giao</option>
                    <option value="COMPLETED">Đã hoàn thành</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Ngày tạo</label>
                <input
                  type="date"
                  value={formData.createdAt ? formData.createdAt.split("T")[0] : ""}
                  onChange={(e) => onChange("createdAt", e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
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

function AdminOrders() {
  const currentUser = getStoredUser();
  const canDeleteOrders = currentUser?.role === "admin";
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalError, setModalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormData = {
    id: "",
    createdAt: new Date().toISOString().split("T")[0],
    paymentMethod: "COD",
    status: "PENDING",
    productId: "",
    accountId: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const loadData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [ordRes, prodRes, custRes] = await Promise.all([
        api.get("/orders"),
        api.get("/products"),
        api.get("/customers")
      ]);
      setOrders(ordRes.data.data ?? []);
      setProducts(prodRes.data.data ?? []);
      setCustomers(custRes.data.data ?? []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không tải được dữ liệu từ database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return orders;
    return orders.filter((o) =>
      String(o.id).toLowerCase().includes(normalizedSearch) ||
      String(o.status).toLowerCase().includes(normalizedSearch)
    );
  }, [orders, searchTerm]);

  const getOrderCustomerLabel = (order) => {
    const matchedCustomer = customers.find((c) => c.account_id === order.account_id);

    if (matchedCustomer) {
      return `${matchedCustomer.first_name} ${matchedCustomer.last_name}`.trim();
    }

    const joinedName = `${order.customer_first_name ?? ""} ${order.customer_last_name ?? ""}`.trim();
    if (joinedName) {
      return joinedName;
    }

    return order.account_username || "N/A";
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setModalMode(null);
    setSelectedOrder(null);
    setFormData(initialFormData);
    setModalError("");
  };

  const openDeleteModal = (order) => {
    setModalMode("delete");
    setSelectedOrder(order);
    setFormData({ id: order.id });
    setModalError("");
  };

  const approveOrder = async (order) => {
    setModalError("");
    setIsSubmitting(true);
    try {
      await api.put(`/orders/${order.id}`, buildOrderPayload(order, { status: "PROCESSING" }));
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể duyệt đơn hàng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setModalError("");

    if (modalMode !== "delete" && (!formData.productId || !formData.accountId)) {
      setModalError("Vui lòng chọn sản phẩm và khách hàng.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildOrderPayload(selectedOrder, {
        createdAt: formData.createdAt,
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        productId: Number(formData.productId),
        accountId: Number(formData.accountId),
      });

      if (modalMode === "edit" && selectedOrder) {
        await api.put(`/orders/${selectedOrder.id}`, payload);
      } else if (modalMode === "delete" && selectedOrder) {
        await api.delete(`/orders/${selectedOrder.id}`);
      }

      closeModal();
      await loadData();
    } catch (requestError) {
      setModalError(requestError.response?.data?.message || "Không thể cập nhật dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return <span className="inline-flex rounded-full bg-[#dffbe8] px-3 py-1 text-[0.75rem] font-semibold text-[#13a34b]">Hoàn thành</span>;
      case 'CANCELLED':
        return <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-[0.75rem] font-semibold text-rose-700">Đã hủy</span>;
      case 'SHIPPING':
        return <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-[0.75rem] font-semibold text-blue-700">Đang giao</span>;
      case 'PROCESSING':
        return <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-[0.75rem] font-semibold text-yellow-700">Đang xử lý</span>;
      default:
        return <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[0.75rem] font-semibold text-slate-700">Chờ xử lý</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans flex">
      <AdminSidebar />
      <div className="relative ml-[290px] flex min-h-screen flex-1 flex-col">
        <main className="w-full flex-grow px-7 py-6">
          <section className="rounded-[24px] border border-[#dbe3ef] bg-white px-7 py-6 shadow-[0_10px_35px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-4">
              <h2 className="m-0 text-2xl font-bold tracking-tight text-[#071328]">Trang đơn hàng</h2>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="rounded-xl border border-[#d7e0ec] bg-[#f8fbff] px-4 py-2 text-[0.88rem] font-medium text-slate-600">
                  Đơn hàng được tạo tự động khi người dùng đặt hàng.
                </div>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Tìm mã đơn hàng..."
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
                <p className="text-[0.85rem] text-slate-500">Tổng đơn hàng</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">{orders.length}</p>
              </div>
              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <p className="text-[0.85rem] text-slate-500">Hoàn thành</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">
                  {orders.filter(o => o.status?.toUpperCase() === 'COMPLETED').length}
                </p>
              </div>
              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <p className="text-[0.85rem] text-slate-500">Đang xử lý / Giao</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">
                  {orders.filter(o => ['PENDING', 'PROCESSING', 'SHIPPING'].includes(o.status?.toUpperCase())).length}
                </p>
              </div>
            </div>

            <div className="mt-7 overflow-hidden rounded-[22px] border border-[#d7e0ec] bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-white">
                    <tr className="border-b border-[#d7e0ec] text-left text-[0.9rem] font-bold text-slate-900">
                      <th className="px-6 py-4">Mã ĐH</th>
                      <th className="px-6 py-4">Khách hàng</th>
                      <th className="px-6 py-4">Sản phẩm</th>
                      <th className="px-6 py-4">Ngày tạo</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                          Đang tải dữ liệu...
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                          Chưa có đơn hàng nào.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const product = products.find(p => p.id === order.product_id);

                        return (
                          <tr key={order.id} className="text-sm text-slate-700 transition hover:bg-slate-50/70">
                            <td className="px-6 py-4 font-bold text-slate-900">#{order.id}</td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900">
                                {getOrderCustomerLabel(order)}
                              </div>
                              <div className="text-[0.75rem] text-slate-500">
                                {order.customer_email || order.account_username || order.payment_method}
                              </div>
                            </td>
                            <td className="px-6 py-4 max-w-[200px] truncate" title={product?.name}>
                              {product?.name || order.product_name || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="size-3.5" />
                                {order.created_at ? new Date(order.created_at).toLocaleDateString('vi-VN') : ""}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-2">
                                {order.status?.toUpperCase() === "PENDING" && (
                                  <button
                                    type="button"
                                    onClick={() => approveOrder(order)}
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3 py-2 text-[0.75rem] font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <CheckCheck className="size-3.5" /> Duyệt đơn
                                  </button>
                                )}
                                {canDeleteOrders ? (
                                  <button
                                    type="button"
                                    onClick={() => openDeleteModal(order)}
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#ff0a0a] px-3 py-2 text-[0.75rem] font-semibold text-white transition hover:bg-[#e00000] disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <Trash2 className="size-3.5" /> Xóa
                                  </button>
                                ) : null}
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

      <OrderModal
        open={modalMode === "edit"}
        title="Cập nhật đơn hàng"
        submitLabel="Lưu thay đổi"
        formData={formData}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
        products={products}
        customers={customers}
      />

      {canDeleteOrders ? (
        <OrderModal
          open={modalMode === "delete"}
          title="Xóa đơn hàng"
          submitLabel="Xóa"
          formData={formData}
          onChange={handleFormChange}
          onClose={closeModal}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={modalError}
        />
      ) : null}
    </div>
  );
}

export default AdminOrders;
