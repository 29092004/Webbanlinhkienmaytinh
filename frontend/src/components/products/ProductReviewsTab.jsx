import { useState } from "react";
import { Star, ChevronDown } from "lucide-react";

export function ProductReviewsTab() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Hoàng Minh Tuấn",
      rating: 5,
      content: "Card chạy cực mát, render video 4K siêu nhanh. Rất đáng đồng tiền bát gạo!",
      date: "18-05-2026",
    },
    {
      id: 2,
      name: "Trần Thị Hồng",
      rating: 5,
      content: "Thiết kế hầm hố, led đẹp. Giao hàng nhanh, đóng gói cẩn thận.",
      date: "15-05-2026",
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formContent, setFormContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formContent.trim()) return;

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;

    const newReview = {
      id: reviews.length + 1,
      name: formName,
      rating: formRating,
      content: formContent,
      date: formattedDate,
    };

    setReviews((prev) => [newReview, ...prev]);
    setFormName("");
    setFormRating(5);
    setFormContent("");
    setIsFormOpen(false);
    alert("Cảm ơn bạn đã gửi đánh giá! Đánh giá đã được thêm thành công.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Đánh giá chung */}
      <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-slate-800 text-base mb-4">Đánh giá chung</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-[52px] font-black text-slate-900 leading-none">4.9</span>
            <div className="flex flex-col">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs text-slate-400 font-semibold mt-1">
                1.240 đánh giá tin cậy
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown bar */}
        <div className="space-y-2">
          {[
            { star: 5, pct: 95 },
            { star: 4, pct: 4 },
            { star: 3, pct: 1 },
            { star: 2, pct: 0 },
            { star: 1, pct: 0 }
          ].map((row) => (
            <div key={row.star} className="flex items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="w-2 text-right">{row.star}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${row.pct}%` }} />
              </div>
              <span className="w-8 text-right text-slate-400">{row.pct}%</span>
            </div>
          ))}
        </div>

        {/* Write review button */}
        <button
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="w-full bg-[#111827] hover:bg-slate-900 text-white rounded-2xl py-3.5 text-xs font-bold transition-colors"
        >
          Viết đánh giá của bạn
        </button>

        {/* Write review form (toggled) */}
        {isFormOpen && (
          <form onSubmit={handleSubmit} className="border-t border-slate-100 pt-5 space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">HỌ VÀ TÊN</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nhập tên của bạn"
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">SỐ SAO</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormRating(s)}
                    className="text-amber-400 hover:scale-105 transition"
                  >
                    <Star className={`size-5.5 ${s <= formRating ? "fill-amber-400" : "text-gray-300"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">NHẬN XÉT</label>
              <textarea
                required
                rows="3"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Chia sẻ trải nghiệm sản phẩm..."
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-xs font-bold transition"
            >
              Gửi nhận xét
            </button>
          </form>
        )}
      </div>

      {/* Right Column: Tất cả đánh giá */}
      <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
          <h3 className="font-bold text-slate-800 text-base">Tất cả đánh giá</h3>
          
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] text-slate-400">Sắp xếp:</span>
            <button className="flex items-center gap-1 text-[13px] font-bold text-slate-800 focus:outline-none">
              Mới nhất <ChevronDown className="size-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Placeholder text matching the design image */}
        <p className="text-slate-400 text-xs italic">
          Nội dung đánh giá chi tiết đang được tải...
        </p>

        {/* Dynamic Reviews List if reviews exist */}
        {reviews.length > 0 && (
          <div className="space-y-4 pt-2">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-slate-50 pb-4 last:border-0 last:pb-0 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{r.name}</span>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`size-3 ${i < r.rating ? "fill-amber-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-slate-400">{r.date}</span>
                </div>
                <p className="text-slate-600 text-[13px] font-medium leading-relaxed">
                  {r.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
