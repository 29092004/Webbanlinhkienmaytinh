import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SearchPagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="mt-20 flex items-center justify-center gap-3">
      <PaginationButton
        ariaLabel="Trang trước"
        disabled={currentPage === 1}
        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
      >
        <ChevronLeft className="size-5" />
      </PaginationButton>
      {pages.map((page) => (
        <PaginationButton
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange?.(page)}
        >
          {page}
        </PaginationButton>
      ))}
      <PaginationButton
        ariaLabel="Trang sau"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
      >
        <ChevronRight className="size-5" />
      </PaginationButton>
    </nav>
  );
}

function PaginationButton({ children, active = false, ariaLabel, disabled = false, onClick }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={`flex size-12 items-center justify-center rounded-xl border text-lg font-medium transition ${
        active
          ? "border-blue-700 bg-blue-700 text-white"
          : "border-slate-300 bg-white text-slate-800 hover:border-blue-700 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
      }`}
    >
      {children}
    </button>
  );
}
