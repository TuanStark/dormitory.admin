import React, { useState } from 'react';
import { Room } from '../../types';
import ConfirmationModal from '../ui/ConfirmationModal';

interface RoomDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  room: Room | null;
}

const RoomDeleteModal: React.FC<RoomDeleteModalProps> = ({
  isOpen,
  onClose,
  onDeleteSuccess,
  room
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!room) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/room/${room.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Xóa phòng thành công!');
        onClose();
        onDeleteSuccess();
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message || 'Không thể xóa phòng'}`);
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Có lỗi xảy ra khi xóa phòng!');
    } finally {
      setIsLoading(false);
    }
  };

  if (!room) return null;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirmDelete}
      title="Xóa phòng"
      message={`Bạn có chắc chắn muốn xóa phòng ${room.roomNumber}? Hành động này không thể hoàn tác.`}
      confirmText="Xóa"
      confirmVariant="danger"
      icon="fas fa-trash-alt"
      isLoading={isLoading}
    />
  );
};

export default RoomDeleteModal; 