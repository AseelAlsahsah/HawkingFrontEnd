import React from 'react';
import type { AdminDiscount } from '../../../services/adminApi';
import { useTranslation } from 'react-i18next';
import { pickLang } from '../../../utils/i18nHelpers';

interface Props {
  discount: AdminDiscount;
  onClose: () => void;
}

const DiscountItemsModal: React.FC<Props> = ({ discount, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 bg-black/10 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-bold">
            {t('admin.discounts.items.title', { percentage: discount.percentage })}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {discount.items.length === 0 ? (
            <p className="text-gray-500">{t('admin.discounts.items.empty')}</p>
          ) : (
            discount.items.map(item => (
              <div key={item.id} className="border rounded-xl p-4">
                <p className="font-semibold">{pickLang(item.name, item.arabicName)}</p>
                <p className="text-xs text-gray-500">{item.code}</p>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountItemsModal;
