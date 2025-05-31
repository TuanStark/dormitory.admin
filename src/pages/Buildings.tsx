import React, { useState, useEffect, useMemo } from 'react';
import Pagination from '../components/ui/Pagination';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { Building } from '../types';
import BuildingFormModal from '../components/buildings/BuildingFormModal';
import DeleteConfirmationModal from '../components/buildings/DeleteConfirmationModal';
import defaultBuildingImage from '../assets/building/default_building.jpg';
import useFecthApi from '../hooks/useFecthApi';
import useQuery from '../hooks/useQuery';
import useCreateApi from '../hooks/useCreateApi';
import useUpdateApi from '../hooks/useUpdateApi';
import useDeleteApi from '../hooks/useDeleteApi';
import { toast } from 'react-toastify';

// Debounce function
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Buildings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterByCapacity, setFilterByCapacity] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  // Khởi tạo query và lấy dữ liệu
  const [query, updateQuery, resetQuery] = useQuery({
    page: 1,
    limit: 5,
    sortBy: sortBy,
    sortOrder: 'desc',
    search: debouncedSearchTerm,
    status: '',
    building: ''
  });

  // Sử dụng các hooks API
  const [buildings, meta, refetchBuildings] = useFecthApi('building', query, {});
  const { createData, loading: createLoading, error: createError, success: createSuccess } = useCreateApi();
  const { updateData, loading: updateLoading, error: updateError, success: updateSuccess } = useUpdateApi();
  const { deleteData, loading: deleteLoading, error: deleteError, success: deleteSuccess } = useDeleteApi();
  
  // Set initial loading to false after first load
  useEffect(() => {
    if (buildings.length > 0) {
      setInitialLoading(false);
    }
  }, [buildings.length]);

  // Hiển thị thông báo lỗi và thành công
  useEffect(() => {
    if (createError) toast.error(`Lỗi khi thêm tòa nhà: ${createError}`);
    if (updateError) toast.error(`Lỗi khi cập nhật tòa nhà: ${updateError}`);
    if (deleteError) toast.error(`Lỗi khi xóa tòa nhà: ${deleteError}`);
  }, [createError, updateError, deleteError]);

  useEffect(() => {
    if (createSuccess) {
      toast.success('Thêm tòa nhà thành công');
      refetchBuildings();
    }
    if (updateSuccess) {
      toast.success('Cập nhật tòa nhà thành công');
      refetchBuildings();
    }
    if (deleteSuccess) {
      toast.success('Xóa tòa nhà thành công');
      refetchBuildings();
    }
  }, [createSuccess, updateSuccess, deleteSuccess, refetchBuildings]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  // Handle capacity filter change
  const handleCapacityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterByCapacity(e.target.value);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('name');
    setFilterByCapacity('');
  };
  
  // Open add modal
  const handleOpenAddModal = () => {
    setSelectedBuilding(null);
    setIsAddModalOpen(true);
  };
  
  // Open edit modal
  const handleOpenEditModal = (building: Building) => {
    setSelectedBuilding(building);
    setIsEditModalOpen(true);
  };
  
  // Open delete modal
  const handleOpenDeleteModal = (building: Building) => {
    setSelectedBuilding(building);
    setIsDeleteModalOpen(true);
  };
  
  // Handle add building
  const handleAddBuilding = async (buildingData: Partial<Building>) => {
    await createData('building', buildingData);
    if (!createError) {
      setIsAddModalOpen(false);
    }
  };
  
  // Handle edit building
  const handleEditBuilding = async (buildingData: Partial<Building>) => {
    if (!selectedBuilding) return;
    
    await updateData(`building/${selectedBuilding.id}`, buildingData);
    if (!updateError) {
      setIsEditModalOpen(false);
    }
  };
  
  // Handle delete building
  const handleDeleteBuilding = async () => {
    if (!selectedBuilding) return;
    
    await updateData(`building/delete/${selectedBuilding.id}`,{status: false});
    if (!deleteError) {
      setIsDeleteModalOpen(false);
    }
  };

  const goToPage = (page: number) => {
    updateQuery({ ...query, page });
  };
  
  // Filter active buildings
  const activeBuildings = useMemo(() => {
    return buildings.filter((building: Building) => building.deletedAt === null);
  }, [buildings]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dormitory Buildings</h1>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
        >
          <i className="fas fa-plus mr-2"></i>
          Thêm tòa nhà
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <form onSubmit={handleSearch} className="flex flex-row gap-4 items-center justify-between">
          {/* Search input */}
          <div className="relative w-[50%]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search buildings by name or address..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i className="fas fa-times-circle text-gray-400 hover:text-gray-600"></i>
              </button>
            )}
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <select
                id="sortBy"
                value={sortBy}
                onChange={handleSortChange}
                className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="name">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="rating">Highest Rating</option>
                <option value="rooms">Most Rooms</option>
              </select>
            </div>
            
            <div className="w-full md:w-auto">
              <select
                id="capacity"
                value={filterByCapacity}
                onChange={handleCapacityChange}
                className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Any Capacity</option>
                <option value="4">4 or less</option>
                <option value="6">6 or less</option>
                <option value="8">8 or less</option>
              </select>
            </div>
            
            <div className="w-full md:w-auto flex items-end">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Apply Filters
              </button>
              
              <button
                type="button"
                onClick={resetFilters}
                className="ml-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Active filters */}
      {(searchTerm || sortBy !== 'name' || filterByCapacity) && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">Active filters:</span>
          
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Search: {searchTerm}
              <button 
                onClick={() => setSearchTerm('')} 
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times-circle"></i>
              </button>
            </span>
          )}
          
          {sortBy !== 'name' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Sort: {sortBy === 'name_desc' ? 'Name (Z-A)' : 
                    sortBy === 'rating' ? 'Highest Rating' : 
                    sortBy === 'rooms' ? 'Most Rooms' : sortBy}
              <button 
                onClick={() => setSortBy('name')} 
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times-circle"></i>
              </button>
            </span>
          )}
          
          {filterByCapacity && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Capacity: {filterByCapacity} or less
              <button 
                onClick={() => setFilterByCapacity('')} 
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times-circle"></i>
              </button>
            </span>
          )}
          
          <button
            onClick={resetFilters}
            className="text-xs text-primary-600 hover:text-primary-800 font-medium ml-2"
          >
            Clear all filters
          </button>
        </div>
      )}
     
      {/* Loading state */}
      {initialLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      )}
      
      {/* Buildings grid */}
      {buildings && buildings.length > 0 && (
        <>
          {activeBuildings.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
              {activeBuildings.map((building: Building) => (
                <Card key={building.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-56">
                    <img 
                      src={building.image || defaultBuildingImage} 
                      alt={building.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white text-xl font-semibold">{building.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-amber-400 mr-1">★</span>
                        <span className="text-white">{building.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenEditModal(building);
                        }}
                        className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                        title="Edit building"
                      >
                        <i className="fas fa-edit text-gray-700"></i>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenDeleteModal(building);
                        }}
                        className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                        title="Delete building"
                      >
                        <i className="fas fa-trash text-red-600"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center mb-3 text-sm text-gray-600">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      <p className="line-clamp-1">{building.address}</p>
                    </div>
                    
                    <div className="flex items-center mb-3 gap-4">
                      <div className="flex items-center">
                        <i className="fas fa-building mr-2 text-gray-500"></i>
                        <span>{building.floors} floors</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-door-open mr-2 text-gray-500"></i>
                        <span>{building.rooms.length} rooms</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-2 text-sm">{building.description}</p>
                    
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                      <Link 
                        to={`/buildings/${building.id}`}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
                      >
                        View Details
                      </Link>
                      <span className="text-sm font-medium text-primary-600">
                        From {building.rooms.length > 0 
                          ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                              Math.min(...building.rooms.map(room => parseInt(room.price)))
                            )
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-md">
              <i className="fas fa-building text-gray-300 text-5xl mb-4"></i>
              <p className="text-xl text-gray-500 font-medium">No buildings found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                  }}
                  className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
          
          {/* Pagination */}
          <div className="mt-8 relative">
            <Pagination 
              totalItems={meta.total}
              currentPage={query.page}
              onPageChange={goToPage}
              itemsPerPage={query.limit}
            />
          </div>
        </>
      )}
      
      {/* Add Building Modal */}
      <BuildingFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBuilding}
        title="Thêm tòa nhà mới"
      />
      
      {/* Edit Building Modal */}
      <BuildingFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditBuilding}
        building={selectedBuilding || undefined}
        title="Chỉnh sửa tòa nhà"
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteBuilding}
        title="Xóa tòa nhà"
        message={`Bạn có chắc chắn muốn xóa tòa nhà "${selectedBuilding?.name}" không? Hành động này không thể hoàn tác.`}
      />
    </div>
  );
};

export default Buildings; 