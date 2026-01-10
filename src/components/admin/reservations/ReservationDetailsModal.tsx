import React from 'react';
import type { AdminReservation } from '../../../services/adminApi';
import { useTranslation } from 'react-i18next';
import { pickLang } from '../../../utils/i18nHelpers';

interface ReservationDetailsModalProps {
  reservation: AdminReservation;
  onClose: () => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-JO', {
    style: 'currency',
    currency: 'JOD',
    minimumFractionDigits: 3,
  }).format(price);

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    CONFIRMED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const ReservationDetailsModal: React.FC<ReservationDetailsModalProps> = ({
  reservation,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {t('admin.reservations.details.title')}
              </h2>
              <p className="text-sm text-gray-500">
                {reservation.username} • {reservation.phoneNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-8">
            {reservation.items.map((itemDetail) => (
              <div
                key={itemDetail.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition"
              >
                {/* Image */}
                <div className="w-full h-20 mb-3 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={itemDetail.item.imageUrl}
                    alt={itemDetail.item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.parentElement as HTMLElement).innerHTML =
                        '<div class="w-full h-full flex items-center justify-center text-xs text-gray-500">No Image</div>';
                    }}
                  />
                </div>

                {/* Content */}
                <h4 className="font-semibold text-sm mb-1">
                  {pickLang(itemDetail.item.name, itemDetail.item.arabicName)}
                </h4>

                <div className="text-xs text-gray-600 mb-2">
                  {itemDetail.item.karat.displayName} • {itemDetail.item.weight}g
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {t('admin.reservations.details.quantity', {
                      count: itemDetail.quantity
                    })}
                  </span>
                  <span className="font-bold text-sm">
                    {formatPrice(
                      itemDetail.item.priceBeforeDiscount *
                      itemDetail.quantity
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gray-100 p-6 border border-gray-200 -mx-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t('admin.reservations.total', {
                    count: reservation.items.length
                  })}
                </p>
                <p className="text-3xl font-bold">
                  {formatPrice(reservation.totalPrice)}
                </p>
              </div>
              <span
                className={`px-4 py-2 text-sm font-semibold rounded-xl border ${getStatusColor(
                  reservation.status
                )}`}
              >
                {t(`admin.reservations.status.${reservation.status.toLowerCase()}`)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailsModal;
