import React, { useState, useEffect } from 'react';
import { Room, Building } from '../../types';
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
  buildingId?: number;
}

interface RoomFormContainerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomData: RoomFormData & { buildingId?: number }) => void;
  room?: Room;
  buildingId?: number;
  title: string;
  isLoading?: boolean;
  buildingOptions?: Building[];
}

const RoomFormContainer: React.FC<RoomFormContainerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  room,
  buildingId,
  title,
  isLoading = false,
  buildingOptions = []
}) => {
  const [formData, setFormData] = useState<RoomFormData>({
    roomNumber: '',
    floor: 1,
    description: '',
    capacity: 4,
    gender: 'Male',
    price: '400000',
    status: 'available',
    buildingId: buildingId
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
        status: room.status,
        buildingId: room.buildingId
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
        status: 'available',
        buildingId: buildingId
      });
    }
  }, [room, buildingId, isOpen]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
        buildingOptions={buildingOptions}
        selectedBuildingId={buildingId}
      />
    </FormModal>
  );
};

export default RoomFormContainer; 