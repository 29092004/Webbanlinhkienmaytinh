import { Link } from "react-router-dom";

const brands = [
  { name: "Intel", style: "hover:text-[#0071C5]" },
  { name: "AMD", style: "hover:text-[#ED1C24]" },
  { name: "NVIDIA", style: "hover:text-[#76B900]" },
  { name: "ASUS", style: "hover:text-[#00539B]" },
  { name: "MSI", style: "hover:text-[#FF0000]" },
  { name: "GIGABYTE", style: "hover:text-[#005CA9]" },
  { name: "Corsair", style: "hover:text-[#F1C40F]" },
  { name: "Logitech", style: "hover:text-[#00B0F0]" },
];

export function BrandShowcase() {
  return (
    <section className="bg-slate-50 py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-[20px] font-bold text-slate-800 tracking-[-0.02em]">
            Đối tác thương hiệu hàng đầu
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Linh kiện chính hãng từ các thương hiệu phần cứng hàng đầu thế giới
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {brands.map((brand, index) => (
            <Link
              key={index}
              to={`/products?brand=${encodeURIComponent(brand.name)}`}
              className={`bg-white h-16 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm cursor-pointer select-none group transition-all duration-300 hover:shadow-md hover:border-slate-300`}
            >
              <span
                className={`font-black tracking-wider text-slate-400 text-[18px] uppercase font-mono transition-colors duration-300 ${brand.style}`}
              >
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
