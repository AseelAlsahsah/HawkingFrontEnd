import React from 'react';
import type { AdminDiscount } from '../../../services/adminApi';

interface Props {
  discount: AdminDiscount;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteDiscountModal: React.FC<Props> = ({
  discount,
  loading,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border">
        <div className="p-4 border-b font-bold">Delete Discount</div>
        <div className="p-6 text-sm">
          Are you sure you want to delete {discount.percentage}% discount?
        </div>
        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDiscountModal;
