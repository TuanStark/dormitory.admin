import React from 'react';
import { User } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserViewModal: React.FC<UserViewModalProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  // Hàm để hiển thị trạng thái user với màu sắc phù hợp
  const getStatusBadgeClass = (status: boolean) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết người dùng"
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xl">
            {user.fullName?.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{user.fullName}</h3>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Số điện thoại</p>
            <p>{user.phoneNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Trạng thái</p>
            <p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
                {user.status ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Vai trò</p>
            <p>{user.roleId === 1 ? 'User' : 'Admin'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ngày tạo</p>
            <p>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserViewModal; 