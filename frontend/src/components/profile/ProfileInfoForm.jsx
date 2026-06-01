import { Save } from "lucide-react";

export default function ProfileInfoForm({
  profile,
  onProfileChange,
  onSubmit,
  isSaving = false,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="m-0 text-[2rem] font-bold tracking-[-0.02em] text-slate-950 sm:text-[2.15rem]">
            Thông tin cá nhân
          </h2>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
            Cập nhật thông tin cơ bản của tài khoản. Email được giữ theo tài khoản đăng nhập.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
        <ProfileInput
          label="Họ"
          value={profile.lastName}
          onChange={(value) => onProfileChange("lastName", value)}
          placeholder="Nhập họ"
        />
        <ProfileInput
          label="Tên"
          value={profile.firstName}
          onChange={(value) => onProfileChange("firstName", value)}
          placeholder="Nhập tên"
        />
        <div className="md:col-span-2">
          <ProfileInput
            label="Email"
            type="email"
            value={profile.email}
            disabled={true}
          />
        </div>
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

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 text-sm font-semibold tracking-[-0.01em] text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="size-4" />
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </section>
  );
}

function ProfileInput({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  placeholder = "",
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold tracking-[-0.01em] text-slate-800">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-medium tracking-[-0.01em] text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
      />
    </label>
  );
}
