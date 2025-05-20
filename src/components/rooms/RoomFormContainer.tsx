import React, { useState, useEffect } from 'react';
import { Room } from '../../types';
import FormModal from '../ui/FormModal';
import RoomForm from './RoomForm';

interface RoomFormData {
  roomNumber: string;
  floor: number;
  description: string;
  capacity: number;
  gender: string;
  price: string;
  status: string;
}

interface RoomFormContainerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomData: RoomFormData & { buildingId?: string | number }) => void;
  room?: Room;
  buildingId?: string | number;
  title: string;
  isLoading?: boolean;
}

const RoomFormContainer: React.FC<RoomFormContainerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  room,
  buildingId,
  title,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<RoomFormData>({
    roomNumber: '',
    floor: 1,
    description: '',
    capacity: 4,
    gender: 'Male',
    price: '400000',
    status: 'available'
  });

  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber,
        floor: room.floor,
        description: room.description,
        capacity: room.capacity,
        gender: room.gender,
        price: room.price,
        status: room.status
      });
    } else {
      // Reset form for new room
      setFormData({
        roomNumber: '',
        floor: 1,
        description: '',
        capacity: 4,
        gender: 'Male',
        price: '400000',
        status: 'available'
      });
    }
  }, [room, isOpen]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      buildingId: buildingId
    });
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={title}
      submitText={room ? 'Cập nhật' : 'Thêm phòng'}
      isLoading={isLoading}
    >
      <RoomForm
        room={room}
        onChange={handleChange}
        formData={formData}
      />
    </FormModal>
  );
};

export default RoomFormContainer; 