import React from 'react';
import { Room } from '../../types';
import RoomFormContainer from './RoomFormContainer';
import useUpdateApi from '../../hooks/useUpdateApi';
import { toast } from 'react-toastify';

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
  const { updateData, loading, error, success } = useUpdateApi();

  const handleUpdateRoom = async (roomData: any) => {
    if (!room) return;
    
    const result = await updateData(`room/${room.id}`, roomData);
    
    if (result) {
      onClose();
      onEditSuccess();
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
      toast.success('Cập nhật phòng thành công!');
    }
  }, [success]);

  if (!room) return null;

  return (
    <RoomFormContainer
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleUpdateRoom}
      room={room}
      title={`Cập nhật phòng ${room.roomNumber}`}
      isLoading={loading}
    />
  );
};

export default RoomEditModal; 