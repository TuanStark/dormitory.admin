import React, { useState } from 'react';
import { Room } from '../../types';
import RoomFormContainer from './RoomFormContainer';

interface RoomEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  room: Room | null;
}

const RoomEditModal: React.FC<RoomEditModalProps> = ({
  isOpen,
  onClose,
  onEditSuccess,
  room
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRoom = async (roomData: any) => {
    if (!room) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/room/${room.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData)
      });
      
      if (response.ok) {
        alert('Cập nhật phòng thành công!');
        onClose();
        onEditSuccess();
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message || 'Không thể cập nhật phòng'}`);
      }
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Có lỗi xảy ra khi cập nhật phòng!');
    } finally {
      setIsLoading(false);
    }
  };

  if (!room) return null;

  return (
    <RoomFormContainer
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleUpdateRoom}
      room={room}
      title={`Cập nhật phòng ${room.roomNumber}`}
      isLoading={isLoading}
    />
  );
};

export default RoomEditModal; 