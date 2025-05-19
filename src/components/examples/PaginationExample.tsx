import React, { useState } from 'react';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../ui/Pagination';
import Card from '../ui/Card';
import { roomBookings, RoomBooking } from '../../data/mockData';

const PaginationExample: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Example 1: Using the pagination hook directly
  const {
    currentItems: itemIndices,
    totalPages,
    startIndex,
    endIndex,
  } = usePagination({
    totalItems: roomBookings.length,
    initialPage: currentPage,
    itemsPerPage,
  });
  
  // Get the actual items for the current page
  const currentBookings = itemIndices.map(index => roomBookings[index]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Pagination Example</h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1}-{endIndex + 1} of {roomBookings.length} bookings
          </p>
        </div>
        
        {/* Bookings table */}
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
              {currentBookings.map((booking: RoomBooking) => (
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
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination component */}
        <div className="mt-6">
          <Pagination 
            totalItems={roomBookings.length}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </Card>
    </div>
  );
};

export default PaginationExample; 