import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Building, Room, ApiResponse } from '../types';
import defaultBuildingImage from '../assets/building/default_building.jpg';
import BuildingFormContainer from '../components/buildings/BuildingFormContainer';
import Modal from '../components/ui/Modal';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import RoomFormContainer from '../components/rooms/RoomFormContainer';

// Interface for Room form data
interface RoomFormData {
  roomNumber: string;
  floor: number;
  description: string;
  capacity: number;
  gender: string;
  price: string;
  status: string;
  buildingId?: string | number;
}

const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [building, setBuilding] = useState<Building | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  
  // Room form data
  const [roomFormData, setRoomFormData] = useState<RoomFormData>({
    roomNumber: '',
    floor: 1,
    description: '',
    capacity: 4,
    gender: 'Male',
    price: '400000',
    status: 'available'
  });

  useEffect(() => {
    const fetchBuildingDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/building/${id}`);
        const result = await response.json() as ApiResponse<{building: Building, rooms: Room[]}>;
        
        if (result.statusCode === 200 && result.data) {
          setBuilding(result.data.building);
          setRooms(result.data.rooms);
        } else {
          setError(result.message || 'Failed to fetch building details');
        }
      } catch (err) {
        setError('An error occurred while fetching building details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBuildingDetails();
  }, [id]);
  
  // Handle edit building
  const handleEditBuilding = async (buildingData: Partial<Building>) => {
    if (!building) return;
    
    setActionLoading(true);
    setActionError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/building/${building.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildingData),
      });
      
      const result = await response.json();
      
      if (result.statusCode === 200 && result.data) {
        setBuilding({...building, ...buildingData});
        setIsEditModalOpen(false);
        setActionSuccess('Cập nhật tòa nhà thành công');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      } else {
        setActionError(result.message || 'Có lỗi xảy ra khi cập nhật tòa nhà');
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật tòa nhà');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Handle delete building
  const handleDeleteBuilding = async () => {
    if (!building) return;
    
    setActionLoading(true);
    setActionError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/building/${building.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.statusCode === 200) {
        setIsDeleteModalOpen(false);
        setActionSuccess('Xóa tòa nhà thành công');
        
        // Redirect to buildings list after successful deletion
        setTimeout(() => {
          navigate('/buildings');
        }, 1500);
      } else {
        setActionError(result.message || 'Có lỗi xảy ra khi xóa tòa nhà');
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa tòa nhà');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Handle add room
  const handleAddRoom = async (roomData: RoomFormData) => {
    if (!building) return;
    
    setActionLoading(true);
    setActionError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...roomData,
          buildingId: building.id.toString(),
          currentOccupants: 0,
        }),
      });
      
      const result = await response.json();
      
      if (result.statusCode === 201 && result.data) {
        // Add the new room to the rooms list
        setRooms([...rooms, result.data]);
        setIsAddRoomModalOpen(false);
        setActionSuccess('Thêm phòng mới thành công');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      } else {
        setActionError(result.message || 'Có lỗi xảy ra khi thêm phòng mới');
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi thêm phòng mới');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Handle room form input change
  const handleRoomFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRoomFormData(prev => ({
      ...prev,
      [name]: name === 'floor' || name === 'capacity' ? parseInt(value) : value
    }));
  };

  const handleGoBack = () => {
    navigate('/buildings');
  };

  // Get room status counts
  const getRoomStatusCounts = () => {
    const counts: Record<string, number> = {
      available: 0,
      occupied: 0,
      maintenance: 0,
      reserved: 0
    };
    
    rooms.forEach(room => {
      const status = room.status.toLowerCase();
      counts[status] = (counts[status] || 0) + 1;
    });
    
    return counts;
  };
  
  const statusCounts = getRoomStatusCounts();

  // Get room status badge variant
  const getRoomStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'success';
      case 'occupied':
        return 'info';
      case 'maintenance':
        return 'warning';
      case 'reserved':
        return 'secondary';
      default:
        return 'secondary';
    }
  };
  
  // Open room gallery
  const openGallery = (room: Room, imageIndex = 0) => {
    setSelectedRoom(room);
    setCurrentImageIndex(imageIndex);
    setShowGallery(true);
    document.body.style.overflow = 'hidden';
  };
  
  // Close room gallery
  const closeGallery = () => {
    setShowGallery(false);
    document.body.style.overflow = 'auto';
  };
  
  // Navigate to next/previous image
  const navigateGallery = (direction: 'next' | 'prev') => {
    if (!selectedRoom || !selectedRoom.images.length) return;
    
    const imageCount = selectedRoom.images.length;
    if (direction === 'next') {
      setCurrentImageIndex((currentImageIndex + 1) % imageCount);
    } else {
      setCurrentImageIndex((currentImageIndex - 1 + imageCount) % imageCount);
    }
  };
  
  // Format price with currency
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND'
    }).format(parseInt(price));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="mt-2 text-gray-600">Đang tải thông tin tòa nhà...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 rounded-lg p-6">
        <i className="fas fa-exclamation-circle text-4xl text-red-500"></i>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Lỗi</h2>
        <p className="mt-2 text-gray-500">{error}</p>
        <Button 
          variant="primary" 
          className="mt-4"
          onClick={handleGoBack}
        >
          Quay lại danh sách tòa nhà
        </Button>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
        <i className="fas fa-exclamation-circle text-4xl text-gray-400"></i>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Không tìm thấy tòa nhà</h2>
        <p className="mt-2 text-gray-500">Tòa nhà bạn đang tìm không tồn tại.</p>
        <Button 
          variant="primary" 
          className="mt-4"
          onClick={handleGoBack}
        >
          Quay lại danh sách tòa nhà
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Success message */}
        {actionSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center animate-fadeIn">
            <i className="fas fa-check-circle mr-2 text-green-500"></i>
            <span>{actionSuccess}</span>
          </div>
        )}
        
        {/* Error message */}
        {actionError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center animate-fadeIn">
            <i className="fas fa-exclamation-circle mr-2 text-red-500"></i>
            <span>{actionError}</span>
            <button 
              className="ml-auto text-red-500 hover:text-red-700"
              onClick={() => setActionError(null)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        
        {/* Header with back button */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleGoBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-arrow-left text-gray-500"></i>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{building.name}</h1>
        </div>
        
        {/* Building info card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-2/5 h-80 md:h-auto relative">
              <img 
                src={building.image || defaultBuildingImage} 
                alt={building.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-md">
                <i className="fas fa-star text-yellow-400 mr-1.5"></i>
                <span className="font-semibold">{building.averageRating.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="p-6 md:w-3/5">
              <div className="flex flex-wrap justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{building.name}</h2>
                  <p className="text-gray-600 mt-1 flex items-center">
                    <i className="fas fa-map-marker-alt text-gray-400 mr-2"></i>
                    {building.address}
                  </p>
                </div>
                
                <div className="flex space-x-2 mt-2 md:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    icon="fas fa-edit"
                    onClick={() => setIsEditModalOpen(true)}
                    disabled={actionLoading}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    icon="fas fa-trash-alt"
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={actionLoading}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
              
              <p className="mt-4 text-gray-700">{building.description}</p>
              
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-500">Số tầng</div>
                  <div className="text-xl font-semibold text-gray-900 flex items-center mt-1">
                    <i className="fas fa-building text-primary-500 mr-2"></i>
                    {building.floors}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-500">Số phòng</div>
                  <div className="text-xl font-semibold text-gray-900 flex items-center mt-1">
                    <i className="fas fa-door-open text-primary-500 mr-2"></i>
                    {rooms.length}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-500">Còn trống</div>
                  <div className="text-xl font-semibold text-green-600 flex items-center mt-1">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    {statusCounts.available || 0}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-500">Đã thuê</div>
                  <div className="text-xl font-semibold text-blue-600 flex items-center mt-1">
                    <i className="fas fa-user text-blue-500 mr-2"></i>
                    {statusCounts.occupied || 0}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-2">
                <a href={`https://maps.google.com/?q=${building.latitude},${building.longitude}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 text-sm flex items-center bg-primary-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <i className="fas fa-map-marked-alt mr-2"></i>
                  Xem trên bản đồ
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                className={`py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Tổng quan
              </button>
              <button
                className={`py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'rooms'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('rooms')}
              >
                Phòng ({rooms.length})
              </button>
              <button
                className={`py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Đánh giá
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-primary-50 text-primary-600 p-2 rounded-lg mr-3">
                    <i className="fas fa-info-circle"></i>
                  </span>
                  Tổng quan về tòa nhà
                </h3>
                
                <div className="bg-gray-50 p-5 rounded-xl mb-8 border-l-4 border-primary-500 shadow-sm">
                  <p className="text-gray-700 leading-relaxed">{building.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg text-blue-600 mr-3">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Vị trí</h4>
                    </div>
                    <p className="text-gray-600">Tọa lạc tại <span className="font-medium">{building.address}</span>, tòa nhà cung cấp khả năng tiếp cận thuận tiện đến các cơ sở và tiện ích của trường đại học.</p>
                    
                    <div className="mt-4 bg-gray-50 rounded-lg overflow-hidden h-40">
                      <iframe 
                        title="Building Location"
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        src={`https://maps.google.com/maps?q=${building.latitude},${building.longitude}&z=15&output=embed`} 
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-50 p-3 rounded-lg text-green-600 mr-3">
                        <i className="fas fa-building"></i>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Cơ sở vật chất</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <i className="fas fa-wifi text-primary-500 mr-3"></i>
                        <span className="text-gray-700">WiFi phủ sóng</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <i className="fas fa-tshirt text-primary-500 mr-3"></i>
                        <span className="text-gray-700">Khu vực giặt là</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <i className="fas fa-book text-primary-500 mr-3"></i>
                        <span className="text-gray-700">Phòng học tập</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <i className="fas fa-utensils text-primary-500 mr-3"></i>
                        <span className="text-gray-700">Khu bếp chung</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <i className="fas fa-shield-alt text-primary-500 mr-3"></i>
                        <span className="text-gray-700">Bảo vệ 24/7</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <i className="fas fa-dumbbell text-primary-500 mr-3"></i>
                        <span className="text-gray-700">Phòng tập thể dục</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                    Thông tin thêm
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-700">Giờ mở cửa: 6:00 - 22:00 hàng ngày</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-700">Có nhân viên quản lý tòa nhà trực 24/7</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-700">Hệ thống an ninh với camera giám sát và thẻ từ</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-700">Có khu vực đậu xe dành cho sinh viên</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'rooms' && (
              <div className="animate-fadeIn">
                <div className="flex flex-wrap justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <span className="bg-primary-50 text-primary-600 p-2 rounded-lg mr-3">
                        <i className="fas fa-door-open"></i>
                      </span>
                      Danh sách phòng
                    </h3>
                    <p className="text-gray-500 mt-1">Tổng cộng {rooms.length} phòng trong tòa nhà</p>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    size="sm"
                    icon="fas fa-plus"
                    className="px-4 py-2 shadow-md hover:shadow-lg"
                    onClick={() => setIsAddRoomModalOpen(true)}
                    disabled={actionLoading}
                  >
                    Thêm phòng
                  </Button>
                </div>
                
                <div className="flex mb-6 overflow-x-auto py-2 scrollbar-thin">
                  <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-full mr-3 shadow-sm whitespace-nowrap">
                    <i className="fas fa-th-large mr-2"></i>
                    Tất cả ({rooms.length})
                  </button>
                  <button className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-full mr-3 shadow-sm hover:bg-gray-50 whitespace-nowrap">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Còn trống ({statusCounts.available || 0})
                  </button>
                  <button className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-full mr-3 shadow-sm hover:bg-gray-50 whitespace-nowrap">
                    <i className="fas fa-user text-blue-500 mr-2"></i>
                    Đã thuê ({statusCounts.occupied || 0})
                  </button>
                  <button className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-full mr-3 shadow-sm hover:bg-gray-50 whitespace-nowrap">
                    <i className="fas fa-tools text-yellow-500 mr-2"></i>
                    Bảo trì ({statusCounts.maintenance || 0})
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map(room => (
                    <div key={room.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => openGallery(room)}>
                        <img 
                          src={`/src/assets${room.images[0]?.url}` || '/assets/room/default_room.jpg'} 
                          alt={`Room ${room.roomNumber}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70"></div>
                        <div className="absolute top-3 right-3 flex space-x-2">
                          <Badge variant={getRoomStatusBadgeVariant(room.status)}>
                            {room.status}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                          <span className="text-white font-semibold text-lg drop-shadow-md">Phòng {room.roomNumber}</span>
                          <span className="bg-black/50 text-white px-2 py-1 rounded-lg text-xs backdrop-blur-sm">
                            {room.images.length} ảnh
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">Phòng {room.roomNumber}</h4>
                            <p className="text-sm text-gray-500 flex items-center">
                              <i className="fas fa-layer-group text-primary-500 mr-2"></i>
                              Tầng {room.floor}
                            </p>
                          </div>
                          <div className="text-primary-600 font-bold text-lg">
                            {formatPrice(room.price)}
                            <span className="text-xs text-gray-500 font-normal">/tháng</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                            <i className="fas fa-user-friends text-blue-500 mr-2"></i>
                            <span className="text-sm">Sức chứa: {room.capacity}</span>
                          </div>
                          <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                            <i className="fas fa-users text-green-500 mr-2"></i>
                            <span className="text-sm">Hiện tại: {room.currentOccupants}/{room.capacity}</span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {room.description.length > 100 
                            ? `${room.description.substring(0, 100)}...` 
                            : room.description}
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <button 
                            className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center"
                            onClick={() => openGallery(room)}
                          >
                            <i className="fas fa-images mr-1"></i>
                            Xem chi tiết
                          </button>
                          <div className="flex space-x-1">
                            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors">
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {rooms.length === 0 && (
                  <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-door-open text-gray-400 text-3xl"></i>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">Chưa có phòng nào</h4>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">Tòa nhà này hiện chưa có phòng nào. Hãy thêm phòng để sinh viên có thể đặt chỗ.</p>
                    <Button 
                      variant="primary" 
                      className="px-6 py-2.5 shadow-md"
                      icon="fas fa-plus"
                    >
                      Thêm phòng đầu tiên
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <span className="bg-primary-50 text-primary-600 p-2 rounded-lg mr-3">
                        <i className="fas fa-star"></i>
                      </span>
                      Đánh giá từ người thuê
                    </h3>
                    <p className="text-gray-500 mt-1">
                      Xem các đánh giá và phản hồi từ người thuê phòng
                    </p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    icon="fas fa-filter"
                    className="px-4 py-2"
                  >
                    Lọc đánh giá
                  </Button>
                </div>
                
                <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="text-center md:text-left mb-6 md:mb-0">
                        <div className="inline-flex items-center justify-center bg-white rounded-full p-4 shadow-md mb-3">
                          <span className="text-4xl font-bold text-primary-600">{building.averageRating.toFixed(1)}</span>
                        </div>
                        <div className="flex mt-2 justify-center md:justify-start">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i 
                              key={star}
                              className={`fas fa-star text-xl ${
                                star <= Math.round(building.averageRating) 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            ></i>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          Dựa trên <span className="font-semibold">{building.fiveStar + building.fourStar + building.threeStar + building.twoStar + building.oneStar}</span> đánh giá
                        </div>
                      </div>
                      
                      <div className="space-y-3 md:w-1/2 lg:w-2/5">
                        <div className="flex items-center">
                          <div className="text-sm font-medium w-16">5 sao</div>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full mx-2 overflow-hidden">
                            <div 
                              className="h-3 bg-yellow-400 rounded-full" 
                              style={{ width: `${(building.fiveStar / (building.fiveStar + building.fourStar + building.threeStar + building.twoStar + building.oneStar)) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-medium text-gray-700 w-10 text-right">{building.fiveStar}</div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-sm font-medium w-16">4 sao</div>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full mx-2 overflow-hidden">
                            <div 
                              className="h-3 bg-yellow-400 rounded-full" 
                              style={{ width: `${(building.fourStar / (building.fiveStar + building.fourStar + building.threeStar + building.twoStar + building.oneStar)) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-medium text-gray-700 w-10 text-right">{building.fourStar}</div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-sm font-medium w-16">3 sao</div>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full mx-2 overflow-hidden">
                            <div 
                              className="h-3 bg-yellow-400 rounded-full" 
                              style={{ width: `${(building.threeStar / (building.fiveStar + building.fourStar + building.threeStar + building.twoStar + building.oneStar)) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-medium text-gray-700 w-10 text-right">{building.threeStar}</div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-sm font-medium w-16">2 sao</div>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full mx-2 overflow-hidden">
                            <div 
                              className="h-3 bg-yellow-400 rounded-full" 
                              style={{ width: `${(building.twoStar / (building.fiveStar + building.fourStar + building.threeStar + building.twoStar + building.oneStar)) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-medium text-gray-700 w-10 text-right">{building.twoStar}</div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-sm font-medium w-16">1 sao</div>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full mx-2 overflow-hidden">
                            <div 
                              className="h-3 bg-yellow-400 rounded-full" 
                              style={{ width: `${(building.oneStar / (building.fiveStar + building.fourStar + building.threeStar + building.twoStar + building.oneStar)) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-medium text-gray-700 w-10 text-right">{building.oneStar}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Đánh giá theo tiêu chí</h4>
                      <span className="text-sm text-gray-500">Thang điểm: 5</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">Vị trí</span>
                          <div className="flex items-center">
                            <span className="font-semibold mr-1">4.5</span>
                            <i className="fas fa-star text-yellow-400 text-xs"></i>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">Sạch sẽ</span>
                          <div className="flex items-center">
                            <span className="font-semibold mr-1">4.2</span>
                            <i className="fas fa-star text-yellow-400 text-xs"></i>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '84%' }}></div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">Tiện nghi</span>
                          <div className="flex items-center">
                            <span className="font-semibold mr-1">3.9</span>
                            <i className="fas fa-star text-yellow-400 text-xs"></i>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">Giá trị</span>
                          <div className="flex items-center">
                            <span className="font-semibold mr-1">4.0</span>
                            <i className="fas fa-star text-yellow-400 text-xs"></i>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Placeholder for reviews - would be populated from API */}
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-comment-alt text-gray-400 text-3xl"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">Chưa có đánh giá nào</h4>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">Hiện tại chưa có đánh giá nào cho tòa nhà này. Đánh giá sẽ xuất hiện sau khi người thuê phòng gửi phản hồi.</p>
                  <Button 
                    variant="outline" 
                    className="px-6 py-2.5"
                    icon="fas fa-plus"
                  >
                    Thêm đánh giá mẫu
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Image Gallery Modal */}
      {selectedRoom && (
        <Modal
          isOpen={showGallery}
          onClose={closeGallery}
          showCloseButton={false}
          size="xl"
          className="bg-black/90 text-white"
        >
          <div className="absolute top-4 right-4">
            <button 
              onClick={closeGallery}
              className="text-white hover:text-gray-300 p-2 text-xl"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <button 
              onClick={() => navigateGallery('prev')}
              className="text-white hover:text-gray-300 bg-black/50 hover:bg-black/70 p-3 rounded-full"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          </div>
          
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <button 
              onClick={() => navigateGallery('next')}
              className="text-white hover:text-gray-300 bg-black/50 hover:bg-black/70 p-3 rounded-full"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <div className="w-full max-w-4xl max-h-[80vh] mx-auto">
            <img 
              src={selectedRoom.images[currentImageIndex]?.url || '/assets/room/default_room.jpg'} 
              alt={`Room ${selectedRoom.roomNumber} - Image ${currentImageIndex + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            
            <div className="bg-black/70 text-white p-4 mt-2 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Phòng {selectedRoom.roomNumber}</h3>
                  <p className="text-sm text-gray-300">{selectedRoom.images[currentImageIndex]?.description || `Ảnh ${currentImageIndex + 1}/${selectedRoom.images.length}`}</p>
                </div>
                <div className="text-sm">
                  {currentImageIndex + 1}/{selectedRoom.images.length}
                </div>
              </div>
              
              <div className="mt-4 overflow-x-auto pb-2">
                <div className="flex space-x-2">
                  {selectedRoom.images.map((image, index) => (
                    <button 
                      key={image.id} 
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${index === currentImageIndex ? 'border-primary-500' : 'border-transparent'}`}
                    >
                      <img 
                        src={`/src/assets${image.url}`} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Edit Building Modal */}
      {building && (
        <BuildingFormContainer
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditBuilding}
          building={building}
          title="Chỉnh sửa tòa nhà"
          isLoading={actionLoading}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteBuilding}
        title="Xóa tòa nhà"
        message={`Bạn có chắc chắn muốn xóa tòa nhà "${building?.name}" không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa tòa nhà"
        confirmVariant="danger"
        icon="fas fa-trash-alt"
        isLoading={actionLoading}
      />
      
      {/* Add Room Modal */}
      <RoomFormContainer
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onSubmit={handleAddRoom}
        buildingId={building?.id}
        title="Thêm phòng mới"
        isLoading={actionLoading}
      />
    </>
  );
};

export default BuildingDetail; 
