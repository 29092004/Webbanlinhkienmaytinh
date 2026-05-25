import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({ items, isLightBg = true }) {
  if (!items || items.length === 0) return null;

  const textColorClass = isLightBg ? "text-slate-500" : "text-blue-100";
  const hoverClass = isLightBg ? "hover:text-blue-600" : "hover:text-white";
  const lastItemClass = isLightBg ? "text-slate-950 font-semibold" : "text-white font-semibold";
  const separatorColor = isLightBg ? "text-slate-400" : "text-blue-300";

  return (
    <nav className={`flex flex-wrap items-center gap-1.5 text-[13px] font-medium leading-none ${textColorClass}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link 
                to={item.href} 
                className={`${hoverClass} transition-colors`}
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? lastItemClass : ""}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className={`size-3 ${separatorColor} shrink-0`} />}
          </div>
        );
      })}
    </nav>
  );
}
