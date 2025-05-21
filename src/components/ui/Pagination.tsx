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
  maxPageNumbers = 7,
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
  
  // Tính toán danh sách trang hiển thị giống như trong Rooms.tsx
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      // Nếu tổng số trang ít hơn hoặc bằng 7, hiển thị tất cả
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Luôn hiển thị trang đầu, trang cuối và 5 trang xung quanh trang hiện tại
    const visiblePages = [];
    
    // Trang đầu tiên
    visiblePages.push(1);
    
    // Trang hiện tại và 2 trang trước/sau
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    
    // Điều chỉnh nếu đang ở gần đầu hoặc cuối
    if (currentPage <= 4) {
      endPage = 5;
    } else if (currentPage >= totalPages - 3) {
      startPage = totalPages - 4;
    }
    
    // Thêm dấu ... nếu cần
    if (startPage > 2) {
      visiblePages.push(-1); // -1 đại diện cho dấu ...
    }
    
    // Thêm các trang giữa
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }
    
    // Thêm dấu ... nếu cần
    if (endPage < totalPages - 1) {
      visiblePages.push(-2); // -2 đại diện cho dấu ... thứ hai
    }
    
    // Trang cuối cùng
    visiblePages.push(totalPages);
    
    return visiblePages;
  };

  const calculatedPageNumbers = getPageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between sm:justify-center gap-4 ${className}`}>
      <div className="flex items-center">
        <nav className="inline-flex rounded-xl shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-100" aria-label="Phân trang">
          {/* Nút đến trang đầu tiên */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center justify-center w-10 h-10 text-sm font-medium transition-all duration-300 ease-in-out
              ${currentPage === 1
                ? 'bg-gray-50 text-gray-300 cursor-not-allowed border-r border-gray-100' 
                : 'bg-white text-gray-600 hover:bg-gradient-to-b hover:from-primary-50 hover:to-primary-100 hover:text-primary-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset border-r border-gray-100 active:scale-95'
              }`}
            aria-label="Trang đầu tiên"
          >
            <span className="sr-only">Trang đầu tiên</span>
            <i className="fas fa-angle-double-left"></i>
          </button>
          
          {/* Nút Trước */}
          <button
            onClick={() => hasPreviousPage && onPageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
            className={`relative inline-flex items-center justify-center w-10 h-10 text-sm font-medium transition-all duration-300 ease-in-out
              ${!hasPreviousPage 
                ? 'bg-gray-50 text-gray-300 cursor-not-allowed border-r border-gray-100' 
                : 'bg-white text-gray-600 hover:bg-gradient-to-b hover:from-primary-50 hover:to-primary-100 hover:text-primary-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset border-r border-gray-100 active:scale-95'
              }`}
            aria-label="Trang trước"
          >
            <span className="sr-only">Trang trước</span>
            <i className="fas fa-chevron-left text-xs"></i>
          </button>

          {/* Các số trang */}
          {calculatedPageNumbers.map((pageNumber, index) => {
            if (pageNumber === -1 || pageNumber === -2) {
              return (
                <span 
                  key={`ellipsis-${index}`} 
                  className="relative inline-flex items-center justify-center w-10 h-10 border-r border-gray-100 bg-white text-sm font-medium text-gray-400"
                >
                  <div className="flex space-x-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  </div>
                </span>
              );
            }
            
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`relative inline-flex items-center justify-center w-10 h-10 text-sm font-medium transition-all duration-300 ease-in-out border-r border-gray-100
                  ${pageNumber === currentPage
                    ? 'z-10 bg-gradient-to-b from-primary-600 to-primary-700 text-white hover:from-primary-500 hover:to-primary-600 shadow-inner'
                    : 'bg-white text-gray-600 hover:bg-gradient-to-b hover:from-primary-50 hover:to-primary-100 hover:text-primary-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset active:scale-95'
                  }`}
                aria-label={`Trang ${pageNumber}`}
                aria-current={pageNumber === currentPage ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Nút Tiếp */}
          <button
            onClick={() => hasNextPage && onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className={`relative inline-flex items-center justify-center w-10 h-10 text-sm font-medium transition-all duration-300 ease-in-out
              ${!hasNextPage 
                ? 'bg-gray-50 text-gray-300 cursor-not-allowed border-r border-gray-100' 
                : 'bg-white text-gray-600 hover:bg-gradient-to-b hover:from-primary-50 hover:to-primary-100 hover:text-primary-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset border-r border-gray-100 active:scale-95'
              }`}
            aria-label="Trang sau"
          >
            <span className="sr-only">Trang sau</span>
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
          
          {/* Nút đến trang cuối cùng */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center justify-center w-10 h-10 text-sm font-medium transition-all duration-300 ease-in-out
              ${currentPage === totalPages
                ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                : 'bg-white text-gray-600 hover:bg-gradient-to-b hover:from-primary-50 hover:to-primary-100 hover:text-primary-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset active:scale-95'
              }`}
            aria-label="Trang cuối cùng"
          >
            <span className="sr-only">Trang cuối cùng</span>
            <i className="fas fa-angle-double-right"></i>
          </button>
        </nav>
      </div>
      
      <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-gray-100">
        <span className="hidden sm:inline">Trang </span>
        <span className="font-medium text-primary-600">{currentPage}</span>
        <span className="mx-1">/</span>
        <span className="font-medium">{totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination; 