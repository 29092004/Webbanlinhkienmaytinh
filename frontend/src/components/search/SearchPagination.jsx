import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SearchPagination() {
  return (
    <nav className="mt-20 flex items-center justify-center gap-3">
      <PaginationButton ariaLabel="Trang trước">
        <ChevronLeft className="size-5" />
      </PaginationButton>
      <PaginationButton active>1</PaginationButton>
      <PaginationButton>2</PaginationButton>
      <PaginationButton>3</PaginationButton>
      <span className="px-4 text-slate-500">...</span>
      <PaginationButton>6</PaginationButton>
      <PaginationButton ariaLabel="Trang sau">
        <ChevronRight className="size-5" />
      </PaginationButton>
    </nav>
  );
}

function PaginationButton({ children, active = false, ariaLabel }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`flex size-12 items-center justify-center rounded-xl border text-lg font-medium transition ${
        active
          ? "border-blue-700 bg-blue-700 text-white"
          : "border-slate-300 bg-white text-slate-800 hover:border-blue-700 hover:text-blue-700"
      }`}
    >
      {children}
    </button>
  );
}
