import { useState } from "react";

import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileInfoForm from "@/components/profile/ProfileInfoForm";
import ProfileAddressBook from "@/components/profile/ProfileAddressBook";
import ProfileOrderHistory from "@/components/profile/ProfileOrderHistory";
import ProfileSecurityPanel from "@/components/profile/ProfileSecurityPanel";

const defaultProfile = {
  avatar:
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=240&auto=format&fit=crop",
  fullName: "Nguyễn Văn A",
  username: "nguyenvana",
  email: "nguyenvana@example.com",
  phone: "0901 234 567",
  birthday: "1998-10-24",
  gender: "Nam",
};

const defaultAddresses = [
  {
    id: 1,
    label: "Nhà riêng",
    receiver: "Nguyễn Văn A",
    phone: "0901 234 567",
    address: "123 Đường Song Hành, Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh",
    isDefault: true,
  },
  {
    id: 2,
    label: "Văn phòng",
    receiver: "Nguyễn Văn A",
    phone: "0901 234 567",
    address: "Tòa nhà EXO CORE, Quận 1, TP. Hồ Chí Minh",
    isDefault: false,
  },
];

const orders = [
  {
    id: "#EXO-99284",
    date: "24/10/2023",
    status: "Đang giao",
    total: 63630000,
    items: "NVIDIA RTX 4090 OC, Intel Core i9-13900K",
  },
  {
    id: "#EXO-99120",
    date: "18/10/2023",
    status: "Hoàn thành",
    total: 21710000,
    items: "PC Build cân bằng RTX 4060",
  },
  {
    id: "#EXO-98831",
    date: "02/10/2023",
    status: "Đã hủy",
    total: 4390000,
    items: "SSD NVMe 2TB, RAM DDR5",
  },
];

export default function UserProfile({ section = "profile" }) {
  const [profile, setProfile] = useState(defaultProfile);
  const [addresses, setAddresses] = useState(defaultAddresses);

  const handleAvatarChange = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((current) => ({
        ...current,
        avatar: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileChange = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleAddressChange = (id, field, value) => {
    setAddresses((current) =>
      current.map((address) =>
        address.id === id ? { ...address, [field]: value } : address,
      ),
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f9] font-sans text-slate-950">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <ProfileHeader profile={profile} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <ProfileSidebar
            profile={profile}
            activeSection={section}
            onAvatarChange={handleAvatarChange}
          />

          <div className="space-y-8">
            {section === "profile" ? (
              <ProfileInfoForm
                profile={profile}
                onProfileChange={handleProfileChange}
              />
            ) : null}

            {section === "addresses" ? (
              <ProfileAddressBook
                addresses={addresses}
                onAddressChange={handleAddressChange}
              />
            ) : null}

            {section === "orders" ? (
              <ProfileOrderHistory orders={orders} />
            ) : null}

            {section === "security" ? <ProfileSecurityPanel /> : null}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
