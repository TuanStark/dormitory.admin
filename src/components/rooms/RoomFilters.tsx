import React, { useState, useEffect } from 'react';
import { RoomStatus, Gender } from '../../data/mockData';
import useFecthApi from '../../hooks/useFecthApi';
import { Building } from '../../types';

interface RoomFiltersProps {
  searchTerm: string;
  statusFilter: string;
  genderFilter: string;
  buildingFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onBuildingChange: (value: string) => void;
}

const RoomFilters: React.FC<RoomFiltersProps> = ({
  searchTerm,
  statusFilter,
  genderFilter,
  buildingFilter,
  onSearchChange,
  onStatusChange,
  onGenderChange,
  onBuildingChange
}) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  
  // Lấy danh sách tòa nhà
  const [buildingsList] = useFecthApi('building', { limit: 100 }, []);

  useEffect(() => {
    if (buildingsList && Array.isArray(buildingsList)) {
      setBuildings(buildingsList);
    }
  }, [buildingsList]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm phòng..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <i className="fas fa-search text-gray-400"></i>
          </div>
        </div>
        
        <select 
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value={RoomStatus.AVAILABLE}>Còn trống</option>
          <option value="occupied">Đã thuê</option>
          <option value={RoomStatus.MAINTENANCE}>Bảo trì</option>
          <option value="reserved">Đã đặt</option>
        </select>
        
        <select 
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          value={genderFilter}
          onChange={(e) => onGenderChange(e.target.value)}
        >
          <option value="">Tất cả giới tính</option>
          <option value={Gender.MALE}>Nam</option>
          <option value={Gender.FEMALE}>Nữ</option>
          <option value={Gender.ANY}>Tất cả</option>
        </select>
        
        <select 
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          value={buildingFilter}
          onChange={(e) => onBuildingChange(e.target.value)}
        >
          <option value="">Tất cả tòa nhà</option>
          {buildings.map(building => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RoomFilters; 