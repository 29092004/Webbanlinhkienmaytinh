import { useEffect, useState } from "react";

import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import ProfileInfoForm from "@/components/profile/ProfileInfoForm";
import ProfileOrderHistory from "@/components/profile/ProfileOrderHistory";
import { api } from "@/lib/api";
import { getStoredUser, updateStoredUser } from "@/lib/auth";
import { mapOrdersForHistory } from "@/lib/orderMappers";
import { showToast } from "@/lib/toast";

const createProfileState = (user, customer = null) => ({
  lastName: customer?.firstName || user?.lastName || "",
  firstName: customer?.lastName || user?.firstName || "",
  username: user?.username || user?.email || "",
  email: customer?.email || user?.email || user?.username || "",
  phone: customer?.phone || user?.phone || "",
  birthday: user?.birthday || "1998-10-24",
  gender: user?.gender || "Nam",
});

function splitDisplayName(fullName = "") {
  const normalized = String(fullName).trim().replace(/\s+/g, " ");

  if (!normalized) {
    return { firstName: "", lastName: "" };
  }

  const parts = normalized.split(" ");

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts[parts.length - 1],
    lastName: parts.slice(0, -1).join(" "),
  };
}

export default function UserProfile({ section = "profile" }) {
  const user = getStoredUser();
  const nameFromStoredUser = splitDisplayName(user?.fullName || "");
  const [profile, setProfile] = useState({
    lastName: user?.lastName || nameFromStoredUser.lastName,
    firstName: user?.firstName || nameFromStoredUser.firstName,
    username: user?.username || user?.email || "",
    email: user?.email || user?.username || "",
    phone: user?.phone || "",
    birthday: user?.birthday || "1998-10-24",
    gender: user?.gender || "Nam",
  });
  const [customerRecord, setCustomerRecord] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(section === "profile");
  const [isOrdersLoading, setIsOrdersLoading] = useState(section === "orders");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (section !== "profile" || !user?.id) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/customers/${user.id}`);
        const customer = response.data?.data || null;

        if (!isMounted) {
          return;
        }

        setCustomerRecord(customer);
        setProfile((current) => ({
          ...current,
          ...createProfileState(user, customer),
        }));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setCustomerRecord(null);
        setProfile((current) => ({
          ...current,
          username: user?.username || user?.email || current.username,
          email: user?.email || user?.username || current.email,
        }));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [section, user?.email, user?.id, user?.username]);

  useEffect(() => {
    if (section !== "orders" || !user?.id) {
      setIsOrdersLoading(false);
      return;
    }

    let isMounted = true;

    const loadOrders = async () => {
      try {
        setIsOrdersLoading(true);
        const response = await api.get("/orders");

        if (!isMounted) {
          return;
        }

        const orderRows = Array.isArray(response.data?.data) ? response.data.data : [];
        setOrders(mapOrdersForHistory(orderRows, user.id));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to load user orders", error);
        setOrders([]);
      } finally {
        if (isMounted) {
          setIsOrdersLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [section, user?.id]);

  const handleProfileChange = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    const nextLastName = profile.lastName.trim();
    const nextFirstName = profile.firstName.trim();

    if (!nextFirstName) {
      showToast({ message: "Vui lòng nhập tên của bạn.", type: "error" });
      return;
    }

    if (!user?.id) {
      showToast({ message: "Bạn cần đăng nhập lại để cập nhật hồ sơ.", type: "error" });
      return;
    }

    const fullName = [nextLastName, nextFirstName].filter(Boolean).join(" ").trim();

    try {
      setIsSaving(true);

      if (customerRecord?.customer_id) {
        await api.put(`/customers/${user.id}`, {
          firstName: nextLastName,
          lastName: nextFirstName,
          email: customerRecord.email || profile.email,
          phone: profile.phone.trim() || customerRecord.phone || "Chưa cập nhật",
          address: customerRecord.address || "Chưa cập nhật",
        });

        setCustomerRecord((current) =>
          current
            ? {
                ...current,
                firstName: nextLastName,
                lastName: nextFirstName,
                phone: profile.phone.trim() || current.phone,
              }
            : current
        );
      }

      updateStoredUser((current) => ({
        ...current,
        fullName,
        firstName: nextFirstName,
        lastName: nextLastName,
        username: current.username || profile.username,
        phone: profile.phone.trim(),
        birthday: profile.birthday,
        gender: profile.gender,
      }));

      showToast({ message: "Đã cập nhật họ tên thành công." });
    } catch (error) {
      console.error("Failed to update profile", error);
      showToast({ message: "Không cập nhật được thông tin cá nhân.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f9] font-sans text-slate-950">
      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mt-8 space-y-8">
          {section === "profile" ? (
            isLoading ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-black text-slate-950">Thông tin cá nhân</h2>
                <p className="mt-3 text-sm font-medium text-slate-500">
                  Đang tải thông tin tài khoản...
                </p>
              </section>
            ) : (
              <ProfileInfoForm
                profile={profile}
                onProfileChange={handleProfileChange}
                onSubmit={handleSaveProfile}
                isSaving={isSaving}
              />
            )
          ) : null}

          {section === "orders" ? (
            isOrdersLoading ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-black text-slate-950">Lịch sử đơn hàng</h2>
                <p className="mt-3 text-sm font-medium text-slate-500">
                  Đang tải danh sách đơn hàng...
                </p>
              </section>
            ) : (
              <ProfileOrderHistory orders={orders} />
            )
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
