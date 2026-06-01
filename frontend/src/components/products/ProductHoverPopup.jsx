import { createPortal } from "react-dom";
import { ShieldCheck, Gift } from "lucide-react";
import { parseStoredSpecs } from "@/components/admin/product/productUtils";

// Helper to format currency
const formatPrice = (priceVal) => {
  if (!priceVal) return "";
  const numeric = typeof priceVal === "string" 
    ? parseFloat(priceVal.replace(/[^0-9]/g, "")) 
    : priceVal;
  return Number(numeric || 0).toLocaleString("vi-VN") + "đ";
};

// Generate realistic promotions based on product characteristics
const getPromotionsForProduct = (product) => {
  const name = String(product.name || "").toLowerCase();
  const cat = String(product.category_name || product.category || "").toLowerCase();

  if (name.includes("pc") || name.includes("bộ") || cat.includes("pc") || cat.includes("máy tính")) {
    return {
      items: [
        { label: "Tặng Màn Hình", text: "Màn hình Gaming EGM24F120H 100Hz hoặc Màn hình VIOX MF2425" },
        { label: "Trừ Quà Tặng", text: "Không lấy quà tặng màn hình: Giảm trực tiếp 1.500.000đ vào giá PC" },
        { label: "Tặng Quà Kèm", text: "Tặng ngay Bàn phím giả cơ Gaming + Chuột chuyên game LED RGB" },
        { label: "Hỗ trợ lắp đặt", text: "Miễn phí lắp đặt linh kiện và cài đặt hệ điều hành tại cửa hàng" }
      ],
      link: "khuyenmai.nguyencongpc.vn/build-pc",
      bannerText: "MUA PC LIỀN TAY - NHẬN NGAY QUÀ KHỦNG!"
    };
  }

  if (name.includes("laptop") || cat.includes("laptop")) {
    return {
      items: [
        { label: "Tặng Balo", text: "Balo Laptop EXO CORE thời trang, chống nước hiệu quả" },
        { label: "Tặng Chuột", text: "Chuột không dây Silent cao cấp trị giá 350.000đ" },
        { label: "Gói Dịch Vụ", text: "Tặng gói bảo dưỡng, vệ sinh máy trọn đời trị giá 1.000.000đ" },
        { label: "Mua Kèm Deal Sốc", text: "Giảm 20% khi mua kèm đế tản nhiệt laptop" }
      ],
      link: "khuyenmai.nguyencongpc.vn/laptop",
      bannerText: "LAPTOP VĂN PHÒNG & GAMING - GIẢM TỚI 50%"
    };
  }

  if (name.includes("bàn phím") || name.includes("keyboard") || cat.includes("keyboard") || cat.includes("phím")) {
    return {
      items: [
        { label: "Quà Tặng Kèm", text: "Tặng keypuller cao cấp + Chổi vệ sinh chuyên dụng" },
        { label: "Tặng Keycap", text: "Tặng bộ 12 Keycap ABS xuyên LED trang trí cực chất" },
        { label: "Ưu đãi kèm", text: "Giảm 10% khi mua kèm Lót chuột khổ lớn (cỡ 80x30cm)" }
      ],
      link: "khuyenmai.nguyencongpc.vn/gaming-gear",
      bannerText: "GEAR CHẤT CHƠI - BỨT PHÁ CHIẾN THẮNG"
    };
  }

  // Default component promotion (VGA, RAM, SSD, CPU, Mainboard)
  return {
    items: [
      { label: "Hỗ trợ lắp", text: "Hỗ trợ lắp ráp, thay thế linh kiện miễn phí tại hệ thống cửa hàng" },
      { label: "Bảo hành vàng", text: "Lỗi 1 đổi 1 trong vòng 30 ngày đầu tiên nếu có lỗi phần cứng" },
      { label: "Ưu đãi combo", text: "Giảm thêm 5% khi build trọn bộ PC tại cửa hàng" }
    ],
    link: "khuyenmai.nguyencongpc.vn/linh-kien",
    bannerText: "LINH KIỆN CHÍNH HÃNG - UY TÍN HÀNG ĐẦU"
  };
};

