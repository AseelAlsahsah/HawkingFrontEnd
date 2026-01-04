import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onChange,
}) => {
  if (totalPages <= 1) return null;

  const goToFirst = () => onChange(0);
  const goToLast = () => onChange(totalPages - 1);

  return (
    <div className="flex items-center justify-center gap-1 mt-10 text-sm select-none">

      {/* First */}
      <button
        onClick={goToFirst}
        disabled={page === 0}
        className="px-2 py-1 rounded-md text-gray-600 disabled:text-gray-300 hover:text-gold-600 transition"
        aria-label="First page"
      >
        «
      </button>

      {/* Previous */}
      <button
        onClick={() => onChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className="px-2 py-1 rounded-md text-gray-600 disabled:text-gray-300 hover:text-gold-600 transition"
        aria-label="Previous page"
      >
        ‹
      </button>

      {/* Page numbers */}
      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
        let pageNumber: number;

        if (totalPages <= 5) {
          pageNumber = i;
        } else if (page < 3) {
          pageNumber = i;
        } else if (page > totalPages - 4) {
          pageNumber = totalPages - 5 + i;
        } else {
          pageNumber = page - 2 + i;
        }

        if (pageNumber < 0 || pageNumber >= totalPages) return null;

        const isActive = pageNumber === page;

        return (
          <button
            key={pageNumber}
            onClick={() => onChange(pageNumber)}
            className={
              "min-w-[32px] h-8 px-2 rounded-md transition " +
              (isActive
                ? "bg-gray-800 text-white"
                : "text-gray-600 hover:text-gold-600 hover:bg-gray-100")
            }
            aria-current={isActive ? "page" : undefined}
          >
            {pageNumber + 1}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => onChange(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
        className="px-2 py-1 rounded-md text-gray-600 disabled:text-gray-300 hover:text-gold-600 transition"
        aria-label="Next page"
      >
        ›
      </button>

      {/* Last */}
      <button
        onClick={goToLast}
        disabled={page >= totalPages - 1}
        className="px-2 py-1 rounded-md text-gray-600 disabled:text-gray-300 hover:text-gold-600 transition"
        aria-label="Last page"
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
