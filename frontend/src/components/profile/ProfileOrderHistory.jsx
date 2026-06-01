import { Link } from "react-router-dom";
import { ChevronRight, PackageCheck } from "lucide-react";

const formatCurrency = (value) => `${value.toLocaleString("vi-VN")}đ`;

const statusClassName = {
  "Chờ xử lý": "bg-amber-50 text-amber-700",
  "Đang xử lý": "bg-violet-50 text-violet-700",
  "Đang giao": "bg-blue-50 text-blue-700",
  "Hoàn thành": "bg-emerald-50 text-emerald-700",
  "Đã hủy": "bg-slate-100 text-slate-600",
};

export default function ProfileOrderHistory({ orders }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <PackageCheck className="size-6 text-blue-700" />
        <div>
          <h2 className="m-0 text-[2rem] font-bold tracking-[-0.02em] text-slate-950 sm:text-[2.15rem]">
            Lịch sử đơn hàng
          </h2>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
            Theo dõi trạng thái và xem lại các đơn hàng đã mua.
          </p>
        </div>
      </div>

      <div className="mt-7 space-y-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-200 hover:bg-blue-50/20"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="m-0 text-lg font-semibold tracking-[-0.01em] text-blue-700">
                    {order.code || order.id}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold tracking-[-0.01em] ${
                      statusClassName[order.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Ngày đặt: {order.date}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-700">
                  {order.items}
                </p>
              </div>

              <div className="md:text-right">
                <p className="text-xl font-bold tracking-[-0.02em] text-slate-950">
                  {formatCurrency(order.total)}
                </p>
                <Link
                  to={`/order/${order.id}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold tracking-[-0.01em] text-blue-700 transition hover:text-blue-900"
                >
                  Xem chi tiết
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
