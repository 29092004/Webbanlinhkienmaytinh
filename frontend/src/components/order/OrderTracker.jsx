import { Box, Check, CreditCard, Truck } from "lucide-react";

const icons = {
  ordered: Box,
  paid: CreditCard,
  shipping: Truck,
  done: Check,
};

export default function OrderTracker({ steps = [] }) {
  return (
    <section className="w-full rounded-lg border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-10">
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-4 sm:gap-4">
        {steps.map((step, idx) => {
          const Icon = icons[step.id] ?? Box;
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";

          return (
            <div
              key={step.id}
              className="relative flex items-start gap-4 sm:block sm:text-center"
            >
              {idx < steps.length - 1 ? (
                <div
                  className={`absolute left-5 top-11 h-[calc(100%+28px)] w-px sm:left-[calc(50%+40px)] sm:right-[calc(-50%+40px)] sm:top-8 sm:h-px sm:w-auto ${
                    isCompleted ? "bg-blue-700" : "bg-slate-200"
                  }`}
                />
              ) : null}

              <div className="relative z-10 flex shrink-0 justify-center sm:mb-3">
                <div
                  className={`flex size-12 items-center justify-center rounded-lg shadow-sm ${
                    isCompleted || isActive
                      ? "bg-blue-700 text-white shadow-blue-100"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  <Icon className="size-5" />
                </div>
              </div>

              <div className="min-w-0">
                <h2 className="m-0 text-sm font-black leading-tight text-slate-950">
                  {step.title}
                </h2>
                <p className="mt-1 text-[12px] font-medium leading-tight text-slate-500">
                  {step.time}
                </p>
                {step.actionLabel ? (
                  <button
                    type="button"
                    className="mt-2 text-[12px] font-bold text-blue-700 transition hover:text-blue-900"
                  >
                    {step.actionLabel} →
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
