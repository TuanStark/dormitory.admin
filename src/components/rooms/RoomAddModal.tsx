import React, { useState } from 'react';
import { Room } from '../../types';
import RoomFormContainer from './RoomFormContainer';

interface RoomAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
  buildingId?: number;
}

const RoomAddModal: React.FC<RoomAddModalProps> = ({
  isOpen,
  onClose,
  onAddSuccess,
  buildingId
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddRoom = async (roomData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData)
      });
      
      if (response.ok) {
        alert('Thêm phòng thành công!');
        onClose();
        onAddSuccess();
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message || 'Không thể thêm phòng'}`);
      }
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Có lỗi xảy ra khi thêm phòng!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoomFormContainer
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleAddRoom}
      buildingId={buildingId}
      title="Thêm phòng mới"
      isLoading={isLoading}
    />
  );
};

export default RoomAddModal; 