import { Edit2, Trash2, Eye, Copy, Filter, RefreshCcw, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CATEGORIES_DATA = [
  {
    id: 1,
    name: "GPU",
    slug: "/gpu",
    productsCount: 142,
    trend: "+12% mo.",
    trendType: "positive",
    visibility: "Visible",
    lastModified: "2 days ago",
    image: "https://placehold.co/100x100/0f172a/ffffff?text=GPU",
  },
  {
    id: 2,
    name: "CPU",
    slug: "/cpu",
    productsCount: 86,
    trend: "Stable",
    trendType: "neutral",
    visibility: "Visible",
    lastModified: "5 days ago",
    image: "https://placehold.co/100x100/0f172a/ffffff?text=CPU",
  },
  {
    id: 3,
    name: "RAM",
    slug: "/memory",
    productsCount: 64,
    trend: "+4% mo.",
    trendType: "positive",
    visibility: "Draft",
    lastModified: "1 week ago",
    image: "https://placehold.co/100x100/0f172a/ffffff?text=RAM",
  },
  {
    id: 4,
    name: "SSD",
    slug: "/ssd-storage",
    productsCount: 32,
    trend: "-2% mo.",
    trendType: "negative",
    visibility: "Hidden",
    lastModified: "3 hours ago",
    image: "https://placehold.co/100x100/0f172a/ffffff?text=SSD",
  },
];

const TrendPill = ({ trend, type }) => {
  const styles = {
    positive: "bg-emerald-50 text-emerald-600",
    neutral: "bg-gray-100 text-gray-500",
    negative: "bg-rose-50 text-rose-600",
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${styles[type]}`}>
      {trend}
    </span>
  );
};

const VisibilityPill = ({ status }) => {
  const styles = {
    "Visible": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    "Draft": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    "Hidden": { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
  };
  const style = styles[status];
  return (
    <span className={`px-3 py-1 flex items-center gap-1.5 text-xs font-bold rounded-full w-max ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
      {status}
    </span>
  );
};

export function CategoryList() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
              <Filter className="w-4 h-4 text-gray-400" /> All Visibilities
            </button>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Updated Just Now</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Products & Growth</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Visibility</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Last Modified</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {CATEGORIES_DATA.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-100">
                        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{category.name}</span>
                        <span className="text-xs text-gray-400">{category.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{category.productsCount}</span>
                      <TrendPill trend={category.trend} type={category.trendType} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <VisibilityPill status={category.visibility} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{category.lastModified}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded transition-colors" title="View Category">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigate('/admin/categories/edit')}
                        className="p-1.5 text-gray-400 hover:text-gray-900 rounded transition-colors" 
                        title="Edit Category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded transition-colors" title="Duplicate Category">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-rose-600 rounded transition-colors" title="Delete Category">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500">Showing 4 of 24 categories</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors bg-white">Previous</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm">Next</button>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bulk Migration Tool */}
        <div className="bg-blue-600 rounded-xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[280px]">
          {/* Abstract pattern background */}
          <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
             <svg width="200" height="200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0V100M0 50H100M25 25H75V75H25V25Z" stroke="white" strokeWidth="10"/>
            </svg>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold text-white mb-3">Bulk Migration Tool</h2>
            <p className="text-blue-100 text-sm leading-relaxed max-w-md">
              Seamlessly restructure your entire catalog. Move products between categories or merge structures in seconds.
            </p>
          </div>
          
          <div className="relative z-10 flex items-center gap-3 mt-8">
            <button className="px-5 py-2.5 bg-white text-blue-600 text-sm font-bold rounded-lg shadow flex items-center gap-2 hover:bg-blue-50 transition-colors">
              Launch Tool <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-5 py-2.5 border border-blue-400 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors">
              Documentation
            </button>
          </div>
        </div>

        {/* Category SEO */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col min-h-[280px]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Category SEO</h2>
              <p className="text-sm text-gray-500">Optimize crawlability and search ranking.</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-emerald-600">84/100</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Health Score</div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-6 flex-grow">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Search Preview</div>
            <div className="text-sm font-medium text-blue-700 hover:underline cursor-pointer mb-0.5 truncate">
              Top Components & High-Performance Hardware | EXO CORE
            </div>
            <div className="text-xs text-emerald-700 mb-1 truncate">
              exocore.com › components › gpu
            </div>
            <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              Explore the widest selection of next-gen graphics cards from top manufacturers...
            </div>
          </div>

          <button className="w-full py-2.5 border border-blue-200 text-blue-600 text-sm font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
            <RefreshCcw className="w-4 h-4" /> Run Full SEO Audit
          </button>
        </div>
      </div>
    </div>
  );
}
