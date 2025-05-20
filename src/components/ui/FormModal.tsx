import React, { ReactNode } from 'react';
import Modal from './Modal';
import Button from './Button';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  children: ReactNode;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  formId?: string;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitText = 'Lưu',
  cancelText = 'Hủy',
  isLoading = false,
  size = 'md',
  formId = 'modal-form',
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

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
        variant="primary"
        size="sm"
        type="submit"
        form={formId}
        disabled={isLoading}
        icon={isLoading ? 'fas fa-spinner fa-spin' : undefined}
      >
        {isLoading ? 'Đang xử lý...' : submitText}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size={size}
    >
      <form id={formId} onSubmit={handleSubmit}>
        {children}
      </form>
    </Modal>
  );
};

export default FormModal; 