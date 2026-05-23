import { Clock } from "lucide-react";

export default function OrderDeliveryTimeline({ timeline = [] }) {
  return (
    <section className="w-full rounded-lg border border-slate-200 bg-white px-6 py-8 shadow-sm">
      <div className="mb-7 flex items-center gap-3">
        <Clock className="size-6 text-slate-950" />
        <h3 className="m-0 text-2xl font-black leading-none text-slate-950">
          Lịch sử vận chuyển
        </h3>
      </div>

      <div>
        {timeline.map((event, idx) => {
          const isActive = idx === 0;

          return (
            <article key={event.id} className="flex gap-5">
              <div className="flex shrink-0 flex-col items-center">
                <div
                  className={`mt-1 size-3 rounded-full ${
                    isActive
                      ? "bg-blue-700 ring-4 ring-blue-50"
                      : "bg-slate-300"
                  }`}
                />
                {idx < timeline.length - 1 && (
                  <div className="my-1 min-h-16 w-px flex-1 bg-slate-200" />
                )}
              </div>

              <div className="pb-6">
                <h4
                  className={`m-0 text-[15px] font-black leading-tight ${
                    isActive ? "text-blue-700" : "text-slate-950"
                  }`}
                >
                  {event.status}
                </h4>
                <p className="mt-1 text-sm font-medium leading-relaxed text-slate-500">
                  {event.description}
                </p>
                <p className="mt-1 text-[12px] font-medium text-slate-500">
                  {event.time}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
