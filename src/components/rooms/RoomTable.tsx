import React from 'react';
import { Room } from '../../types';
import Badge from '../ui/Badge';
import { Gender, RoomStatus } from '../../data/mockData';

interface RoomTableProps {
  rooms: Room[];
  onViewRoom: (room: Room) => void;
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (room: Room) => void;
}

const RoomTable: React.FC<RoomTableProps> = ({
  rooms,
  onViewRoom,
  onEditRoom,
  onDeleteRoom
}) => {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <i className="fas fa-door-open text-gray-300 text-5xl"></i>
        <p className="mt-4 text-gray-500 text-lg">Không tìm thấy phòng nào</p>
        <p className="text-gray-400">Hãy thử điều chỉnh bộ lọc của bạn</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tòa nhà</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tầng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sức chứa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Còn Trống</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới tính</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map(room => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 text-left">Phòng {room.roomNumber}</div>
                  <div className="text-xs text-gray-500 truncate max-w-xs text-left">{room.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                  Tòa nhà {room.buildingId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                  {room.floor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                  {room.capacity} {room.capacity > 1 ? 'người' : 'người'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                  {room.capacity - room.currentOccupants} chỗ
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                  <Badge variant="info">
                    {room.gender === Gender.MALE ? 'Nam' : 
                     room.gender === Gender.FEMALE ? 'Nữ' : 'Tất cả'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(room.price))}/tháng
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                  <Badge variant={room.status === RoomStatus.AVAILABLE ? 'success' : 
                    room.status === RoomStatus.MAINTENANCE ? 'warning' : 'secondary'}>
                    {room.status === RoomStatus.AVAILABLE ? 'Còn trống' : 
                     room.status === RoomStatus.MAINTENANCE ? 'Bảo trì' : 
                     room.status === RoomStatus.FULL   ? 'Hết chỗ' :
                     'Đã đặt'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => onViewRoom(room)}
                    className="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button 
                    onClick={() => onEditRoom(room)}
                    className="text-gray-500 hover:text-gray-700 mr-3"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    onClick={() => onDeleteRoom(room)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomTable; 