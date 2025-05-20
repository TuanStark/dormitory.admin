import React, { useState, useEffect } from 'react';
import { Building } from '../../types';
import FormModal from '../ui/FormModal';
import BuildingForm from './BuildingForm';

interface BuildingFormContainerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (buildingData: Partial<Building>) => void;
  building?: Building;
  title: string;
  isLoading?: boolean;
}

const BuildingFormContainer: React.FC<BuildingFormContainerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  building,
  title,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    floors: 1,
    image: '',
    latitude: 21.028511,
    longitude: 105.804817
  });

  useEffect(() => {
    if (building) {
      setFormData({
        name: building.name,
        address: building.address,
        description: building.description,
        floors: building.floors,
        image: building.image || '',
        latitude: building.latitude,
        longitude: building.longitude
      });
    } else {
      // Reset form for new building
      setFormData({
        name: '',
        address: '',
        description: '',
        floors: 1,
        image: '',
        latitude: 21.028511,
        longitude: 105.804817
      });
    }
  }, [building, isOpen]);

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
      submitText={building ? 'Cập nhật' : 'Thêm mới'}
      isLoading={isLoading}
      size="lg"
    >
      <BuildingForm
        building={building}
        onChange={handleChange}
        formData={formData}
      />
    </FormModal>
  );
};

export default BuildingFormContainer; 