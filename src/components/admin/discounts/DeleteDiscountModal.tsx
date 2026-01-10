import React from 'react';
import type { AdminDiscount } from '../../../services/adminApi';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border">
        <div className="p-4 border-b font-bold">{t('admin.discounts.delete.title')}</div>
        <div className="p-6 text-sm">
          {t('admin.discounts.delete.message', { percentage: discount.percentage })}
        </div>
        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-100 rounded-lg">
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            {loading ? t('common.deleting') : t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDiscountModal;
