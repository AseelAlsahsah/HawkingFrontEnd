import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminFetchReservations,
  adminUpdateReservationStatus
} from '../../../services/adminApi';
import type {
  AdminReservation,
  PageMeta
} from '../../../services/adminApi';
import Pagination from '../../Pagination';
import ReservationDetailsModal from './ReservationDetailsModal';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../LanguageSwitcher';

const ReservationsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [page, setPage] = useState(0);
  const [pageMeta, setPageMeta] = useState<PageMeta>({ size: 20, number: 0, totalElements: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<AdminReservation | null>(null);
  const { t } = useTranslation();

  const getErrorMessage = (err: any, fallback = 'Something went wrong') => {
    return (
      err?.response?.data?.message ||
      err.response?.data?.status?.description ||
      err?.message ||
      fallback
    );
  };

  const fetchReservations = useCallback(async (pageNum: number = 0) => {
    try {
      setLoading(true);
      setError('');
      const data = await adminFetchReservations({ page: pageNum, size: 10 });
      setReservations(data.content);
      setPageMeta(data.page);
      setPage(data.page.number);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to load reservations'));
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations(page);
  }, [page, fetchReservations]);

  const handleStatusUpdate = async (reservationId: number, newStatus: string) => {
    try {
      setUpdatingId(reservationId);
      await adminUpdateReservationStatus(reservationId, newStatus);
      await fetchReservations();
    } catch (err: any) {
      setError(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      CONFIRMED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
      CLOSED: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-JO', {
      style: 'currency',
      currency: 'JOD',
      minimumFractionDigits: 3,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-JO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            {t('admin.reservations.loading')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('admin.reservations.title')}</h1>
                <p className="mt-1 text-sm text-gray-500 font-medium">
                  {t('admin.reservations.subtitle')}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 text-sm font-semibold text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('common.backToDashboard')}
              </button>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Reservations Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              {t('admin.reservations.allTitle', { count: pageMeta.totalElements })}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('admin.reservations.table.customer')}</th>
                  <th className="px-15 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('admin.reservations.table.date')}</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('admin.reservations.table.items')}</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('admin.reservations.table.phone')}</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('admin.reservations.table.total')}</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('admin.reservations.table.status')}</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('admin.reservations.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-semibold text-gray-900">{reservation.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 font-medium">
                        {formatDate(reservation.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900 font-medium">
                        {t('admin.reservations.itemsCount', {
                          count: reservation.items.length
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-mono text-gray-900">{reservation.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-medium font-semibold text-gray-900">
                        {formatPrice(reservation.totalPrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full border shadow-sm ${getStatusColor(reservation.status)}`}>
                        {t(`admin.reservations.status.${reservation.status.toLowerCase()}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center gap-2 flex-wrap">
                        <select
                          value={reservation.status}
                          onChange={(e) => handleStatusUpdate(reservation.id, e.target.value as any)}
                          disabled={updatingId === reservation.id}
                          className="px-3 py-1.5 text-xs font-semibold bg-white border border-gray-300 rounded-lg shadow-sm hover:border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <option value="CONFIRMED">{t('admin.reservations.status.confirmed')}</option>
                          <option value="CANCELLED">{t('admin.reservations.status.cancelled')}</option>
                          <option value="CLOSED">{t('admin.reservations.status.closed')}</option>
                        </select>
                        <button
                          onClick={() => setSelectedReservation(reservation)}
                          className="px-2 py-1 text-xs font-bold text-blue-800 whitespace-nowrap"
                          title="View all items"
                        >
                          {t('common.viewDetails')}
                        </button>
                        {updatingId === reservation.id && (
                          <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Items Modal */}
        {selectedReservation && (
          <ReservationDetailsModal
            reservation={selectedReservation}
            onClose={() => setSelectedReservation(null)}
          />
        )}
        {/* Pagination */}
        {pageMeta.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={pageMeta.totalPages}
            onChange={(p) => fetchReservations(p)}
          />
        )}
      </div>
    </div>
  );
};

export default ReservationsManagement;
