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
  maxPageNumbers = 5,
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
  
  // Generate page numbers for pagination UI
  const pageNumbers = useMemo(() => {
    const pageArr: number[] = [];
    
    if (totalPages <= maxPageNumbers) {
      // If total pages is less than max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageArr.push(i);
      }
    } else {
      // Calculate range of page numbers to show
      const halfMax = Math.floor(maxPageNumbers / 2);
      let startPage = Math.max(1, currentPage - halfMax);
      let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);
      
      // Adjust if at the end
      if (endPage - startPage + 1 < maxPageNumbers) {
        startPage = Math.max(1, endPage - maxPageNumbers + 1);
      }
      
      // Always show first page
      if (startPage > 1) {
        pageArr.push(1);
        if (startPage > 2) {
          pageArr.push(-1); // -1 represents ellipsis
        }
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageArr.push(i);
      }
      
      // Always show last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageArr.push(-1); // -1 represents ellipsis
        }
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