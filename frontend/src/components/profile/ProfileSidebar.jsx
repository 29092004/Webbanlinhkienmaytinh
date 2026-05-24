import { Camera, History, Lock, MapPin, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  { id: "profile", label: "Thông tin cá nhân", icon: UserRound, href: "/profile" },
  { id: "orders", label: "Lịch sử đơn hàng", icon: History, href: "/profile/orders" },
  { id: "addresses", label: "Địa chỉ nhận hàng", icon: MapPin, href: "/profile/addresses" },
  { id: "security", label: "Bảo mật", icon: Lock, href: "/profile/security" },
];

export default function ProfileSidebar({
  profile,
  activeSection,
  onAvatarChange,
}) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <img
            src={profile.avatar}
            alt={profile.fullName}
            className="size-28 rounded-full border-4 border-blue-100 object-cover"
          />
          <label className="absolute bottom-1 right-1 flex size-9 cursor-pointer items-center justify-center rounded-full bg-blue-700 text-white shadow-sm transition hover:bg-blue-800">
            <Camera className="size-4" />
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => onAvatarChange(event.target.files?.[0])}
            />
          </label>
        </div>
        <h2 className="m-0 mt-4 text-xl font-black text-slate-950">
          {profile.fullName}
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          @{profile.username}
        </p>
      </div>

      <nav className="mt-7 space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <Link
              key={section.id}
              to={section.href}
              className={`flex h-12 w-full items-center gap-3 rounded-xl px-4 text-left text-sm font-bold transition ${
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-slate-700 hover:bg-slate-50 hover:text-blue-700"
              }`}
            >
              <Icon className="size-4" />
              {section.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