export function ProductHoverPopup({ product, coords }) {
  if (!product || !coords) return null;

  // Process specifications
  const rawSpecs = parseStoredSpecs(product.specs);
  let specsList = [];

  if (Array.isArray(rawSpecs)) {
    specsList = rawSpecs.map((item, index) => {
      if (typeof item === "object" && item !== null) {
        const label = item["Thông số"] || item.label || item.name || `Thông số ${index + 1}`;
        const value = item["Chi tiết"] || item.value || Object.values(item).slice(1).join(" | ");
        return { label, value: String(value) };
      }
      return { label: `Thông số ${index + 1}`, value: String(item) };
    });
  } else if (typeof rawSpecs === "object" && rawSpecs !== null) {
    specsList = Object.entries(rawSpecs).map(([key, val]) => ({
      label: key,
      value: String(val)
    }));
  } else if (typeof rawSpecs === "string" && rawSpecs.trim() !== "") {
    specsList = rawSpecs.split(/\r?\n/).map((line, idx) => {
      const parts = line.split(":");
      if (parts.length > 1) {
        return { label: parts[0].trim(), value: parts.slice(1).join(":").trim() };
      }
      return { label: `Thông số ${idx + 1}`, value: line.trim() };
    });
  }

  // Fallback specs if none available
  if (specsList.length === 0) {
    specsList = [
      { label: "Thương hiệu", value: product.brand || "Chính hãng" },
      { label: "Xuất xứ", value: product.origin || "Đang cập nhật" },
      { label: "Bảo hành", value: product.warranty ? `${product.warranty} tháng` : "Theo linh kiện" },
      { label: "Mô tả", value: product.description || product.desc || "Đang cập nhật" }
    ];
  }

  // Slice specs to top 9 for readability
  const visibleSpecs = specsList.slice(0, 9);

  // Prices and details
  const originalPriceFormatted = product.originalPrice 
    ? formatPrice(product.originalPrice) 
    : null;
  const priceFormatted = formatPrice(product.price);
  
  let discountLabel = product.discount || "";
  if (!discountLabel && originalPriceFormatted && priceFormatted) {
    const orig = parseFloat(String(product.originalPrice).replace(/[^0-9]/g, ""));
    const cur = parseFloat(String(product.price).replace(/[^0-9]/g, ""));
    if (orig > cur) {
      const pct = Math.round(((orig - cur) / orig) * 100);
      discountLabel = `-${pct}%`;
    }
  }

  const quantity = Number(product.quantity ?? 10);
  const isOnSale = Boolean(product.sale_id || product.isOnSale);
  const statusText = quantity > 0 ? (isOnSale ? "Còn DEAL" : "Còn hàng") : "Hết hàng";

  const promo = getPromotionsForProduct(product);

  return createPortal(
    <div
      className="fixed z-[99999] w-[700px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden text-slate-800 pointer-events-none"
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2), 0 0 15px 0 rgba(0, 0, 0, 0.05)"
      }}
    >
      {/* Product Name Header */}
      <div className="bg-[#1e5bb6] text-white px-5 py-3.5 font-bold text-sm leading-snug tracking-wide border-b border-[#154a97]">
        {product.name}
      </div>

      <div className="p-4 grid grid-cols-2 gap-4 bg-white">
        {/* Left Column: Specifications */}
        <div className="space-y-3">
          <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 px-4 py-2 flex items-center gap-2 border-b border-slate-200">
              <ShieldCheck className="w-4 h-4 text-[#1e5bb6]" />
              <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">Thông số sản phẩm</span>
            </div>
            <div className="p-3 bg-white space-y-2">
              {visibleSpecs.map((spec, idx) => (
                <div key={idx} className="text-[11px] flex gap-2 leading-relaxed border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                  <span className="font-bold text-slate-500 min-w-[90px] block">{spec.label}:</span>
                  <span className="text-slate-850 font-semibold break-words flex-1">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Promotions */}
        <div className="space-y-3 flex flex-col justify-between">
          {/* Price & Status Table */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-150 grid grid-cols-2 gap-y-1.5 gap-x-4 text-[11px] font-semibold text-slate-700">
            <div>Giá niêm yết:</div>
            <div className="text-right">
              {originalPriceFormatted ? (
                <span className="text-slate-400 line-through mr-1.5">{originalPriceFormatted}</span>
              ) : null}
              {discountLabel ? (
                <span className="text-red-500 font-extrabold">{discountLabel}</span>
              ) : (
                <span className="text-slate-900 font-extrabold">{priceFormatted}</span>
              )}
            </div>

            <div className="text-slate-900 font-bold">Giá bán:</div>
            <div className="text-right text-[#d32f2f] text-xs font-extrabold">{priceFormatted}</div>

            <div>Bảo hành:</div>
            <div className="text-right text-[#1e5bb6] font-semibold">
              {product.warranty ? `Bảo hành ${product.warranty} tháng` : "Theo linh kiện"}
            </div>

            <div>Tình trạng:</div>
            <div className={`text-right font-bold ${quantity > 0 ? "text-emerald-600" : "text-slate-400"}`}>
              {statusText}
            </div>
          </div>

          {/* Promotion Box */}
          <div className="border border-red-100 rounded-xl overflow-hidden shadow-sm flex-1 flex flex-col">
            <div className="bg-red-50 px-4 py-2 flex items-center justify-between border-b border-red-100">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                <span className="text-[11px] font-extrabold text-red-700 uppercase tracking-wider">Khuyến mãi</span>
              </div>
            </div>
            <div className="p-3 bg-white flex-1 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                {promo.items.map((item, idx) => (
                  <div key={idx} className="text-[10px] flex gap-1.5 leading-relaxed items-start">
                    <span className="text-red-500 font-extrabold mt-0.5">•</span>
                    <span className="text-slate-700 font-semibold">
                      <strong className="text-red-650 font-bold">{item.label}:</strong> {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Custom Banner in Promotion */}
              <div className="relative overflow-hidden rounded-lg bg-[linear-gradient(135deg,#e21a36_0%,#b91c1c_100%)] p-2 text-center text-white shadow-sm">
                <p className="text-[9px] font-black tracking-widest uppercase">{promo.bannerText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
