/* eslint-disable react-hooks/set-state-in-effect */
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
  const userId = Number(user?.id || 0);
  const userEmail = user?.email || "";
  const userUsername = user?.username || "";
  const userLastName = user?.lastName || "";
  const userFirstName = user?.firstName || "";
  const userFullName = user?.fullName || "";
  const userPhone = user?.phone || "";
  const userBirthday = user?.birthday || "1998-10-24";
  const userGender = user?.gender || "Nam";
  const nameFromStoredUser = splitDisplayName(userFullName);
  const [profile, setProfile] = useState({
    lastName: userLastName || nameFromStoredUser.lastName,
    firstName: userFirstName || nameFromStoredUser.firstName,
    username: userUsername || userEmail || "",
    email: userEmail || userUsername || "",
    phone: userPhone || "",
    birthday: userBirthday,
    gender: userGender,
  });
  const [customerRecord, setCustomerRecord] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(section === "profile");
  const [isOrdersLoading, setIsOrdersLoading] = useState(section === "orders");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (section !== "profile" || !userId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/customers/${userId}`);
        const customer = response.data?.data || null;

        if (!isMounted) {
          return;
        }

        setCustomerRecord(customer);
        setProfile((current) => ({
          ...current,
          ...createProfileState(
            {
              lastName: userLastName,
              firstName: userFirstName,
              username: userUsername,
              email: userEmail,
              phone: userPhone,
              birthday: userBirthday,
              gender: userGender,
            },
            customer,
          ),
        }));
      } catch {
        if (!isMounted) {
          return;
        }

        setCustomerRecord(null);
        setProfile((current) => ({
          ...current,
          username: userUsername || userEmail || current.username,
          email: userEmail || userUsername || current.email,
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
  }, [section, userBirthday, userEmail, userFirstName, userGender, userId, userLastName, userPhone, userUsername]);

  useEffect(() => {
    if (section !== "orders" || !userId) {
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
        setOrders(mapOrdersForHistory(orderRows, userId));
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
  }, [section, userId]);

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

    if (!userId) {
      showToast({ message: "Bạn cần đăng nhập lại để cập nhật hồ sơ.", type: "error" });
      return;
    }

    const fullName = [nextLastName, nextFirstName].filter(Boolean).join(" ").trim();

    try {
      setIsSaving(true);

      if (customerRecord?.customer_id) {
        await api.put(`/customers/${userId}`, {
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
                <h2 className="text-[2rem] font-bold tracking-[-0.02em] text-slate-950 sm:text-[2.15rem]">Thông tin cá nhân</h2>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
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
                <h2 className="text-[2rem] font-bold tracking-[-0.02em] text-slate-950 sm:text-[2.15rem]">Lịch sử đơn hàng</h2>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
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
