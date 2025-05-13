import { useState } from 'react';
import { reports, users, rooms, buildings, ReportStatus, ReportType } from '../data/mockData';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  
  // Filter reports based on search term and filters
  const filteredReports = reports.filter(report => {
    // Get the associated user and room for this report
    const user = users.find(u => u.id === report.userId || u.id === report.senderId);
    const room = rooms.find(r => r.id === report.roomId);
    const building = room ? buildings.find(b => b.id === room.buildingId) : null;
    
    // Search filter
    const matchesSearch = searchTerm === '' || (
      (report.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (report.description?.toLowerCase() || report.content?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user?.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (room?.roomNumber?.toString() || '').includes(searchTerm.toLowerCase()) ||
      (building?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    
    // Status filter
    const matchesStatus = statusFilter === '' || report.status === statusFilter;
    
    // Type filter
    const matchesType = typeFilter === '' || report.type === typeFilter;
    
    // Building filter
    const matchesBuilding = buildingFilter === '' || 
      (room && building && building.id.toString() === buildingFilter);
    
    return matchesSearch && matchesStatus && matchesType && matchesBuilding;
  });

  // Function to get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case ReportStatus.RESOLVED:
        return 'success';
      case ReportStatus.UNRESOLVED:
        return 'danger';
      case ReportStatus.IN_PROGRESS:
        return 'warning';
      default:
        return 'secondary';
    }
  };

  // Function to get type badge variant
  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case ReportType.MAINTENANCE:
        return 'info';
      case ReportType.COMPLAINT:
        return 'danger';
      case ReportType.REQUEST:
        return 'warning';
      case ReportType.FEEDBACK:
        return 'secondary';
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

  // Function to calculate time elapsed
  const getTimeElapsed = (dateString) => {
    const reportDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - reportDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    } else if (diffInDays < 365) {
      return `${Math.floor(diffInDays / 30)} months ago`;
    } else {
      return `${Math.floor(diffInDays / 365)} years ago`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Maintenance</h1>
        <Button 
          variant="primary"
          icon="fas fa-plus"
        >
          Create Report
        </Button>
      </div>
      
      {/* Dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <i className="fas fa-clipboard-list text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Reports</h3>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <i className="fas fa-exclamation-circle text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Unresolved</h3>
              <p className="text-2xl font-bold text-red-600">
                {reports.filter(r => r.status === ReportStatus.UNRESOLVED).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <i className="fas fa-tools text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">In Progress</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {reports.filter(r => r.status === ReportStatus.IN_PROGRESS).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <i className="fas fa-check-circle text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Resolved</h3>
              <p className="text-2xl font-bold text-green-600">
                {reports.filter(r => r.status === ReportStatus.RESOLVED).length}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Search and filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports..."
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
            <option value={ReportStatus.RESOLVED}>Resolved</option>
            <option value={ReportStatus.UNRESOLVED}>Unresolved</option>
            <option value={ReportStatus.IN_PROGRESS}>In Progress</option>
          </select>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value={ReportType.MAINTENANCE}>Maintenance</option>
            <option value={ReportType.COMPLAINT}>Complaint</option>
            <option value={ReportType.REQUEST}>Request</option>
            <option value={ReportType.FEEDBACK}>Feedback</option>
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
        </div>
      </Card>
      
      {/* Reports Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room/Building</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => {
                const user = users.find(u => u.id === report.userId || u.id === report.senderId);
                const room = rooms.find(r => r.id === report.roomId);
                const building = room ? buildings.find(b => b.id === room.buildingId) : null;
                
                return (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{report.title || report.content}</div>
                      <div className="text-xs text-gray-500 max-w-xs truncate">{report.description || report.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getTypeBadgeVariant(report.type)}>
                        {report.type || 'Maintenance'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                          {user && user.fullName.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user && user.fullName}</div>
                          <div className="text-xs text-gray-500">{user && user.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room ? `Room ${room.roomNumber}` : 'N/A'}
                      {building && <div className="text-xs text-gray-500">{building.name}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{formatDate(report.reportDate)}</div>
                      <div className="text-xs text-gray-500">{getTimeElapsed(report.reportDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(report.status)}>
                        {report.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {report.priority === 'high' && <span className="text-red-600 font-medium">High</span>}
                      {report.priority === 'medium' && <span className="text-yellow-600 font-medium">Medium</span>}
                      {report.priority === 'low' && <span className="text-green-600 font-medium">Low</span>}
                      {!report.priority && <span className="text-gray-600 font-medium">Normal</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-3">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 mr-3">
                        <i className="fas fa-edit"></i>
                      </button>
                      {report.status !== ReportStatus.RESOLVED && (
                        <button className="text-green-500 hover:text-green-700">
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredReports.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <i className="fas fa-clipboard-check text-gray-300 text-5xl"></i>
            <p className="mt-4 text-gray-500 text-lg">No reports found</p>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        )}
      </Card>
      
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredReports.length}</span> of <span className="font-medium">{reports.length}</span> reports
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

export default Reports; 