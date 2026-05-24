import { KeyRound, ShieldCheck } from "lucide-react";

export default function ProfileSecurityPanel() {
  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Mật khẩu đã được cập nhật ở giao diện.");
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <ShieldCheck className="size-6 text-blue-700" />
        <div>
          <h2 className="m-0 text-2xl font-black text-slate-950">
            Bảo mật tài khoản
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Giao diện đổi mật khẩu và kiểm tra bảo mật tài khoản.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
        <SecurityInput label="Mật khẩu hiện tại" />
        <SecurityInput label="Mật khẩu mới" />
        <SecurityInput label="Xác nhận mật khẩu mới" />

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 text-emerald-600" />
            <div>
              <p className="font-black text-emerald-700">Tài khoản an toàn</p>
              <p className="mt-1 text-sm font-medium text-emerald-700/80">
                Email và số điện thoại đã được cập nhật trên giao diện.
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 text-sm font-black text-white transition hover:bg-blue-800"
          >
            <KeyRound className="size-4" />
            Đổi mật khẩu
          </button>
        </div>
      </form>
    </section>
  );
}

function SecurityInput({ label }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <input
        type="password"
        className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
