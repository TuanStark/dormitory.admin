import React from 'react';
import { User } from '../../types';
import ConfirmationModal from '../ui/ConfirmationModal';

interface UserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  isLoading?: boolean;
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  user, 
  isLoading = false 
}) => {
  if (!user) return null;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xóa người dùng"
      message={`Bạn có chắc chắn muốn xóa người dùng "${user.fullName}" không? Hành động này không thể hoàn tác.`}
      confirmText="Xóa người dùng"
      confirmVariant="danger"
      icon="fas fa-trash-alt"
      isLoading={isLoading}
    />
  );
};

export default UserDeleteModal; 