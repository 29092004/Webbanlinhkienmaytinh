import { Eye, EyeOff, KeyRound, Pencil, Search, Shield, Trash2, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

function AccountModal({
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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowPassword(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
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
              Bạn có chắc muốn xóa tài khoản{" "}
              <span className="font-bold text-slate-900">{formData.username}</span> không?
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tên đăng nhập</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(event) => onChange("username", event.target.value)}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Nhập email hoặc username"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(event) => onChange("password", event.target.value)}
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Vai trò</label>
                <select
                  value={formData.role}
                  onChange={(event) => onChange("role", event.target.value)}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="user">User</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
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

function AdminAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modalError, setModalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormData = {
    username: "",
    password: "",
    role: "user",
  };
  const [formData, setFormData] = useState(initialFormData);

  const loadAccounts = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.get("/accounts");
      setAccounts(data.data ?? []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không tải được dữ liệu tài khoản từ database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const filteredAccounts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return accounts;
    }

    return accounts.filter((account) =>
      `${account.id ?? ""} ${account.username ?? ""} ${account.role ?? ""}`
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [accounts, searchTerm]);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setModalMode(null);
    setSelectedAccount(null);
    setFormData(initialFormData);
    setModalError("");
  };

  const openEditModal = (account) => {
    setModalMode("edit");
    setSelectedAccount(account);
    setFormData({
      username: account.username ?? "",
      password: "",
      role: account.role ?? "user",
    });
    setModalError("");
  };

  const openDeleteModal = (account) => {
    setModalMode("delete");
    setSelectedAccount(account);
    setFormData({
      username: account.username ?? "",
      password: "",
      role: account.role ?? "user",
    });
    setModalError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setModalError("");

    if (modalMode !== "delete") {
      if (!formData.username.trim() || !formData.password.trim() || !formData.role) {
        setModalError("Vui lòng nhập đầy đủ thông tin tài khoản.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        username: formData.username.trim(),
        password: formData.password,
        role: formData.role,
      };

      if (modalMode === "edit" && selectedAccount) {
        await api.put(`/accounts/${selectedAccount.id}`, payload);
      } else if (modalMode === "delete" && selectedAccount) {
        await api.delete(`/accounts/${selectedAccount.id}`);
      }

      closeModal();
      await loadAccounts();
    } catch (requestError) {
      setModalError(requestError.response?.data?.message || "Không thể cập nhật dữ liệu tài khoản.");
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
              <h2 className="m-0 text-2xl font-bold tracking-tight text-[#071328]">Trang tài khoản</h2>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Tìm id, tên đăng nhập hoặc quyền..."
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
                <p className="text-[0.85rem] text-slate-500">Tổng tài khoản</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">{accounts.length}</p>
              </div>
              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <p className="text-[0.85rem] text-slate-500">Tài khoản Admin</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">
                  {accounts.filter((account) => account.role === "admin").length}
                </p>
              </div>
              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <p className="text-[0.85rem] text-slate-500">Tài khoản User / Staff</p>
                <p className="mt-2 text-2xl font-bold leading-none text-slate-950">
                  {accounts.filter((account) => account.role === "user" || account.role === "staff").length}
                </p>
              </div>
            </div>

            <div className="mt-7 overflow-hidden rounded-[22px] border border-[#d7e0ec] bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-white">
                    <tr className="border-b border-[#d7e0ec] text-left text-[0.9rem] font-bold text-slate-900">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Tài khoản</th>
                      <th className="px-6 py-4">Vai trò</th>
                      <th className="px-6 py-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                          Đang tải dữ liệu...
                        </td>
                      </tr>
                    ) : filteredAccounts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                          Chưa có dữ liệu tài khoản trong database.
                        </td>
                      </tr>
                    ) : (
                      filteredAccounts.map((account) => (
                        <tr key={account.id} className="text-sm text-slate-700 transition hover:bg-slate-50/70">
                          <td className="px-6 py-4 font-medium text-slate-900">{account.id}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-10 items-center justify-center rounded-xl bg-[#eef3f9] text-slate-500">
                                <UserRound className="size-4" />
                              </div>
                              <div>
                                <div className="text-[0.9rem] font-semibold text-slate-950">{account.username}</div>
                                <div className="flex items-center gap-1.5 text-[0.75rem] text-slate-500">
                                  <KeyRound className="size-3.5" />
                                  Mật khẩu được mã hóa
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-[0.75rem] font-semibold ${
                                account.role === "admin"
                                  ? "bg-[#e7edff] text-[#3157d5]"
                                  : account.role === "staff"
                                    ? "bg-[#fff4db] text-[#b7791f]"
                                    : "bg-[#dffbe8] text-[#13a34b]"
                              }`}
                            >
                              <span className="mr-1.5 inline-flex items-center">
                                <Shield className="size-3.5" />
                              </span>
                              {account.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(account)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#ffc107] px-3 py-2 text-[0.75rem] font-semibold text-white transition hover:bg-[#e9b000]"
                              >
                                <Pencil className="size-3.5" /> Sửa
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeleteModal(account)}
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

      <AccountModal
        open={modalMode === "edit"}
        title="Sửa tài khoản"
        submitLabel="Lưu thay đổi"
        formData={formData}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
      />

      <AccountModal
        open={modalMode === "delete"}
        title="Xóa tài khoản"
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

export default AdminAccounts;
