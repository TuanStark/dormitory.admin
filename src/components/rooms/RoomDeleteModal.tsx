import React from 'react';
import { Room } from '../../types';
import ConfirmationModal from '../ui/ConfirmationModal';
import useUpdateApi from '../../hooks/useUpdateApi';
import { toast } from 'react-toastify';

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
  const { updateData, loading, error, success } = useUpdateApi();

  const handleConfirmDelete = async () => {
    if (!room) return;
    
    const result = await updateData(`/room/delete/${room.id}`,{status: false}  );
    
    if (result) {
      onClose();
      onDeleteSuccess();
    }
  };

  // Hiển thị thông báo lỗi
  React.useEffect(() => {
    if (error) {
      toast.error(`Lỗi: ${error}`);
    }
  }, [error]);

  // Hiển thị thông báo thành công
  React.useEffect(() => {
    if (success) {
      toast.success('Xóa phòng thành công!');
    }
  }, [success]);

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
      isLoading={loading}
    />
  );
};

export default RoomDeleteModal; 