import { BookingStatus, BookingStatusType, buildings, rooms, roomBookings, users } from '../../data/mockData.ts';
import Card from '../ui/Card.tsx';

const RecentBookings: React.FC = () => {
  // Get the latest 5 bookings
  const recentBookings = [...roomBookings]
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
    .slice(0, 5);
  
  // Function to get status badge styling
  const getStatusBadgeClass = (status: BookingStatusType): string => {
    switch (status) {
      case BookingStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case BookingStatus.PENDING:
        return 'bg-amber-100 text-amber-800';
      case BookingStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case BookingStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      case BookingStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Function to get the room details
  const getRoomDetails = (roomId: number): { roomNumber: string; buildingName: string } => {
    const room = rooms.find(r => r.id === roomId);
    const building = buildings.find(b => b.id === room?.buildingId);
    
    return {
      roomNumber: room?.roomNumber || 'Unknown',
      buildingName: building?.name || 'Unknown'
    };
  };

  // Function to get student details from user id
  const getStudentDetails = (userId: number): { name: string; email: string } => {
    const user = users.find(u => u.id === userId);
    
    return {
      name: user?.fullName || 'Unknown Student',
      email: user?.email || 'No email'
    };
  };

  // Function to calculate booking duration in months
  const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffYears = end.getFullYear() - start.getFullYear();
    const diffMonths = end.getMonth() - start.getMonth();
    
    return diffYears * 12 + diffMonths;
  };

  return (
    <Card className="border-none shadow-md">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        <a href="/bookings" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
          View all
          <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </a>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentBookings.map((booking) => {
              const roomDetails = getRoomDetails(booking.roomId);
              const studentDetails = getStudentDetails(booking.userId);
              const duration = calculateDuration(booking.startDate, booking.endDate);
              
              return (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        <i className="fas fa-user text-xs"></i>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{studentDetails.name}</div>
                        <div className="text-xs text-gray-500">{studentDetails.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Room {roomDetails.roomNumber}</div>
                    <div className="text-xs text-gray-500">{roomDetails.buildingName}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{duration} months</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900">
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentBookings; 