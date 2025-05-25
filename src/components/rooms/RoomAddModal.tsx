import React, { useState, useEffect } from 'react';
import RoomFormContainer from './RoomFormContainer';
import useCreateApi from '../../hooks/useCreateApi';
import useFecthApi from '../../hooks/useFecthApi';
import { toast } from 'react-toastify';
import { Building } from '../../types';

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
  const { createData, loading, error, success } = useCreateApi();
  const [buildings, setBuildingList] = useState<Building[]>([]);
  const [buildingsLoading, setBuildingsLoading] = useState(false);

  // Lấy danh sách tòa nhà
  const [buildingsList] = useFecthApi('building', { limit: 100 }, []);

  useEffect(() => {
    if (buildingsList && Array.isArray(buildingsList)) {
      setBuildingList(buildingsList);
    }
  }, [buildingsList]);

  const handleAddRoom = async (roomData: any) => {
    // Kiểm tra xem đã chọn tòa nhà chưa
    if (!roomData.buildingId && !buildingId) {
      toast.error('Vui lòng chọn tòa nhà cho phòng');
      return;
    }

    const result = await createData('room', roomData);
    
    if (result) {
      onClose();
      onAddSuccess();
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
      toast.success('Thêm phòng thành công!');
    }
  }, [success]);

  return (
    <RoomFormContainer
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleAddRoom}
      buildingId={buildingId}
      title="Thêm phòng mới"
      isLoading={loading}
      buildingOptions={buildings}
    />
  );
};

export default RoomAddModal; 