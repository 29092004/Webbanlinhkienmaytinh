import { useState, useMemo } from "react";
import { Star, User } from "lucide-react";

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
    {
      id: 3,
      name: "Nguyễn Duy Khánh",
      rating: 4,
      content: "Hiệu năng quá khủng, chỉ hơi tiếc là kích thước khá to, mọi người nhớ đo case trước khi mua.",
      date: "10-05-2026",
    },
  ]);

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
  };

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return {
      avg: (total / reviews.length).toFixed(1),
      count: reviews.length,
    };
  }, [reviews]);

  return (
    <div className="space-y-8">
      {/* Review stats & Summary */}
      <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">
            Đánh Giá Trung Bình
          </h3>
          <div className="flex items-baseline gap-2 justify-center md:justify-start">
            <span className="text-4xl font-extrabold text-slate-900">{stats.avg}</span>
            <span className="text-lg font-bold text-gray-400">/ 5</span>
          </div>
          <div className="flex items-center gap-1 mt-2 justify-center md:justify-start text-amber-400">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`size-4 ${i < Math.floor(parseFloat(stats.avg)) ? "fill-amber-400" : "text-gray-300"}`}
              />
            ))}
            <span className="text-xs text-gray-500 font-semibold ml-1.5">
              ({stats.count} đánh giá)
            </span>
          </div>
        </div>

        {/* Breakdown bar */}
        <div className="flex-1 max-w-md w-full space-y-2">
          {[5, 4, 3, 2, 1].map((starsCount) => {
            const count = reviews.filter((r) => r.rating === starsCount).length;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={starsCount} className="flex items-center gap-3 text-xs font-semibold text-gray-600">
                <span className="w-3 text-right">{starsCount}</span>
                <Star className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-gray-400">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <h4 className="font-bold text-gray-900 text-base">Đánh giá từ khách hàng ({reviews.length})</h4>
        
        <div className="divide-y divide-slate-100 border border-slate-100 bg-white rounded-xl shadow-sm overflow-hidden">
          {reviews.map((r) => (
            <div key={r.id} className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-gray-500">
                    <User className="size-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">{r.name}</h5>
                    <div className="flex items-center gap-0.5 text-amber-400 mt-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${i < r.rating ? "fill-amber-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-semibold">{r.date}</span>
              </div>
              <p className="text-gray-600 text-sm font-medium leading-relaxed pl-11">
                {r.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Review Form */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-4">
        <h4 className="font-bold text-gray-900 text-base">Viết đánh giá của bạn</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nhập tên của bạn"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Số sao đánh giá
              </label>
              <div className="flex items-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((starsCount) => {
                  const isSelected = starsCount <= formRating;
                  return (
                    <button
                      key={starsCount}
                      type="button"
                      onClick={() => setFormRating(starsCount)}
                      className="text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`size-6 ${isSelected ? "fill-amber-400" : "text-gray-300"}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Nội dung nhận xét
            </label>
            <textarea
              required
              rows="4"
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 px-6 text-xs font-bold transition-colors"
          >
            Gửi đánh giá
          </button>
        </form>
      </div>
    </div>
  );
}
