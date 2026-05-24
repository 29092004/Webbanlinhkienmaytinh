import { ArrowRight } from "lucide-react";

const steps = [
  { number: 1, title: "Bắt đầu", description: "Chọn nhu cầu & ngân sách" },
  { number: 2, title: "Chọn linh kiện", description: "8 bước đơn giản" },
  { number: 3, title: "Kiểm tra & tối ưu", description: "AI kiểm tra cấu hình" },
  { number: 4, title: "Xem trước & hoàn tất", description: "Tổng kết cấu hình" },
];

export default function BuilderSteps() {
  return (
    <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4">
        {steps.map((step, index) => {
          const isActive = index === 0;

          return (
            <div
              key={step.number}
              className={`relative flex items-center gap-5 px-7 py-5 ${
                isActive ? "bg-blue-50" : "bg-white"
              }`}
            >
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl border text-xl font-black ${
                  isActive
                    ? "border-blue-700 bg-blue-700 text-white"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {step.number}
              </div>
              <div className="min-w-0">
                <h2
                  className={`m-0 text-sm font-black ${
                    isActive ? "text-blue-700" : "text-slate-950"
                  }`}
                >
                  {step.title}
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 ? (
                <ArrowRight className="ml-auto hidden size-5 text-slate-400 md:block" />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
