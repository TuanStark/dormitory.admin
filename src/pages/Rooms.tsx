import { useState, useEffect } from 'react';
import Button from '../components/ui/Button.tsx';
import { Room } from '../types.ts';
import Pagination from '../components/ui/Pagination.tsx';
import RoomTable from '../components/rooms/RoomTable.tsx';
import RoomFilters from '../components/rooms/RoomFilters.tsx';
import RoomViewModal from '../components/rooms/RoomViewModal.tsx';
import RoomEditModal from '../components/rooms/RoomEditModal.tsx';
import RoomDeleteModal from '../components/rooms/RoomDeleteModal.tsx';
import RoomAddModal from '../components/rooms/RoomAddModal.tsx';
import useQuery from '../hooks/useQuery';
import useFecthApi from '../hooks/useFecthApi';
import useCreateApi from '../hooks/useCreateApi';
import useUpdateApi from '../hooks/useUpdateApi';
import useDeleteApi from '../hooks/useDeleteApi';
import { toast } from 'react-toastify';

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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('');
  const [buildingFilter, setBuildingFilter] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Khởi tạo query và lấy dữ liệu
  const [query, updateQuery, resetQuery] = useQuery({
    page: 1,
    limit: 5,
    search: debouncedSearchTerm,
    status: statusFilter,
    gender: genderFilter,
    building: buildingFilter
  });

  // Sử dụng các hooks API
  const [rooms, meta, refetchRooms] = useFecthApi('room', query, {});
  const { createData, loading: createLoading, error: createError, success: createSuccess } = useCreateApi();
  const { updateData, loading: updateLoading, error: updateError, success: updateSuccess } = useUpdateApi();
  const { deleteData, loading: deleteLoading, error: deleteError, success: deleteSuccess } = useDeleteApi();
  
  // Hiển thị thông báo lỗi và thành công
  useEffect(() => {
    if (createError) toast.error(`Lỗi khi thêm phòng: ${createError}`);
    if (updateError) toast.error(`Lỗi khi cập nhật phòng: ${updateError}`);
    if (deleteError) toast.error(`Lỗi khi xóa phòng: ${deleteError}`);
  }, [createError, updateError, deleteError]);

  useEffect(() => {
    if (createSuccess) {
      toast.success('Thêm phòng thành công');
      refetchRooms();
      setAddModalOpen(false);
    }
    if (updateSuccess) {
      toast.success('Cập nhật phòng thành công');
      refetchRooms();
      setEditModalOpen(false);
    }
    if (deleteSuccess) {
      toast.success('Xóa phòng thành công');
      refetchRooms();
      setDeleteModalOpen(false);
    }
  }, [createSuccess, updateSuccess, deleteSuccess, refetchRooms]);

  const goToPage = (page: number) => {
    updateQuery({ ...query, page });
  };

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

  // // Xử lý thêm phòng mới
  // const handleAddRoomSubmit = async (roomData: any) => {
  //   await createData('room', roomData);
  // };

  // // Xử lý cập nhật phòng
  // const handleEditRoomSubmit = async (roomData: any) => {
  //   if (!selectedRoom) return;
  //   await updateData(`room/${selectedRoom.id}`, roomData);
  // };

  // // Xử lý xóa phòng
  // const handleDeleteRoomSubmit = async () => {
  //   if (!selectedRoom) return;
  //   await deleteData('room', selectedRoom.id);
  // };

  // Xử lý thay đổi bộ lọc
  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    updateQuery({ status, page: 1 });
  };

  const handleGenderChange = (gender: string) => {
    setGenderFilter(gender);
    updateQuery({ gender, page: 1 });
  };

  const handleBuildingChange = (building: string) => {
    setBuildingFilter(building);
    updateQuery({ building, page: 1 });
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    updateQuery({ search: debouncedSearchTerm, page: 1 });
  }, [debouncedSearchTerm]);

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
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onGenderChange={handleGenderChange}
        onBuildingChange={handleBuildingChange}
      />
      
      {/* Rooms Table */}
      <RoomTable
        rooms={rooms}
        onViewRoom={handleViewRoom}
        onEditRoom={handleEditRoom}
        onDeleteRoom={handleDeleteRoom}
      />
      
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Hiển thị <span className="font-medium">{rooms.length}</span> trong số <span className="font-medium">{meta?.total || 0}</span> phòng
        </div>
        
        <Pagination 
          totalItems={meta?.total || 0}
          currentPage={meta?.pageNumber || query.page}
          onPageChange={goToPage}
          itemsPerPage={meta?.limitNumber || query.limit}
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
        onEditSuccess={() => refetchRooms()}
        room={selectedRoom}
      />

      <RoomDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDeleteSuccess={() => refetchRooms()}
        room={selectedRoom}
      />

      <RoomAddModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddSuccess={() => refetchRooms()}
        buildingId={buildingFilter ? parseInt(buildingFilter) : undefined}
      />
    </div>
  );
};

export default Rooms; 