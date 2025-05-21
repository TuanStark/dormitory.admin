import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RoomStatus, Gender, RoomStatusType, GenderType } from '../data/mockData';
import Button from '../components/ui/Button.tsx';
import Badge from '../components/ui/Badge.tsx';
import { Room } from '../types.ts';
import fetchRooms from '../utils/api/room.ts';
import Pagination from '../components/ui/Pagination.tsx';

// Debounce function
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('');
  const [buildingFilter, setBuildingFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState('id');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    loadRooms(page);
  };

  const loadRooms = async (page = 1) => {
    const response = await fetchRooms(page, itemsPerPage, debouncedSearchTerm, sortBy, filterStatus, filterGender);
    console.log(response);
    setRooms(response.data);
    setTotalItems(response.total);
    setCurrentPage(response.pageNumber);
    setItemsPerPage(response.limitNumber);
  };
  useEffect(() => {
    
    loadRooms();
  }, [debouncedSearchTerm, sortBy, filterStatus, filterGender]);
  
  // Filter rooms based on search term and filters
  const filteredRooms = rooms.filter(room => {
    // Search filter
    const matchesSearch = 
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === '' || room.status === statusFilter;
    
    // Gender filter
    const matchesGender = genderFilter === '' || room.gender === genderFilter;
    
    // Building filter
    const matchesBuilding = buildingFilter === '' || room.buildingId === parseInt(buildingFilter);
    
    return matchesSearch && matchesStatus && matchesGender && matchesBuilding;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Phòng</h1>
        <Button 
          variant="primary"
          icon="fas fa-plus"
        >
          Thêm phòng
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm phòng..."
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
            <option value="">Tất cả trạng thái</option>
            <option value={RoomStatus.AVAILABLE}>Còn trống</option>
            <option value={RoomStatus.OCCUPIED}>Đã thuê</option>
            <option value={RoomStatus.MAINTENANCE}>Bảo trì</option>
            <option value={RoomStatus.RESERVED}>Đã đặt</option>
          </select>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="">Tất cả giới tính</option>
            <option value={Gender.MALE}>Nam</option>
            <option value={Gender.FEMALE}>Nữ</option>
            <option value={Gender.ANY}>Tất cả</option>
          </select>
          
          {/* <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={buildingFilter}
            onChange={(e) => setBuildingFilter(e.target.value)}
          >
            <option value="">Tất cả tòa nhà</option>
            {rooms.map(room => (
              <option key={room.buildingId} value={room.buildingId}>
                Tòa nhà {room.buildingId}
              </option>
            )).filter((item, index, self) => 
              index === self.findIndex((t) => t.key === item.key)
            )}
          </select> */}
        </div>
      </div>
      
      {/* Rooms Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tòa nhà</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tầng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sức chứa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới tính</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRooms.map(room => {
                return (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">Phòng {room.roomNumber}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{room.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Tòa nhà {room.buildingId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.floor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.capacity} {room.capacity > 1 ? 'người' : 'người'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="info">
                        {room.gender === Gender.MALE ? 'Nam' : 
                         room.gender === Gender.FEMALE ? 'Nữ' : 'Tất cả'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(room.price))}/tháng
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={room.status === RoomStatus.AVAILABLE ? 'success' : 
                                       room.status === RoomStatus.OCCUPIED ? 'info' :
                                       room.status === RoomStatus.MAINTENANCE ? 'warning' : 'secondary'}>
                        {room.status === RoomStatus.AVAILABLE ? 'Còn trống' : 
                         room.status === RoomStatus.OCCUPIED ? 'Đã thuê' :
                         room.status === RoomStatus.MAINTENANCE ? 'Bảo trì' : 'Đã đặt'}
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
          <p className="mt-4 text-gray-500 text-lg">Không tìm thấy phòng nào</p>
          <p className="text-gray-400">Hãy thử điều chỉnh bộ lọc của bạn</p>
        </div>
      )}
      
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Hiển thị <span className="font-medium">{filteredRooms.length}</span> trong số <span className="font-medium">{totalItems}</span> phòng
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

export default Rooms; 