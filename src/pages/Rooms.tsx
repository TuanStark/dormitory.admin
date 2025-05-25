import { useState, useEffect } from 'react';
import Button from '../components/ui/Button.tsx';
import { Room } from '../types.ts';
import fetchRooms from '../utils/api/room.ts';
import Pagination from '../components/ui/Pagination.tsx';
import RoomTable from '../components/rooms/RoomTable.tsx';
import RoomFilters from '../components/rooms/RoomFilters.tsx';
import RoomViewModal from '../components/rooms/RoomViewModal.tsx';
import RoomEditModal from '../components/rooms/RoomEditModal.tsx';
import RoomDeleteModal from '../components/rooms/RoomDeleteModal.tsx';
import RoomAddModal from '../components/rooms/RoomAddModal.tsx';

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
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    loadRooms(page);
  };

  const loadRooms = async (page = 1) => {
    const response = await fetchRooms(page, itemsPerPage, debouncedSearchTerm, sortBy, filterStatus, filterGender);
    setRooms(response.data);
    setTotalItems(response.total);
    setCurrentPage(response.pageNumber);
    setItemsPerPage(response.limitNumber);
  };
  
  useEffect(() => {
    loadRooms();
  }, [debouncedSearchTerm, sortBy, filterStatus, filterGender]);
  
  // Handler functions for room actions
  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
    setViewModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setEditModalOpen(true);
  };

  const handleDeleteRoom = (room: Room) => {
    setSelectedRoom(room);
    setDeleteModalOpen(true);
  };

  const handleAddRoom = () => {
    setAddModalOpen(true);
  };

  const handleRoomAction = () => {
    loadRooms(currentPage); // Reload rooms after any action
  };
  
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
          onClick={handleAddRoom}
        >
          Thêm phòng
        </Button>
      </div>
      
      {/* Search and filters */}
      <RoomFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        genderFilter={genderFilter}
        buildingFilter={buildingFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onGenderChange={setGenderFilter}
        onBuildingChange={setBuildingFilter}
      />
      
      {/* Rooms Table */}
      <RoomTable
        rooms={filteredRooms}
        onViewRoom={handleViewRoom}
        onEditRoom={handleEditRoom}
        onDeleteRoom={handleDeleteRoom}
      />
      
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

      {/* Room Modals */}
      <RoomViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        room={selectedRoom}
      />

      <RoomEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onEditSuccess={handleRoomAction}
        room={selectedRoom}
      />

      <RoomDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDeleteSuccess={handleRoomAction}
        room={selectedRoom}
      />

      <RoomAddModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddSuccess={handleRoomAction}
      />
    </div>
  );
};

export default Rooms; 