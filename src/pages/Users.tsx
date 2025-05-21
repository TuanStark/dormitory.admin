import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { User } from '../types';
import fetchUsers from '../utils/api/user';
import { universities } from '../data/mockData';
import Pagination from '../components/ui/Pagination';
import UserViewModal from '../components/users/UserViewModal';
import UserEditModal from '../components/users/UserEditModal';
import UserDeleteModal from '../components/users/UserDeleteModal';

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

const Users = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [sortBy, setSortBy] = useState('fullName');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByCapacity, setFilterByCapacity] = useState('');
  const [filterByUniversity, setFilterByUniversity] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    fetchUsersData(page);
  };

  const fetchUsersData = async (page = 1) => {
    try {
      const response = await fetchUsers(page, itemsPerPage, debouncedSearchTerm, sortBy, filterByCapacity);
      //console.log(response);
      setUserData(response.data);
      setTotalItems(response.total);
      setCurrentPage(response.pageNumber);
      setItemsPerPage(response.limitNumber);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, [debouncedSearchTerm, sortBy, filterByCapacity]);
  
  // Filter users based on search term and filters
  const filteredUsers = userData.filter(user => {
    // Search filter
    const matchesSearch = 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    
    // University filter
    const matchesUniversity = filterByUniversity === '' || user.universityId === parseInt(filterByUniversity);
    
    // Status filter
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'active' && user.status === true) || 
      (statusFilter === 'inactive' && user.status === false);
    
    return matchesSearch && matchesUniversity && matchesStatus;
  });
  
  // Get university name by ID
  const getUniversityName = (universityId: number) => {
    const university = universities.find(u => u.id === universityId);
    return university ? university.shortName : 'Unknown';
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: boolean) => {
    if (status) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };
  
  // Get role badge class
  const getRoleBadgeClass = (roleId: number) => {
    switch (roleId) {
      case 1: // Admin
        return 'bg-purple-100 text-purple-800';
      case 2: // Manager
        return 'bg-blue-100 text-blue-800';
      case 3: // User
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewUser = (userId: number) => {
    console.log(`Viewing user with ID: ${userId}`);
    const selectedUser = userData.find(user => user.id === userId);
    setViewModalOpen(true);
    setSelectedUserId(userId);
  };

  // Handle edit user
  const handleEditUser = (userId: number) => {
    setSelectedUserId(userId);
    setEditModalOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = (userId: number) => {
    setSelectedUserId(userId);
    setDeleteModalOpen(true);
  };

  // Handle submit edit
  const handleSubmitEdit = async (userData: Partial<User>) => {
    if (!selectedUserId) return;
    
    setIsLoading(true);
    setActionError(null);
    
    try {
      // API call to update user
      const response = await fetch(`http://localhost:8000/users/${selectedUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const result = await response.json();
      
      if (result.statusCode === 200) {
        // Update local data
        setUserData(prev => prev.map(user => 
          user.id === selectedUserId ? { ...user, ...userData } : user
        ));
        
        setEditModalOpen(false);
        setActionSuccess('Cập nhật người dùng thành công');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      } else {
        setActionError(result.message || 'Có lỗi xảy ra khi cập nhật người dùng');
      }
    } catch (error) {
      setActionError('Có lỗi xảy ra khi cập nhật người dùng');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedUserId) return;
    
    setIsLoading(true);
    setActionError(null);
    
    try {
      // API call to delete user
      const response = await fetch(`http://localhost:8000/users/${selectedUserId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.statusCode === 200) {
        // Remove from local data
        setUserData(prev => prev.filter(user => user.id !== selectedUserId));
        
        setDeleteModalOpen(false);
        setActionSuccess('Xóa người dùng thành công');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      } else {
        setActionError(result.message || 'Có lỗi xảy ra khi xóa người dùng');
      }
    } catch (error) {
      setActionError('Có lỗi xảy ra khi xóa người dùng');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedUser = selectedUserId ? userData.find(user => user.id === selectedUserId) || null : null;

  return (
    <div className="space-y-6">
      {/* Success message */}
      {actionSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center animate-fadeIn">
          <i className="fas fa-check-circle mr-2 text-green-500"></i>
          <span>{actionSuccess}</span>
        </div>
      )}
      
      {/* Error message */}
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center animate-fadeIn">
          <i className="fas fa-exclamation-circle mr-2 text-red-500"></i>
          <span>{actionError}</span>
          <button 
            className="ml-auto text-red-500 hover:text-red-700"
            onClick={() => setActionError(null)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Người dùng</h1>
        <Button 
          variant="primary"
          icon="fas fa-user-plus"
        >
          Thêm người dùng
        </Button>
      </div> */}
      
      {/* Search and filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={filterByUniversity}
            onChange={(e) => setFilterByUniversity(e.target.value)}
          >
            <option value="">Tất cả trường</option>
            {universities.map(university => (
              <option key={university.id} value={university.id}>
                {university.shortName}
              </option>
            ))}
          </select>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
      </Card>
      
      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trường</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liên hệ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                        {user.fullName?.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.fullName || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{user.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(user.roleId)}`}>
                      {user.roleId === 1 ? 'User': 'Admin'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    {getUniversityName(user.universityId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div>{user.phoneNumber || 'N/A'}</div>
                    {/* <div className="text-xs">{user.address || 'N/A'}</div> */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
                      {user.status ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-primary-600 hover:text-primary-900 mr-3"
                      onClick={() => handleViewUser(user.id)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="text-gray-500 hover:text-gray-700 mr-3"
                      onClick={() => handleEditUser(user.id)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <i className="fas fa-users text-gray-300 text-5xl"></i>
            <p className="mt-4 text-gray-500 text-lg">Không tìm thấy người dùng nào</p>
            <p className="text-gray-400">Hãy thử điều chỉnh bộ lọc của bạn</p>
          </div>
        )}
      </Card>
      
      {/* Pagination */}
      <div className="mt-8 relative">
        <Pagination 
          totalItems={totalItems}
          currentPage={currentPage}
          onPageChange={goToPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
      
      {/* User View Modal */}
      <UserViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        user={selectedUser}
      />
      
      {/* User Edit Modal */}
      <UserEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleSubmitEdit}
        user={selectedUser}
        isLoading={isLoading}
      />
      
      {/* User Delete Modal */}
      <UserDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        user={selectedUser}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Users; 