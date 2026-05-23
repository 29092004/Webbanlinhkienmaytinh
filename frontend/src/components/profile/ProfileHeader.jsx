import { Mail, MapPin, Phone } from "lucide-react";

export default function ProfileHeader({ profile }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-slate-900 px-6 py-8 text-white sm:px-8">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-blue-100">
              Tài khoản EXO CORE
            </p>
            <h1 className="m-0 mt-3 text-[34px] font-black leading-tight tracking-normal sm:text-[44px]">
              Hồ sơ cá nhân
            </h1>
            <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-blue-50">
              Quản lý avatar, thông tin liên hệ, địa chỉ nhận hàng và lịch sử
              mua sắm của bạn.
            </p>
          </div>

          <div className="grid gap-3 text-sm font-medium text-blue-50">
            <ProfileMeta icon={Mail}>{profile.email}</ProfileMeta>
            <ProfileMeta icon={Phone}>{profile.phone}</ProfileMeta>
            <ProfileMeta icon={MapPin}>TP. Hồ Chí Minh</ProfileMeta>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileMeta({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
      <Icon className="size-4" />
      {children}
    </div>
  );
}
