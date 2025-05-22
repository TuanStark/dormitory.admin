import { buildings, rooms, roomBookings, reports } from '../../data/mockData.ts';
import { RoomStatus, BookingStatus, ReportStatus } from '../../data/mockData.ts';
import Card from '../ui/Card.tsx';
import { useEffect, useState } from 'react';
// Stats cards for the dashboard
const DashboardOverview: React.FC = () => {

// totalAmount
// : 
// _sum
// : 
// {amount: null}
// [[Prototype]]
// : 
// Object
// totalAvailableRoom:74
// totalBooking:2
// totalBookingCompleted: 0
// totalBuildings: 15
// totalRooms : 75
// totalUsers : 13

  const [dashboardData, setDashboardData] = useState({
    totalBuildings: 0,
    totalRooms: 0,
    totalAvailableRoom: 0,  
    totalBooking: 0,
    totalBookingCompleted: 0,
    totalUsers: 0,
    totalAmount: {
      _sum: {
        amount: null
      }
    }
  });
  // Calculate summary statistics
  const totalBuildings = dashboardData.totalBuildings;
  const totalRooms = dashboardData.totalRooms;
  const availableRooms = dashboardData.totalAvailableRoom;
  const occupiedRooms = dashboardData.totalBookingCompleted;
  const totalBookings = dashboardData.totalBooking;
  const totalUsers = dashboardData.totalUsers;
  const totalAmount = dashboardData.totalAmount._sum.amount || 0;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:8000/dashboard/stats');
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();
  }, []);
  
  // These variables are used in the UI
  const pendingBookings = roomBookings.filter(booking => booking.status === BookingStatus.PENDING).length;
  const unresolvedReports = reports.filter(report => report.status === ReportStatus.UNRESOLVED).length;
  
  // Calculate occupancy rate
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Get current date
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning, Admin!</h1>
          <p className="text-gray-500">{formattedDate}</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline text-sm">
            <i className="fas fa-download mr-2"></i>
            Export Report
          </button>
          {/* <button className="btn btn-primary text-sm">
            <i className="fas fa-plus mr-2"></i>
            New Booking
          </button> */}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Buildings Card */}
        <Card className="dashboard-card relative overflow-hidden border-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <i className="fas fa-building text-blue-500 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Buildings</p>
              <div className="flex items-baseline">
                <h3 className="text-2xl font-bold text-gray-900">{totalBuildings}</h3>
                {/* Optional badge showing change */}
                <span className="ml-2 text-xs font-medium text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                  +2 new
                </span>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Rooms Card */}
        <Card className="dashboard-card relative overflow-hidden border-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <i className="fas fa-door-open text-green-500 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Available Rooms</p>
              <div className="flex items-baseline">
                <h3 className="text-2xl font-bold text-gray-900">{availableRooms}</h3>
                <span className="ml-2 text-sm text-gray-500">/ {totalRooms} total</span>
              </div>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
            <div 
              className="bg-green-500 h-1.5 rounded-full" 
              style={{ width: `${totalRooms > 0 ? (availableRooms / totalRooms) * 100 : 0}%` }}
            ></div>
          </div>
        </Card>
        
        {/* Users Card */}
        <Card className="dashboard-card relative overflow-hidden border-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <i className="fas fa-money-bill-wave text-purple-500 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <div className="flex items-baseline">
                <h3 className="text-2xl font-bold text-gray-900">
                  {typeof totalAmount === 'number' ? `${totalAmount.toLocaleString()} VND` : '0 VND'}
                </h3>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1">
            <div className="h-1.5 bg-purple-500 rounded-full"></div>
            <div className="h-1.5 bg-purple-300 rounded-full"></div>
            <div className="h-1.5 bg-gray-200 rounded-full"></div>
          </div>
        </Card>
        
        {/* Bookings Card */}
        <Card className="dashboard-card relative overflow-hidden border-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <i className="fas fa-calendar-check text-amber-500 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <div className="flex items-baseline">
                <h3 className="text-2xl font-bold text-gray-900">{totalBookings}</h3>
                <span className="ml-2 text-sm text-gray-500">
                  {dashboardData.totalBookingCompleted} completed
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <a href="/bookings" className="text-sm text-amber-600 font-medium hover:text-amber-700 transition-colors flex items-center">
              View Bookings
              <i className="fas fa-arrow-right ml-1"></i>
            </a>
          </div>
        </Card>
      </div>
      
      {/* Recent Activities and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Reports */}
        <Card className="border-none shadow-md">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-gray-900">Recent Maintenance Reports</h2>
            <a href="/reports" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
              View all
              <i className="fas fa-chevron-right ml-1 text-xs"></i>
            </a>
          </div>
          
          <div className="space-y-4">
            {reports.slice(0, 3).map(report => (
              <div key={report.id} className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 rounded-lg p-2.5 ${
                    report.status === ReportStatus.RESOLVED 
                      ? 'bg-green-100' 
                      : report.status === ReportStatus.IN_PROGRESS 
                      ? 'bg-amber-100'
                      : 'bg-red-100'
                  }`}>
                    <i className={`fas fa-tools ${
                      report.status === ReportStatus.RESOLVED 
                        ? 'text-green-500' 
                        : report.status === ReportStatus.IN_PROGRESS 
                        ? 'text-amber-500'
                        : 'text-red-500'
                    }`}></i>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-800">{report.content}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === ReportStatus.RESOLVED 
                          ? 'bg-green-100 text-green-800' 
                          : report.status === ReportStatus.IN_PROGRESS 
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Room {rooms.find(r => r.id === report.roomId)?.roomNumber}, Building {buildings.find(b => b.id === rooms.find(r => r.id === report.roomId)?.buildingId)?.name}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-xs text-gray-400">Reported on {new Date(report.reportDate).toLocaleDateString()}</p>
                      <button className="text-xs text-primary-600 hover:text-primary-700">Respond</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Rooms Status Summary */}
        <Card className="border-none shadow-md">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-gray-900">Rooms Status</h2>
            <a href="/rooms" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
              Manage Rooms
              <i className="fas fa-chevron-right ml-1 text-xs"></i>
            </a>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-xl hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <div className="rounded-full p-1.5 bg-green-100">
                  <i className="fas fa-check text-green-500 text-xs"></i>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{availableRooms}</p>
              <p className="text-xs text-green-600 mt-1">Ready to book</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <div className="rounded-full p-1.5 bg-blue-100">
                  <i className="fas fa-user text-blue-500 text-xs"></i>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{occupiedRooms}</p>
              <p className="text-xs text-blue-600 mt-1">{occupancyRate}% occupancy</p>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-xl hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">Bookings</p>
                <div className="rounded-full p-1.5 bg-amber-100">
                  <i className="fas fa-calendar-alt text-amber-500 text-xs"></i>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalBookings}</p>
              <p className="text-xs text-amber-600 mt-1">Total bookings</p>
            </div>
            
            <div className="p-4 bg-red-50 rounded-xl hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">Issues</p>
                <div className="rounded-full p-1.5 bg-red-100">
                  <i className="fas fa-exclamation-triangle text-red-500 text-xs"></i>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{unresolvedReports}</p>
              <p className="text-xs text-red-600 mt-1">Need attention</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">Occupancy Status</p>
              <p className="text-sm font-medium text-gray-900">{occupancyRate}%</p>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview; 