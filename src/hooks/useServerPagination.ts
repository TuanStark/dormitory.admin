import { useState, useEffect, useCallback } from 'react';

interface ServerPaginationOptions<T> {
  fetchFn: (page: number, itemsPerPage: number) => Promise<{
    data: T[];
    totalItems: number;
  }>;
  initialPage?: number;
  itemsPerPage?: number;
  maxPageNumbers?: number;
  dependencies?: any[];
}

interface ServerPaginationResult<T> {
  // Data
  items: T[];
  totalItems: number;
  
  // Pagination state
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  
  // Loading state
  isLoading: boolean;
  error: Error | null;
  
  // Navigation
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  
  // Refresh data
  refresh: () => void;
  
  // UI helpers
  pageNumbers: number[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function useServerPagination<T>({
  fetchFn,
  initialPage = 1,
  itemsPerPage = 10,
  maxPageNumbers = 5,
  dependencies = [],
}: ServerPaginationOptions<T>): ServerPaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [items, setItems] = useState<T[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn(currentPage, itemsPerPage);
      setItems(result.data);
      setTotalItems(result.totalItems);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, fetchFn, refreshCounter]);
  
  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);
  
  // Navigation functions
  const goToPage = useCallback((page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);
  
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);
  
  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);
  
  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);
  
  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);
  
  // Refresh function
  const refresh = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);
  
  // Generate page numbers for pagination UI
  const pageNumbers = (() => {
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
  })();
  
  return {
    items,
    totalItems,
    currentPage,
    totalPages,
    itemsPerPage,
    isLoading,
    error,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    refresh,
    pageNumbers,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
} 