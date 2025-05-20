import React from 'react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'success' | 'warning';
  icon?: string;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmVariant = 'primary',
  icon = 'fas fa-question-circle',
  isLoading = false,
}) => {
  // Map variant to icon and color
  const variantMap = {
    primary: { iconClass: 'fas fa-question-circle', bgColor: 'bg-primary-50', textColor: 'text-primary-500' },
    danger: { iconClass: 'fas fa-exclamation-triangle', bgColor: 'bg-red-50', textColor: 'text-red-500' },
    success: { iconClass: 'fas fa-check-circle', bgColor: 'bg-green-50', textColor: 'text-green-500' },
    warning: { iconClass: 'fas fa-exclamation-circle', bgColor: 'bg-yellow-50', textColor: 'text-yellow-500' },
  };

  const { iconClass, bgColor, textColor } = variantMap[confirmVariant];
  const displayIcon = icon || iconClass;

  const footer = (
    <div className="flex justify-end space-x-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onClose}
        disabled={isLoading}
      >
        {cancelText}
      </Button>
      <Button
        variant={confirmVariant}
        size="sm"
        onClick={onConfirm}
        disabled={isLoading}
        icon={isLoading ? 'fas fa-spinner fa-spin' : undefined}
      >
        {isLoading ? 'Đang xử lý...' : confirmText}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="sm"
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-full ${bgColor} ${textColor} flex-shrink-0`}>
          <i className={displayIcon}></i>
        </div>
        <div>
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal; 