import { Save } from "lucide-react";

export default function ProfileInfoForm({ profile, onProfileChange }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Thông tin cá nhân đã được cập nhật ở giao diện.");
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="m-0 text-2xl font-black text-slate-950">
            Thông tin cá nhân
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Cập nhật tên, email, số điện thoại và thông tin cơ bản.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
        <ProfileInput
          label="Họ và tên"
          value={profile.fullName}
          onChange={(value) => onProfileChange("fullName", value)}
        />
        <ProfileInput
          label="Tên tài khoản"
          value={profile.username}
          onChange={(value) => onProfileChange("username", value)}
        />
        <ProfileInput
          label="Email"
          type="email"
          value={profile.email}
          onChange={(value) => onProfileChange("email", value)}
        />
        <ProfileInput
          label="Số điện thoại"
          value={profile.phone}
          onChange={(value) => onProfileChange("phone", value)}
        />
        <ProfileInput
          label="Ngày sinh"
          type="date"
          value={profile.birthday}
          onChange={(value) => onProfileChange("birthday", value)}
        />
        <label className="block">
          <span className="text-sm font-black text-slate-700">Giới tính</span>
          <select
            value={profile.gender}
            onChange={(event) => onProfileChange("gender", event.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
          >
            <option>Nam</option>
            <option>Nữ</option>
            <option>Khác</option>
          </select>
        </label>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 text-sm font-black text-white transition hover:bg-blue-800"
          >
            <Save className="size-4" />
            Lưu thay đổi
          </button>
        </div>
      </form>
    </section>
  );
}

function ProfileInput({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
