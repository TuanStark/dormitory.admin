import { roomBookings, users, rooms, buildings, BookingStatus } from '../../data/mockData';

const RecentBookings = () => {
  // Get the 5 most recent bookings
  const recentBookings = [...roomBookings]
    .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
    .slice(0, 5);

  // Function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case BookingStatus.APPROVED:
        return 'status-badge status-badge-success';
      case BookingStatus.PENDING:
        return 'status-badge status-badge-warning';
      case BookingStatus.REJECTED:
        return 'status-badge status-badge-danger';
      case BookingStatus.CANCELLED:
        return 'status-badge status-badge-secondary';
      case BookingStatus.COMPLETED:
        return 'status-badge status-badge-info';
      default:
        return 'status-badge status-badge-secondary';
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
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        <a href="/bookings" className="text-sm text-primary-600 hover:text-primary-700">
          View all
        </a>
      </div>

      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Student</th>
              <th className="table-header-cell">Room</th>
              <th className="table-header-cell">Building</th>
              <th className="table-header-cell">Booking Date</th>
              <th className="table-header-cell">Check-in</th>
              <th className="table-header-cell">Status</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {recentBookings.map((booking) => {
              const user = users.find((u) => u.id === booking.userId);
              const room = rooms.find((r) => r.id === booking.roomId);
              const building = buildings.find((b) => b.id === room?.buildingId);

              return (
                <tr key={booking.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {user?.fullName.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{user?.fullName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">Room {room?.roomNumber}</td>
                  <td className="table-cell">{building?.name}</td>
                  <td className="table-cell">{formatDate(booking.bookingDate)}</td>
                  <td className="table-cell">{formatDate(booking.checkInDate)}</td>
                  <td className="table-cell">
                    <span className={getStatusBadgeClass(booking.status)}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings; 