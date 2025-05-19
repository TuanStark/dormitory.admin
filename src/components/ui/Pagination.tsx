import React from 'react';
import { usePagination } from '../../hooks/usePagination';

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  maxPageNumbers?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  currentPage,
  onPageChange,
  itemsPerPage = 10,
  maxPageNumbers = 5,
  className = '',
}) => {
  const {
    totalPages,
    pageNumbers,
    hasNextPage,
    hasPreviousPage,
  } = usePagination({
    totalItems,
    initialPage: currentPage,
    itemsPerPage,
    maxPageNumbers,
  });

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* Previous page button */}
      <button
        onClick={() => hasPreviousPage && onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className={`px-3 py-1 rounded-md text-sm ${
          hasPreviousPage
            ? 'text-gray-700 hover:bg-gray-200'
            : 'text-gray-400 cursor-not-allowed'
        }`}
        aria-label="Previous page"
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      {/* Page numbers */}
      {pageNumbers.map((pageNumber, index) => (
        <React.Fragment key={index}>
          {pageNumber === -1 ? (
            <span className="px-3 py-1 text-gray-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(pageNumber)}
              className={`px-3 py-1 rounded-md text-sm ${
                pageNumber === currentPage
                  ? 'bg-primary-600 text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={`Page ${pageNumber}`}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next page button */}
      <button
        onClick={() => hasNextPage && onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`px-3 py-1 rounded-md text-sm ${
          hasNextPage
            ? 'text-gray-700 hover:bg-gray-200'
            : 'text-gray-400 cursor-not-allowed'
        }`}
        aria-label="Next page"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Pagination; 