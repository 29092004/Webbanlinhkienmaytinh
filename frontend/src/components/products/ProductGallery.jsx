import { useState } from "react";

export function ProductGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Ensure we only show at most 3 images in the thumbnail list
  const displayImages = images.slice(0, 3);
  const mainImage = displayImages[activeIndex] || images[0] || "";

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Image View */}
      <div className="aspect-[4/3] w-full bg-white rounded-xl border border-slate-100 flex items-center justify-center p-6 overflow-hidden shadow-sm">
        <img
          src={mainImage}
          alt="Product Main View"
          className="object-contain max-h-full max-w-full rounded transition-all duration-300 hover:scale-105"
        />
      </div>

      {/* Thumbnail List (exactly 3 items) */}
      <div className="grid grid-cols-3 gap-3">
        {displayImages.map((img, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`aspect-square rounded-lg border-2 bg-white p-1.5 flex items-center justify-center overflow-hidden transition-all hover:opacity-90 ${
                isActive ? "border-blue-600 shadow-sm" : "border-slate-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="object-cover w-full h-full rounded-md"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
