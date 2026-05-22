import { Calendar, Eye, MapPin, Pencil, Plus, Search, Trash2, Truck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("vi-VN");
}

function getShippingSortValue(shipping) {
  const parsedDate = shipping?.date ? new Date(shipping.date).getTime() : 0;
  if (Number.isFinite(parsedDate) && parsedDate > 0) {
    return parsedDate;
  }
  return Number(shipping?.id || 0);
}

function getOrderStatusLabel(status) {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "Đã hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    case "SHIPPING":
      return "Đang giao";
    case "PROCESSING":
      return "Đang xử lý";
    default:
      return "Chờ xử lý";
  }
}

function OrderDetailsModal({ open, order, onClose }) {
  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 px-4">
      <div className="w-full max-w-3xl rounded-[24px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Chi tiết đơn hàng #{order.id}</h2>
            <p className="mt-1 text-sm text-slate-500">Kiểm tra lại thông tin trước khi tạo hoặc hoàn tất vận đơn.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Khách hàng</p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {[order.customer_first_name, order.customer_last_name].filter(Boolean).join(" ") || order.account_username || "N/A"}
            </p>
            <p className="mt-1 text-sm text-slate-600">{order.customer_phone || order.customer_email || "Không có liên hệ"}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{order.customer_address || "Chưa có địa chỉ giao hàng"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Đơn hàng</p>
            <div className="mt-2 space-y-2 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Trạng thái:</span> {getOrderStatusLabel(order.status)}</p>
              <p><span className="font-semibold text-slate-900">Thanh toán:</span> {order.payment_method || "N/A"}</p>
              <p><span className="font-semibold text-slate-900">Ngày tạo:</span> {order.created_at ? new Date(order.created_at).toLocaleDateString("vi-VN") : "N/A"}</p>
              <p><span className="font-semibold text-slate-900">Tổng tiền:</span> {formatCurrency(order.total_price)}đ</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200">
          <div className="border-b border-slate-200 px-4 py-3">
            <h3 className="text-sm font-bold text-slate-900">Sản phẩm trong đơn</h3>
          </div>
          <div className="divide-y divide-slate-200">
            {(order.details?.length ? order.details : [order]).map((detail, index) => (
              <div key={`${detail.product_id || detail.id || index}-${index}`} className="grid gap-2 px-4 py-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <p className="font-semibold text-slate-900">{detail.product_name || "Sản phẩm"}</p>
                  {detail.note && <p className="mt-1 text-sm text-slate-500">Ghi chú: {detail.note}</p>}
                </div>
                <p className="text-sm text-slate-600">SL: {detail.quantity || 1}</p>
                <p className="text-sm font-semibold text-slate-900">{formatCurrency(detail.subtotal_price || order.total_price)}đ</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="button" onClick={onClose} className="h-11 rounded-2xl bg-slate-900 px-5 text-white hover:bg-slate-800">
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}

function ShippingModal({
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
  orders = [],
  customers = [],
  onPreviewOrder,
  isCreate = false
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
              Bạn có chắc muốn xóa thông tin vận chuyển của đơn hàng{" "}
              <span className="font-bold text-slate-900">#{formData.orderId}</span> không?
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {isCreate ? "Đơn hàng đủ điều kiện tạo vận đơn" : "Đơn hàng"}
                </label>
                {isCreate ? (
                  orders.length > 0 ? (
                    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      {orders.map((order) => {
                        const isSelected = String(formData.orderId) === String(order.id);
                        const customerName = [order.customer_first_name, order.customer_last_name].filter(Boolean).join(" ");

                        return (
                          <div
                            key={order.id}
                            className={`rounded-2xl border px-4 py-3 transition ${
                              isSelected ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"
                            }`}
                          >
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              <div>
                                <p className="font-semibold text-slate-900">#{order.id} • {customerName || order.account_username || "Khách hàng"}</p>
                                <p className="mt-1 text-sm text-slate-500">
                                  {order.customer_phone || order.customer_email || "Không có liên hệ"} • {getOrderStatusLabel(order.status)}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                  {order.customer_address || "Chưa có địa chỉ giao hàng"}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => onPreviewOrder?.(order)}
                                  className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                  <Eye className="size-4" /> Xem
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onChange("orderId", String(order.id))}
                                  disabled={isSubmitting}
                                  className={`inline-flex h-10 items-center rounded-xl px-3 text-sm font-semibold text-white transition ${
                                    isSelected ? "bg-blue-700 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
                                  }`}
                                >
                                  {isSelected ? "Đã chọn" : "Chọn đơn"}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                      Chưa có đơn hàng nào đã được duyệt sang trạng thái đang xử lý hoặc các đơn này đã có vận đơn.
                    </div>
                  )
                ) : (
                  <select
                    value={formData.orderId}
                    onChange={(e) => onChange("orderId", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    required
                  >
                    <option value="">Chọn ĐH</option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>#{o.id} ({getOrderStatusLabel(o.status)})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Mã đơn đã chọn</label>
                  <input
                    type="text"
                    value={formData.orderId ? `#${formData.orderId}` : ""}
                    readOnly
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-600 outline-none"
                    placeholder="Chưa chọn đơn"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Khách hàng</label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => onChange("customerId", e.target.value)}
                    disabled
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Tự lấy theo đơn hàng</option>
                    {customers.map(c => (
                      <option key={c.customer_id} value={c.customer_id}>
                        {c.first_name} {c.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Phương thức giao hàng</label>
                  <select
                    value={formData.deliveryMethod}
                    onChange={(e) => onChange("deliveryMethod", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="Standard">Tiêu chuẩn</option>
                    <option value="Express">Hỏa tốc</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Trạng thái vận chuyển</label>
                  <select
                    value={formData.status}
                    onChange={(e) => onChange("status", e.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="PENDING">Chờ lấy hàng</option>
                    <option value="PICKED_UP">Đã lấy hàng</option>
                    <option value="IN_TRANSIT">Đang vận chuyển</option>
                    <option value="DELIVERED">Đã giao thành công</option>
                    <option value="RETURNED">Đã hoàn hàng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Địa chỉ giao hàng</label>
                <input
                  type="text"
                  value={formData.shippingAddress}
                  onChange={(e) => onChange("shippingAddress", e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="123 Đường ABC, Quận XYZ, Hà Nội"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Ngày giao (dự kiến / thực tế)</label>
                <input
                  type="date"
                  value={formData.date ? formData.date.split("T")[0] : ""}
                  onChange={(e) => onChange("date", e.target.value)}
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

function AdminShipping() {
  const [shippings, setShippings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [modalError, setModalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewOrder, setPreviewOrder] = useState(null);

  const initialFormData = {
    orderId: "",
    customerId: "",
    deliveryMethod: "Standard",
    status: "PENDING",
    shippingAddress: "",
    date: new Date().toISOString().split("T")[0],
  };
  const [formData, setFormData] = useState(initialFormData);

  const loadData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [shipRes, ordRes, custRes] = await Promise.all([
        api.get("/shipping"),
        api.get("/orders"),
        api.get("/customers")
      ]);
      setShippings(shipRes.data.data ?? []);
      setOrders(ordRes.data.data ?? []);
      setCustomers(custRes.data.data ?? []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không tải được dữ liệu vận chuyển từ database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredShippings = useMemo(() => {
    const latestShippingByOrder = new Map();

    shippings.forEach((shipping) => {
      const orderKey = String(shipping.id_order ?? "");
      const currentShipping = latestShippingByOrder.get(orderKey);

      if (!currentShipping || getShippingSortValue(shipping) >= getShippingSortValue(currentShipping)) {
        latestShippingByOrder.set(orderKey, shipping);
      }
    });

    const uniqueShippings = Array.from(latestShippingByOrder.values()).sort((a, b) => {
      return Number(a.id_order || 0) - Number(b.id_order || 0);
    });
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return uniqueShippings;
    return uniqueShippings.filter((s) =>
      String(s.id_order).toLowerCase().includes(normalizedSearch) ||
      String(s.shipping_address).toLowerCase().includes(normalizedSearch)
    );
  }, [shippings, searchTerm]);

  const eligibleOrdersForCreate = useMemo(() => {
    return orders.filter((order) => {
      const normalizedStatus = order.status?.toUpperCase();
      return normalizedStatus === "PROCESSING";
    });
  }, [orders]);

  const getShippingCustomerLabel = (shipping) => {
    const matchedCustomer = customers.find((c) => String(c.customer_id) === String(shipping.customer_id));

    if (matchedCustomer) {
      return `${matchedCustomer.first_name} ${matchedCustomer.last_name}`.trim();
    }

    const joinedName = `${shipping.customer_first_name ?? ""} ${shipping.customer_last_name ?? ""}`.trim();
    if (joinedName) {
      return joinedName;
    }

    return shipping.account_username || "N/A";
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "orderId") {
        const selectedOrder = orders.find((order) => String(order.id) === String(value));
        next.customerId = selectedOrder?.customer_id ?? selectedOrder?.account_id ?? "";
        next.shippingAddress = selectedOrder?.customer_address ?? "";
      }

      return next;
    });
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setModalMode(null);
    setSelectedShipping(null);
    setFormData(initialFormData);
    setModalError("");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedShipping(null);
    setFormData(initialFormData);
    setModalError("");
  };

  const openEditModal = (shipping) => {
    setModalMode("edit");
    setSelectedShipping(shipping);
    setFormData({
      orderId: shipping.id_order ?? "",
      customerId: shipping.customer_id ?? "",
      deliveryMethod: shipping.delivery_method ?? "Standard",
      status: shipping.status ?? "PENDING",
      shippingAddress: shipping.shipping_address ?? "",
      date: shipping.date ?? "",
    });
    setModalError("");
  };

  const openDeleteModal = (shipping) => {
    setModalMode("delete");
    setSelectedShipping(shipping);
    setFormData({ orderId: shipping.id_order });
    setModalError("");
  };

  const openOrderPreview = (order) => {
    setPreviewOrder(order);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setModalError("");

    if (modalMode !== "delete" && !formData.orderId) {
      setModalError("Vui lòng chọn đơn hàng.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        date: formData.date,
        deliveryMethod: formData.deliveryMethod,
        status: formData.status,
        orderId: Number(formData.orderId),
        shippingAddress: formData.shippingAddress.trim(),
      };

      if (modalMode === "create") {
        await api.post("/shipping", payload);
      } else if (modalMode === "edit" && selectedShipping) {
        await api.put(`/shipping/${selectedShipping.id}`, payload);
      } else if (modalMode === "delete" && selectedShipping) {
        await api.delete(`/shipping/${selectedShipping.id}`);
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
      case 'DELIVERED':
        return <span className="inline-flex rounded-full bg-[#dffbe8] px-3 py-1 text-[0.75rem] font-semibold text-[#13a34b]">Đã giao</span>;
      case 'RETURNED':
        return <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-[0.75rem] font-semibold text-rose-700">Hoàn hàng</span>;
      case 'IN_TRANSIT':
        return <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-[0.75rem] font-semibold text-blue-700">Đang giao</span>;
      case 'PICKED_UP':
        return <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-[0.75rem] font-semibold text-yellow-700">Đã lấy hàng</span>;
      default:
        return <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[0.75rem] font-semibold text-slate-700">Chờ lấy hàng</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans flex">
      <AdminSidebar />
      <div className="relative ml-[290px] flex min-h-screen flex-1 flex-col">
        <main className="w-full flex-grow px-7 py-6">
          <section className="rounded-[24px] border border-[#dbe3ef] bg-white px-7 py-6 shadow-[0_10px_35px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-4">
              <h2 className="m-0 text-2xl font-bold tracking-tight text-[#071328]">Trang vận chuyển</h2>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  onClick={openCreateModal}
                  className="h-10 rounded-xl bg-[#2563eb] px-4 text-[0.88rem] font-semibold text-white hover:bg-[#1d4ed8]"
                >
                  <Plus className="mr-1.5 size-4" /> Thêm vận đơn
                </Button>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Tìm mã đơn hàng hoặc địa chỉ..."
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
                <p className="text-[0.85rem] text-slate-500">Tổng vận đơn</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">{shippings.length}</p>
              </div>
              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <p className="text-[0.85rem] text-slate-500">Đang giao</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">
                  {shippings.filter(s => s.status?.toUpperCase() === 'IN_TRANSIT').length}
                </p>
              </div>
              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <p className="text-[0.85rem] text-slate-500">Đã giao thành công</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">
                  {shippings.filter(s => s.status?.toUpperCase() === 'DELIVERED').length}
                </p>
              </div>
            </div>

            <div className="mt-7 overflow-hidden rounded-[22px] border border-[#d7e0ec] bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-white">
                    <tr className="border-b border-[#d7e0ec] text-left text-[0.9rem] font-bold text-slate-900">
                      <th className="px-6 py-4">Mã ĐH</th>
                      <th className="px-6 py-4">Mã KH</th>
                      <th className="px-6 py-4">Khách hàng</th>
                      <th className="px-6 py-4">Địa chỉ giao</th>
                      <th className="px-6 py-4">Ngày giao</th>
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
                    ) : filteredShippings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                          Chưa có thông tin vận chuyển.
                        </td>
                      </tr>
                    ) : (
                      filteredShippings.map((shipping) => {
                        return (
                          <tr key={shipping.id} className="text-sm text-slate-700 transition hover:bg-slate-50/70">
                            <td className="px-6 py-4 font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <Truck className="size-4 text-slate-500" />
                                {shipping.id_order}
                              </div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-700">
                              {shipping.customer_id || shipping.order_account_id || "N/A"}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900">
                                {getShippingCustomerLabel(shipping)}
                              </div>
                              <div className="text-[0.75rem] text-slate-500">
                                {shipping.customer_email || shipping.account_username || shipping.delivery_method}
                              </div>
                            </td>
                            <td className="px-6 py-4 max-w-[200px]">
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <MapPin className="size-3.5 flex-shrink-0" />
                                <span className="truncate" title={shipping.shipping_address}>{shipping.shipping_address}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="size-3.5" />
                                {shipping.date ? new Date(shipping.date).toLocaleDateString('vi-VN') : ""}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(shipping.status)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openOrderPreview(orders.find((order) => String(order.id) === String(shipping.id_order)) || null)}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[0.75rem] font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                  <Eye className="size-3.5" /> Xem
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openEditModal(shipping)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#ffc107] px-3 py-2 text-[0.75rem] font-semibold text-white transition hover:bg-[#e9b000]"
                                >
                                  <Pencil className="size-3.5" /> Sửa
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openDeleteModal(shipping)}
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

      <ShippingModal
        open={modalMode === "create"}
        title="Thêm vận đơn"
        submitLabel="Tạo vận đơn"
        formData={formData}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
        orders={eligibleOrdersForCreate}
        customers={customers}
        onPreviewOrder={openOrderPreview}
        isCreate
      />

      <ShippingModal
        open={modalMode === "edit"}
        title="Cập nhật vận đơn"
        submitLabel="Lưu thay đổi"
        formData={formData}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
        orders={orders}
        customers={customers}
        onPreviewOrder={openOrderPreview}
      />

      <ShippingModal
        open={modalMode === "delete"}
        title="Xóa vận đơn"
        submitLabel="Xóa"
        formData={formData}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
      />

      <OrderDetailsModal
        open={Boolean(previewOrder)}
        order={previewOrder}
        onClose={() => setPreviewOrder(null)}
      />
    </div>
  );
}

export default AdminShipping;
