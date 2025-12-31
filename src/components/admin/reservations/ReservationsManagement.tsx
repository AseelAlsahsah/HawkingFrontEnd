import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  adminFetchReservations, 
  adminGetReservationById, 
  adminUpdateReservationStatus
} from '../../../services/api';
import type { 
  AdminReservation,
  PageMeta 
} from '../../../services/api';

const ReservationsManagement: React.FC = () => {
  const { token } = useAdminAuth();
  const navigate = useNavigate();
  
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [page, setPage] = useState(0);
  const [pageMeta, setPageMeta] = useState<PageMeta>({ size: 20, number: 0, totalElements: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchReservations = useCallback(async (pageNum: number = page) => {
    try {
      setLoading(true);
      setError('');
      const data = await adminFetchReservations({ page: pageNum, size: 20 });
      setReservations(data.content);
      setPageMeta(data.page);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reservations');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleStatusUpdate = async (reservationId: number, newStatus: string) => {
    try {
      setUpdatingId(reservationId);
      await adminUpdateReservationStatus(reservationId, newStatus);
      // Refresh the list
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            Loading reservations...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 pb-12">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
                <p className="mt-1 text-sm text-gray-500 font-medium">
                  Manage customer reservations and update status
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
                Dashboard
              </button>
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
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-amber-50/30">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              All Reservations ({pageMeta.totalElements})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{reservation.username}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {reservation.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded-lg">
                            ({item.item.code})-{item.item.name} (x{item.quantity})
                          </div>
                        ))}
                        {reservation.items.length > 2 && (
                          <div className="text-sm text-gray-500">+{reservation.items.length - 2} more</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{reservation.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrice(reservation.totalPrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full border shadow-sm ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <select
                          value={reservation.status}
                          onChange={(e) => handleStatusUpdate(reservation.id, e.target.value as any)}
                          disabled={updatingId === reservation.id}
                          className="px-3 py-1.5 text-xs font-semibold bg-white border border-gray-300 rounded-lg shadow-sm hover:border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="CLOSED">Closed</option>
                        </select>
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

          {/* Pagination */}
          {pageMeta.totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-semibold">{page * pageMeta.size + 1}</span> to{' '}
                  <span className="font-semibold">{Math.min((page + 1) * pageMeta.size, pageMeta.totalElements)}</span> of{' '}
                  <span className="font-semibold">{pageMeta.totalElements}</span> results
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(pageMeta.totalPages - 1, p + 1))}
                    disabled={page === pageMeta.totalPages - 1}
                    className="px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationsManagement;
