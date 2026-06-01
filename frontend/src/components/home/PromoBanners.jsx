import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import promoBuildPc from "@/assets/home-banners/promo-build-pc.png";
import promoGear from "@/assets/home-banners/promo-gear.png";

export function PromoBanners() {
  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Banner 1: PC Builder */}
          <div className="relative overflow-hidden rounded-2xl min-h-[220px] shadow-lg flex flex-col justify-between p-8 text-white group hover:shadow-xl transition-all duration-300 cursor-pointer">
            {/* Background image & gradient overlay */}
            <img 
              src={promoBuildPc} 
              alt="Build PC" 
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-red-950/95 via-red-900/70 to-transparent z-10"></div>
            
            <div className="relative z-20">
              <span className="bg-red-600/35 border border-red-500/30 backdrop-blur-md text-white px-3 py-1 rounded-full text-[12px] font-semibold tracking-[-0.01em]">
                Cấu hình tối ưu
              </span>
              <h3 className="mt-3 mb-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.03em] drop-shadow-md">
                Tự Build PC Gaming Mơ Ước
              </h3>
              <p className="max-w-sm text-[14px] leading-7 text-white/90 font-medium tracking-[-0.01em] drop-shadow-sm">
                Lựa chọn linh kiện chuẩn chỉ, kiểm tra tính tương thích và nhận báo giá ưu đãi nhất.
              </p>
            </div>
            <div className="relative z-20 mt-6">
              <Link
                to="/pc-builder"
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl text-[14px] tracking-[-0.01em] transition-colors shadow-md"
              >
                Tự dựng cấu hình <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Banner 2: Premium Gear */}
          <div className="relative overflow-hidden rounded-2xl min-h-[220px] shadow-lg flex flex-col justify-between p-8 text-white group hover:shadow-xl transition-all duration-300 cursor-pointer">
            {/* Background image & gradient overlay */}
            <img 
              src={promoGear} 
              alt="Premium Gear" 
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/95 via-indigo-900/75 to-transparent z-10"></div>
            
            <div className="relative z-20">
              <span className="bg-indigo-600/35 border border-indigo-500/30 backdrop-blur-md text-white px-3 py-1 rounded-full text-[12px] font-semibold tracking-[-0.01em]">
                Góc Gaming Đỉnh Cao
              </span>
              <h3 className="mt-3 mb-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.03em] drop-shadow-md">
                Phụ Kiện Gear Chất Lượng Cao
              </h3>
              <p className="max-w-sm text-[14px] leading-7 text-white/90 font-medium tracking-[-0.01em] drop-shadow-sm">
                Trang bị bàn phím cơ, chuột gaming và tai nghe cao cấp với ưu đãi cực tốt.
              </p>
            </div>
            <div className="relative z-20 mt-6">
              <Link
                to="/products?category=keyboard"
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-[14px] tracking-[-0.01em] transition-colors shadow-md"
              >
                Mua sắm ngay <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
