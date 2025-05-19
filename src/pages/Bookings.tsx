import { useState } from 'react';
import { roomBookings, users, rooms, buildings, BookingStatus } from '../data/mockData';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [buildingFilter, setBuildingFilter] = useState('');
  
  // Filter bookings based on search term and filters
  const filteredBookings = roomBookings.filter(booking => {
    // Get the associated user and room for this booking
    const user = users.find(u => u.id === booking.userId);
    const room = rooms.find(r => r.id === booking.roomId);
    const building = room ? buildings.find(b => b.id === room.buildingId) : null;
    
    // Search filter
    const matchesSearch = (
      (user && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (room && room.roomNumber.toString().includes(searchTerm.toLowerCase())) ||
      (building && building.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Status filter
    const matchesStatus = statusFilter === '' || booking.status === statusFilter;
    
    // Building filter
    const matchesBuilding = buildingFilter === '' || 
      (room && building && building.id.toString() === buildingFilter);
    
    // Date range filter
    const bookingDate = new Date(booking.bookingDate);
    const startDateMatch = !dateRange.startDate || bookingDate >= new Date(dateRange.startDate);
    const endDateMatch = !dateRange.endDate || bookingDate <= new Date(dateRange.endDate);
    const matchesDateRange = startDateMatch && endDateMatch;
    
    return matchesSearch && matchesStatus && matchesBuilding && matchesDateRange;
  });

  // Function to get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case BookingStatus.APPROVED:
        return 'success';
      case BookingStatus.PENDING:
        return 'warning';
      case BookingStatus.REJECTED:
        return 'danger';
      case BookingStatus.CANCELLED:
        return 'secondary';
      case BookingStatus.COMPLETED:
        return 'info';
      default:
        return 'secondary';
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <Button 
          variant="primary"
          icon="fas fa-plus"
        >
          Add Booking
        </Button>
      </div>
      
      {/* Search and filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value={BookingStatus.APPROVED}>Approved</option>
            <option value={BookingStatus.PENDING}>Pending</option>
            <option value={BookingStatus.REJECTED}>Rejected</option>
            <option value={BookingStatus.CANCELLED}>Cancelled</option>
            <option value={BookingStatus.COMPLETED}>Completed</option>
          </select>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={buildingFilter}
            onChange={(e) => setBuildingFilter(e.target.value)}
          >
            <option value="">All Buildings</option>
            {buildings.map(building => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              icon="fas fa-calendar-alt"
            >
              Filter by Date
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Bookings Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => {
                const user = users.find(u => u.id === booking.userId);
                const room = rooms.find(r => r.id === booking.roomId);
                const building = room ? buildings.find(b => b.id === room.buildingId) : null;
                
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                          {user && user.fullName.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user && user.fullName}</div>
                          <div className="text-xs text-gray-500">{user && user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room ? `Room ${room.roomNumber}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {building ? building.name : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.bookingDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.checkInDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.checkOutDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-3">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 mr-3">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <i className="fas fa-calendar-alt text-gray-300 text-5xl"></i>
            <p className="mt-4 text-gray-500 text-lg">No bookings found</p>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        )}
      </Card>
      
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredBookings.length}</span> of <span className="font-medium">{roomBookings.length}</span> bookings
        </div>
        
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bookings; 