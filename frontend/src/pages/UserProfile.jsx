import { useState } from "react";

import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import ProfileInfoForm from "@/components/profile/ProfileInfoForm";
import ProfileOrderHistory from "@/components/profile/ProfileOrderHistory";

const defaultProfile = {
  lastName: "Nguyễn Văn",
  firstName: "A",
  username: "nguyenvana",
  email: "nguyenvana@example.com",
  phone: "0901 234 567",
  birthday: "1998-10-24",
  gender: "Nam",
};

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

  const handleProfileChange = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f9] font-sans text-slate-950">
      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mt-8 space-y-8">
          {section === "profile" ? (
            <ProfileInfoForm
              profile={profile}
              onProfileChange={handleProfileChange}
            />
          ) : null}

          {section === "orders" ? (
            <ProfileOrderHistory orders={orders} />
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}

