import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Calendar, User, Eye, ArrowRight, MessageSquare, BookOpen } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Đánh Giá Chi Tiết NVIDIA GeForce RTX 5090: Bước Nhảy Vọt Về Hiệu Năng",
    summary: "Thế hệ card đồ họa Blackwell mới nhất của NVIDIA chính thức trình làng với hiệu năng dò tia (Ray Tracing) tăng gấp đôi so với thế hệ tiền nhiệm RTX 4090, mang lại hiệu năng gaming 4K đỉnh cao.",
    content: "",
    category: "Đánh giá linh kiện",
    author: "Lê Minh Tuấn",
    date: "24/05/2026",
    views: "1,240 lượt xem",
    comments: 15,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=700&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 2,
    title: "Hướng Dẫn Chọn Nguồn Máy Tính (PSU) Phù Hợp Cho Cấu Hình PC Gaming Năm 2026",
    summary: "Một bộ nguồn ổn định là 'trái tim' của hệ thống. Khám phá những tiêu chí chọn công suất nguồn, chuẩn chứng nhận 80 Plus và chuẩn PCIe 5.0 ATX 3.0 mới nhất.",
    category: "Kinh nghiệm build PC",
    author: "Trần Anh Khoa",
    date: "20/05/2026",
    views: "890 lượt xem",
    comments: 8,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=700&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 3,
    title: "Xu Hướng Thiết Kế Case Máy Tính 2026: Trào Lưu Bể Cá Cảnh & Màn Hình Phụ Lên Ngôi",
    summary: "Case máy tính không chỉ dùng để bảo vệ linh kiện mà còn là tác phẩm nghệ thuật. Cùng xem qua các thiết kế case hot nhất với hai mặt kính cong độc đáo năm nay.",
    category: "Thị trường công nghệ",
    author: "Nguyễn Hải Yến",
    date: "18/05/2026",
    views: "1,120 lượt xem",
    comments: 24,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=700&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 4,
    title: "AMD Ryzen 9000-Series Có Thực Sự Đáng Để Nâng Cấp Từ Thế Hệ 7000?",
    summary: "So sánh hiệu năng thực tế giữa kiến trúc Zen 5 và Zen 4 để xem liệu các game thủ và nhà sáng tạo nội dung có nên rút hầu bao nâng cấp ngay thời điểm hiện tại hay không.",
    category: "Đánh giá linh kiện",
    author: "Phạm Quốc Bảo",
    date: "15/05/2026",
    views: "750 lượt xem",
    comments: 11,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=700&auto=format&fit=crop",
    featured: false,
  },
];

export default function News() {
  const featuredArticle = articles.find(a => a.featured);
  const regularArticles = articles.filter(a => !a.featured);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
          <BookOpen className="size-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Tin Tức Công Nghệ
            </h1>
            <p className="text-sm text-slate-500">
              Cập nhật xu hướng công nghệ, đánh giá phần cứng và kinh nghiệm build PC mới nhất.
            </p>
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md lg:flex">
            <div className="h-64 bg-slate-100 lg:h-auto lg:w-1/2">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-8 lg:p-12">
              <div>
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 uppercase">
                  {featuredArticle.category}
                </span>
                <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-900 md:text-3xl">
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {featuredArticle.title}
                  </a>
                </h2>
                <p className="mt-4 text-slate-500 leading-relaxed">
                  {featuredArticle.summary}
                </p>
              </div>
              
              <div className="mt-8 border-t border-slate-100 pt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-5 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-bold text-slate-700">
                    <User className="size-4 text-slate-400" /> {featuredArticle.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-4 text-slate-400" /> {featuredArticle.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="size-4 text-slate-400" /> {featuredArticle.views}
                  </span>
                </div>
                
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition"
                >
                  Đọc tiếp <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="mt-16">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Bài viết mới nhất</h2>
          
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regularArticles.map((article) => (
              <article key={article.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="h-48 bg-slate-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>
                
                <div className="flex flex-1 flex-col p-6">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                      {article.category}
                    </span>
                    <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900 line-clamp-2">
                      <a href="#" className="hover:text-blue-600 transition">
                        {article.title}
                      </a>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-3">
                      {article.summary}
                    </p>
                  </div>
                  
                  <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" /> {article.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="size-3.5" /> {article.comments} bình luận
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
