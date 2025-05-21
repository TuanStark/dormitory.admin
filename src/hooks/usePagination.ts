import { useState, useMemo } from 'react';

interface PaginationOptions {
  totalItems: number;
  initialPage?: number;
  itemsPerPage?: number;
  maxPageNumbers?: number;
}

interface PaginationResult {
  // Current state
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  
  // Items for current page
  currentItems: number[];
  startIndex: number;
  endIndex: number;
  
  // Page navigation
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  
  // Pagination UI helpers
  pageNumbers: number[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function usePagination({
  totalItems,
  initialPage = 1,
  itemsPerPage = 10,
  maxPageNumbers = 9,
}: PaginationOptions): PaginationResult {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Ensure current page is within valid range
  useMemo(() => {
    if (currentPage < 1) {
      setCurrentPage(1);
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  
  // Calculate start and end indices
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);
  
  // Generate array of indices for current page
  const currentItems = Array.from(
    { length: endIndex - startIndex + 1 },
    (_, i) => startIndex + i
  );
  
  // Navigation functions
  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToFirstPage = () => {
    setCurrentPage(1);
  };
  
  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };
  
  // Generate page numbers for pagination UI with improved logic
  const pageNumbers = useMemo(() => {
    const pageArr: number[] = [];
    
    if (totalPages <= maxPageNumbers) {
      // If total pages is less than max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageArr.push(i);
      }
    } else {
      // Cải thiện logic hiển thị trang
      // Hiển thị nhiều trang hơn xung quanh trang hiện tại
      // Đảm bảo hiển thị ít nhất 4 trang sau trang hiện tại nếu có thể
      
      // Tính toán số trang hiển thị bên trái và phải trang hiện tại
      const siblingsCount = Math.floor((maxPageNumbers - 3) / 2); 
      
      // Tính toán trang bắt đầu và kết thúc
      let startPage = Math.max(2, currentPage - Math.floor(siblingsCount / 2));
      let endPage = Math.min(totalPages - 1, currentPage + siblingsCount);
      
      // Đảm bảo hiển thị nhiều trang phía sau trang hiện tại
      // Nếu người dùng đang ở gần đầu danh sách
      if (currentPage < 5) {
        endPage = Math.min(totalPages - 1, 7); // Hiển thị đến trang 7 nếu có thể
        startPage = 2; // Bắt đầu từ trang 2
      }
      
      // Nếu người dùng đang ở gần cuối danh sách
      if (currentPage > totalPages - 5) {
        startPage = Math.max(2, totalPages - 6); // Hiển thị từ totalPages-6
        endPage = totalPages - 1;
      }
      
      // Điều chỉnh để luôn hiển thị đủ số trang theo maxPageNumbers
      if (endPage - startPage + 3 < maxPageNumbers) { // +3 cho trang đầu, cuối và trang hiện tại
        if (startPage === 2) {
          // Nếu đã ở gần đầu, mở rộng về phía cuối
          endPage = Math.min(totalPages - 1, startPage + maxPageNumbers - 3);
        } else if (endPage === totalPages - 1) {
          // Nếu đã ở gần cuối, mở rộng về phía đầu
          startPage = Math.max(2, endPage - (maxPageNumbers - 3));
        }
      }
      
      // Luôn hiển thị trang đầu tiên
      pageArr.push(1);
      
      // Thêm dấu ... nếu cần
      if (startPage > 2) {
        pageArr.push(-1); // -1 đại diện cho dấu ...
      }
      
      // Thêm các trang giữa
      for (let i = startPage; i <= endPage; i++) {
        pageArr.push(i);
      }
      
      // Thêm dấu ... nếu cần
      if (endPage < totalPages - 1) {
        pageArr.push(-1); // -1 đại diện cho dấu ...
      }
      
      // Luôn hiển thị trang cuối cùng
      if (endPage < totalPages) {
        pageArr.push(totalPages);
      }
    }
    
    return pageArr;
  }, [currentPage, totalPages, maxPageNumbers]);
  
  return {
    currentPage,
    totalPages,
    itemsPerPage,
    currentItems,
    startIndex,
    endIndex,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    pageNumbers,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
} 