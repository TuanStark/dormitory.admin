import { useState, useEffect } from 'react';
import { BookingStatus } from '../data/mockData';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Booking, User, Room, Building } from '../types';
import fetchBookings from '../utils/api/booking';
import fetchUsers from '../utils/api/user';
import fetchRooms from '../utils/api/room';
import api from '../utils/createApiClient';
import Pagination from '../components/ui/Pagination';
import { toast } from 'react-toastify';

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [buildingFilter, setBuildingFilter] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Fetch bookings data
  const fetchBookingsData = async () => {
    setLoading(true);
    try {
      const response = await fetchBookings(currentPage, itemsPerPage, searchTerm, statusFilter, buildingFilter);
      setBookings(response.data);
      setTotalItems(response.total);
      setCurrentPage(response.pageNumber);
      setItemsPerPage(response.limitNumber);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Không thể tải dữ liệu đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users data
  const fetchUsersData = async () => {
    try {
      const response = await fetchUsers(1, 100); // Lấy tối đa 100 users
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch rooms data
  const fetchRoomsData = async () => {
    try {
      const response = await fetchRooms(1, 100); // Lấy tối đa 100 phòng
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  // Fetch buildings data
  const fetchBuildingsData = async () => {
    try {
      const response = await api.get<any>('/building');
      if (response.data && Array.isArray(response.data.data)) {
        setBuildings(response.data.data);
      } else if (Array.isArray(response.data)) {
        setBuildings(response.data);
      }
    } catch (error) {
      console.error('Error fetching buildings:', error);
    }
  };

  // Load all necessary data
  useEffect(() => {
    fetchUsersData();
    fetchRoomsData();
    fetchBuildingsData();
  }, []);

  // Fetch bookings when filters change
  useEffect(() => {
    fetchBookingsData();
  }, [currentPage, itemsPerPage, searchTerm, statusFilter, buildingFilter]);

  // Handle search and filter
  const handleSearch = () => {
    setCurrentPage(1);
    fetchBookingsData();
  };

  // Function to get status badge variant
  const getStatusBadgeVariant = (status: string) => {
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
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Find user, room and building for a booking
  const getUserById = (userId: number) => users.find(u => u.id === userId);
  const getRoomById = (roomId: number) => rooms.find(r => r.id === roomId);
  const getBuildingById = (buildingId: number) => buildings.find(b => b.id === buildingId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
              setTimeout(fetchBookingsData, 0);
            }}
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
            onChange={(e) => {
              setBuildingFilter(e.target.value);
              setCurrentPage(1);
              setTimeout(fetchBookingsData, 0);
            }}
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
              onClick={handleSearch}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Bookings Table */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => {
                    const user = getUserById(booking.userId);
                    const room = getRoomById(booking.roomId);
                    const building = room ? getBuildingById(room.buildingId) : null;
                    
                    return (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{booking.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                              {user ? user.fullName.charAt(0) : '?'}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{user ? user.fullName : 'Unknown User'}</div>
                              <div className="text-xs text-gray-500">{user ? user.email : 'N/A'}</div>
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
                          {booking.stayDuration ? `${booking.stayDuration} ngày` : 'N/A'}
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
            
            {bookings.length === 0 && !loading && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <i className="fas fa-calendar-alt text-gray-300 text-5xl"></i>
                <p className="mt-4 text-gray-500 text-lg">No bookings found</p>
                <p className="text-gray-400">Try adjusting your filters</p>
              </div>
            )}
          </>
        )}
      </Card>
      
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{bookings.length}</span> of <span className="font-medium">{totalItems}</span> bookings
        </div>
        
        <Pagination 
          totalItems={totalItems}
          currentPage={currentPage}
          onPageChange={goToPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default Bookings; 