import { useState } from "react";
import { Search } from "lucide-react";

export function ProductGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Ensure we show at most 4 images in the thumbnail list
  const displayImages = images.slice(0, 4);
  const mainImage = displayImages[activeIndex] || images[0] || "";

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Image View */}
      <div className="aspect-[4/3] w-full bg-white rounded-2xl border border-slate-100 flex items-center justify-center p-6 overflow-hidden shadow-sm relative">
        <img
          src={mainImage}
          alt="Product Main View"
          className="object-contain max-h-full max-w-full rounded-xl transition-all duration-300 hover:scale-102"
        />
        <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full border border-slate-100 shadow-sm cursor-pointer hover:bg-white transition-colors">
          <Search className="size-4 text-slate-500" />
        </div>
      </div>

      {/* Thumbnail List (exactly 4 items) */}
      <div className="grid grid-cols-4 gap-3">
        {displayImages.map((img, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`aspect-[4/3] rounded-xl border-2 bg-white p-1.5 flex items-center justify-center overflow-hidden transition-all hover:opacity-90 ${
                isActive ? "border-blue-600 shadow-sm" : "border-slate-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="object-cover w-full h-full rounded-lg"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
