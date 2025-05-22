import { Booking } from '../../types';

export default async function fetchBookings(
    page: number, 
    itemsPerPage: number, 
    searchTerm?: string,
    sortBy?: string,
    status?: string,
    building?: string,
    checkInDate?: string,
  ): Promise<{
    data: Booking[];
    total: number;
    limitNumber: number;
    pageNumber: number;
    totalPages: number;
  }> {
    try {
      // Build the query string
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString()
      });
      
      // Add search term if provided
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      // Add sort parameter if provided
      if (sortBy) {
        queryParams.append('sort', sortBy);
      }
      
      // Add status filter if provided
      if (status) {
        queryParams.append('status', status);
      }

      // Add building filter if provided
      if (building) {
        queryParams.append('building', building);
      }

      // Add checkInDate filter if provided
      if (checkInDate) {
        queryParams.append('checkInDate', checkInDate);
      }
      
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      
      // Make the API call
      const response = await fetch(`http://localhost:8000/room-booking/all?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Log response status để debug

      // Kiểm tra status code
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Xử lý nhiều cấu trúc dữ liệu khác nhau
      let bookingsData = [];
      let totalItems = 0;
      let limit = itemsPerPage;
      let currentPage = page;
      let totalPages = 1;
      
      // Trường hợp 1: Cấu trúc chuẩn { statusCode, data: { data, meta } }
      if (result.statusCode === 200 && result.data) {
        if (result.data.data && Array.isArray(result.data.data)) {
          bookingsData = result.data.data;
          
          if (result.data.meta) {
            totalItems = result.data.meta.total || 0;
            limit = result.data.meta.limitNumber || itemsPerPage;
            currentPage = result.data.meta.pageNumber || page;
            totalPages = result.data.meta.totalPages || Math.ceil(totalItems / limit);
          }
        }
      } 
      // Trường hợp 2: Cấu trúc { data, meta } trực tiếp
      else if (result.data && Array.isArray(result.data)) {
        bookingsData = result.data;
        
        if (result.meta) {
          totalItems = result.meta.total || 0;
          limit = result.meta.limitNumber || itemsPerPage;
          currentPage = result.meta.pageNumber || page;
          totalPages = result.meta.totalPages || Math.ceil(totalItems / limit);
        }
      }
      // Trường hợp 3: Mảng dữ liệu trực tiếp
      else if (Array.isArray(result)) {
        bookingsData = result;
        totalItems = result.length;
        totalPages = 1;
      }
      // Trường hợp 4: Cấu trúc khác không mong đợi
      else {
        // Trả về dữ liệu trống thay vì throw error
        return {
          data: [],
          total: 0,
          limitNumber: itemsPerPage,
          pageNumber: page,
          totalPages: 0
        };
      }
      
      return {
        data: bookingsData,
        total: totalItems,
        limitNumber: limit,
        pageNumber: currentPage,
        totalPages: totalPages
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Trả về dữ liệu trống thay vì throw error
      return {
        data: [],
        total: 0,
        limitNumber: itemsPerPage,
        pageNumber: page,
        totalPages: 0
      };
    }
  }