import { Headset, MessageCircleMore, Users } from "lucide-react";

import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";

function AdminSupport() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans flex">
      <AdminSidebar />

      <div className="relative ml-[290px] flex min-h-screen flex-1 flex-col">
        <main className="w-full flex-grow px-7 py-6">
          <section className="rounded-[24px] border border-[#dbe3ef] bg-white px-7 py-6 shadow-[0_10px_35px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-4">
              <h2 className="m-0 text-2xl font-bold tracking-tight text-[#071328]">Hỗ trợ Chat</h2>
              
            </div>

            <div className="mt-7 grid gap-5 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <div className="flex items-center gap-3 text-slate-900">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#2563eb]">
                    <MessageCircleMore className="size-5" />
                  </div>
                  <div>
                    <p className="text-[0.85rem] text-slate-500">Tin nhắn chờ xử lý</p>
                    <p className="mt-2 text-2xl font-bold leading-none text-slate-950">0</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <div className="flex items-center gap-3 text-slate-900">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[#fff5ea] text-[#ea580c]">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <p className="text-[0.85rem] text-slate-500">Khách đang chờ</p>
                    <p className="mt-2 text-2xl font-bold leading-none text-slate-950">0</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#d7e0ec] bg-white px-6 py-6 shadow-sm">
                <div className="flex items-center gap-3 text-slate-900">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[#eefbf2] text-[#16a34a]">
                    <Headset className="size-5" />
                  </div>
                  <div>
                    <p className="text-[0.85rem] text-slate-500">Nhân viên online</p>
                    <p className="mt-2 text-2xl font-bold leading-none text-slate-950">1</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 rounded-[22px] border border-dashed border-[#cfd9e7] bg-[#f8fbff] px-6 py-10 text-center">
              <h3 className="text-lg font-bold text-slate-950">Trang chat đã sẵn sàng cho tài khoản nhân viên</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Hiện tại đây là khung chờ để bạn nối chatbot với khách hàng cần hỗ trợ.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminSupport;
