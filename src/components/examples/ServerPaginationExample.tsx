import React, { useState } from 'react';
import { useServerPagination } from '../../hooks/useServerPagination';
import Pagination from '../ui/Pagination';
import Card from '../ui/Card';
import { roomBookings, RoomBooking } from '../../data/mockData.ts';

// Mock API function to simulate server-side pagination
const fetchBookings = async (page: number, itemsPerPage: number): Promise<{ 
  data: RoomBooking[]; 
  totalItems: number 
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, roomBookings.length);
  
  // Return paginated data
  return {
    data: roomBookings.slice(startIndex, endIndex),
    totalItems: roomBookings.length
  };
};

const ServerPaginationExample: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use the server pagination hook
  const {
    items: bookings,
    totalItems,
    currentPage,
    totalPages,
    isLoading,
    error,
    goToPage,
    refresh
  } = useServerPagination<RoomBooking>({
    fetchFn: fetchBookings,
    initialPage: 1,
    itemsPerPage: 3,
    dependencies: [searchTerm] // Re-fetch when search term changes
  });
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the search term which would trigger a re-fetch
    refresh();
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Server-Side Pagination Example</h2>
        
        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search bookings..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Search
            </button>
            <button
              type="button"
              onClick={refresh}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Refresh
            </button>
          </div>
        </form>
        
        {/* Loading and error states */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            <p>Error: {error.message}</p>
          </div>
        )}
        
        {/* Bookings table */}
        {!isLoading && !error && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Showing page {currentPage} of {totalPages} ({totalItems} total bookings)
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">#{booking.id}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Room {booking.roomId}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : booking.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination component */}
            <div className="mt-6">
              <Pagination 
                totalItems={totalItems}
                currentPage={currentPage}
                onPageChange={goToPage}
                itemsPerPage={3}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ServerPaginationExample; 