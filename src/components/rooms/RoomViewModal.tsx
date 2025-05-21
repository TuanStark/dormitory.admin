import React from 'react';
import { Room } from '../../types';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import { Gender, RoomStatus } from '../../data/mockData';

interface RoomViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
}

const RoomViewModal: React.FC<RoomViewModalProps> = ({
  isOpen,
  onClose,
  room
}) => {
  if (!room) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Chi tiết phòng ${room.roomNumber}`}
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin phòng</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Số phòng:</span>
                <span className="font-medium">{room.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tầng:</span>
                <span className="font-medium">{room.floor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sức chứa:</span>
                <span className="font-medium">{room.capacity} người</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Giới tính:</span>
                <Badge variant="info">
                  {room.gender === Gender.MALE ? 'Nam' : 
                   room.gender === Gender.FEMALE ? 'Nữ' : 'Tất cả'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Giá:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(room.price))}/tháng
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Trạng thái:</span>
                <Badge variant={room.status === RoomStatus.AVAILABLE ? 'success' : 
                               room.status === RoomStatus.OCCUPIED ? 'info' :
                               room.status === RoomStatus.MAINTENANCE ? 'warning' : 'secondary'}>
                  {room.status === RoomStatus.AVAILABLE ? 'Còn trống' : 
                   room.status === RoomStatus.OCCUPIED ? 'Đã thuê' :
                   room.status === RoomStatus.MAINTENANCE ? 'Bảo trì' : 'Đã đặt'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mô tả</h3>
            <p className="text-gray-700">{room.description}</p>
            
            {room.amenities && room.amenities.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">Tiện ích</h4>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary">
                      {amenity.amenityName}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {room.images && room.images.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Hình ảnh</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {room.images.map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={image.url} 
                    alt={`Room ${room.roomNumber} - ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RoomViewModal; 