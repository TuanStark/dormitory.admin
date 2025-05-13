import { useState } from 'react';
import { Link } from 'react-router-dom';
import { rooms, buildings, RoomStatus, Gender } from '../data/mockData';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Rooms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  
  // Filter rooms based on search term and filters
  const filteredRooms = rooms.filter(room => {
    // Search filter
    const matchesSearch = 
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === '' || room.status === statusFilter;
    
    // Gender filter
    const matchesGender = genderFilter === '' || room.gender === genderFilter;
    
    // Building filter
    const matchesBuilding = buildingFilter === '' || room.buildingId === parseInt(buildingFilter);
    
    return matchesSearch && matchesStatus && matchesGender && matchesBuilding;
  });

  // Get room status badge variant
  const getRoomStatusBadgeVariant = (status) => {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return 'success';
      case RoomStatus.OCCUPIED:
        return 'info';
      case RoomStatus.MAINTENANCE:
        return 'warning';
      case RoomStatus.RESERVED:
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  // Get gender badge variant
  const getGenderBadgeVariant = (gender) => {
    switch (gender) {
      case Gender.MALE:
        return 'info';
      case Gender.FEMALE:
        return 'danger';
      case Gender.ANY:
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
        <Button 
          variant="primary"
          icon="fas fa-plus"
        >
          Add Room
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search rooms..."
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
            <option value={RoomStatus.AVAILABLE}>Available</option>
            <option value={RoomStatus.OCCUPIED}>Occupied</option>
            <option value={RoomStatus.MAINTENANCE}>Maintenance</option>
            <option value={RoomStatus.RESERVED}>Reserved</option>
          </select>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="">All Genders</option>
            <option value={Gender.MALE}>Male</option>
            <option value={Gender.FEMALE}>Female</option>
            <option value={Gender.ANY}>Any</option>
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
      </div>
      
      {/* Rooms Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRooms.map(room => {
                const building = buildings.find(b => b.id === room.buildingId);
                
                return (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">Room {room.roomNumber}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{room.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {building?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.floor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.capacity} {room.capacity > 1 ? 'persons' : 'person'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getGenderBadgeVariant(room.gender)}>
                        {room.gender}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${room.price}/month
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getRoomStatusBadgeVariant(room.status)}>
                        {room.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/rooms/${room.id}`} className="text-primary-600 hover:text-primary-900 mr-3">
                        <i className="fas fa-eye"></i>
                      </Link>
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
      </div>
      
      {filteredRooms.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="fas fa-door-open text-gray-300 text-5xl"></i>
          <p className="mt-4 text-gray-500 text-lg">No rooms found</p>
          <p className="text-gray-400">Try adjusting your filters</p>
        </div>
      )}
      
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredRooms.length}</span> of <span className="font-medium">{rooms.length}</span> rooms
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

export default Rooms; 