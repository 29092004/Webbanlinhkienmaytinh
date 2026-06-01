export function NewsletterSection() {
  return (
    <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 py-16 rounded-2xl shadow-lg border border-slate-800 text-white my-8">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Bạn Đang Build PC Mơ Ước?</h2>
        <p className="text-blue-100 mb-10 text-sm md:text-base leading-relaxed">
          Hãy để các chuyên gia của chúng tôi tư vấn cấu hình tối ưu nhất cho nhu cầu của bạn. Nhận báo giá ngay hôm nay.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Nhập email của bạn" 
            className="flex-1 rounded-[4px] bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm text-gray-900 placeholder-gray-400"
            required
          />
          <button type="submit" className="bg-white text-blue-600 font-bold px-8 py-3 rounded-[4px] text-sm whitespace-nowrap hover:bg-gray-50 transition-colors">
            ĐĂNG KÝ TƯ VẤN
          </button>
        </form>
      </div>
    </section>
  );
}
