import { useEffect, useState } from "react";

import { subscribeToToasts } from "@/lib/toast";

const toneClassName = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
};

export function ToastViewport() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return subscribeToToasts((toast) => {
      setToasts((prev) => [...prev, toast]);

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== toast.id));
      }, toast.duration || 2500);
    });
  }, []);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[80] flex w-[min(92vw,360px)] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur ${
            toneClassName[toast.type] || toneClassName.info
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
