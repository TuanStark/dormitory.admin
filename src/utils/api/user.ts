import { User } from '../../types';

// Mock API function to simulate fetching buildings from server
export default async function fetchUsers(
    page: number, 
    itemsPerPage: number, 
    searchTerm?: string,
    sortBy?: string,
    capacity?: string
  ): Promise<{
    data: User[];
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
      
      // Add capacity filter if provided
      if (capacity) {
        queryParams.append('capacity', capacity);
      }
      
      // Make the API call
      const response = await fetch(`http://localhost:8000/users?${queryParams.toString()}`);
      const result = await response.json();
      
      if (result.statusCode === 200 && result.data) {
        console.log(result.data);
        return {
          data: result.data.data,
          total: result.data.meta.total,
          limitNumber: result.data.meta.limitNumber,
          pageNumber: result.data.meta.pageNumber,
          totalPages: result.data.meta.totalPages
        };
      } else {
        throw new Error('Failed to fetch buildings');
      }
    } catch (error) {
      console.error('Error fetching buildings:', error);
      throw error;
    }
  }