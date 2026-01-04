import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminFetchDiscounts,
  adminCreateDiscount,
  adminUpdateDiscount,
  adminDeleteDiscount,
  adminAddItemsToDiscount,
  adminRemoveItemsFromDiscount,
  type AdminDiscount,
  type PageMeta,
} from '../../../services/adminApi';
import DiscountItemSelectorModal from './DiscountItemSelectorModal';
import Pagination from '../../Pagination';
import DiscountFormModal from './DiscountFormModal';
import DiscountItemsModal from './DiscountItemsModal';
import DeleteDiscountModal from './DeleteDiscountModal';

/* ===================== FORMATTERS ===================== */
const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-JO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

/* ===================== TYPES ===================== */
interface DiscountFormState {
  percentage: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const DiscountsManagement: React.FC = () => {
  const navigate = useNavigate();

  /* ---------- DATA ---------- */
  const [discounts, setDiscounts] = useState<AdminDiscount[]>([]);
  const [pageMeta, setPageMeta] = useState<PageMeta | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* ---------- FORM ---------- */
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<AdminDiscount | null>(null);
  const [formState, setFormState] = useState<DiscountFormState>({
    percentage: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });
  const [formError, setFormError] = useState('');

  /* ---------- DELETE ---------- */
  const [deleteTarget, setDeleteTarget] = useState<AdminDiscount | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ---------- ITEMS MODAL ---------- */
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemModalMode, setItemModalMode] = useState<'add' | 'remove'>('add');
  const [itemTargetDiscount, setItemTargetDiscount] = useState<AdminDiscount | null>(null);

  const [viewItemsDiscount, setViewItemsDiscount] = useState<AdminDiscount | null>(null);

  /* ===================== FETCH ===================== */
  const fetchDiscounts = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      setError('');
      const data = await adminFetchDiscounts({ page: pageNum, size: 10 });
      setDiscounts(data.content);
      setPageMeta(data.page);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to load discounts'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiscounts(page);
  }, [page, fetchDiscounts]);

  /* ===================== FORM HANDLERS ===================== */
  const openCreateModal = () => {
    setEditingDiscount(null);
    setFormState({
      percentage: '',
      startDate: '',
      endDate: '',
      isActive: true,
    });
    setFormError('');
    setShowFormModal(true);
  };

  const openEditModal = (discount: AdminDiscount) => {
    setEditingDiscount(discount);
    setFormState({
      percentage: discount.percentage.toString(),
      startDate: discount.startDate.slice(0, 16),
      endDate: discount.endDate.slice(0, 16),
      isActive: discount.isActive,
    });
    setFormError('');
    setShowFormModal(true);
  };

  const submitDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    const percentage = parseFloat(formState.percentage);
    if (Number.isNaN(percentage) || percentage <= 0) {
      setFormError('Percentage must be a positive number');
      return;
    }
    try {
      if (editingDiscount) {
        await adminUpdateDiscount(editingDiscount.id, {
          percentage,
          startDate: formState.startDate,
          endDate: formState.endDate,
          isActive: formState.isActive,
        });
      } else {
        await adminCreateDiscount({
          percentage,
          startDate: formState.startDate,
          endDate: formState.endDate,
          isActive: formState.isActive,
          itemCodes: [],
        });
      }
      setShowFormModal(false);
      fetchDiscounts(0);
    } catch (err: any) {
      setFormError(getErrorMessage(err, 'Failed to save discount'));
    }
  };

  /* ===================== DELETE ===================== */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await adminDeleteDiscount(deleteTarget.id);
      setDeleteTarget(null);
      fetchDiscounts(page);
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(getErrorMessage(err, 'Failed to load items'));
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null)
    }
  };

  const getErrorMessage = (err: any, fallback = 'Something went wrong') => {
    return (
      err.response?.data?.status?.description ||
      err?.response?.data?.message ||
      err?.message ||
      fallback
    );
  };

  /* ===================== ITEMS ===================== */
  const openItemsModal = (discount: AdminDiscount, mode: 'add' | 'remove') => {
    setItemTargetDiscount(discount);
    setItemModalMode(mode);
    setItemModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-xl border border-gray-200 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          Loading discounts…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discounts Management</h1>
            <p className="text-sm text-gray-500 font-medium">
              Manage discounts and their assigned items
            </p>
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
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              Add New Discount
            </button>
          </div>
        </div>
      </header>
      {/* ===================== CONTENT ===================== */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl">
            {error}
          </div>
        )}
        {/* ===================== TABLE ===================== */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900">
              All Discounts ({pageMeta?.totalElements ?? 0})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Percentage</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Start Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">End Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Items Count</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {discounts.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {formatPercentage(d.percentage)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDateTime(d.startDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDateTime(d.endDate)}
                    </td>
                    <td className="px-6 py-4">
                      {d.isActive ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full
                                            bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full
                                            bg-gray-100 text-gray-600 border border-gray-300">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 border border-gray-200">
                        {d.items.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(d)}
                          className="px-2 py-1 text-xs font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setViewItemsDiscount(d)}
                          className="px-1 py-1 text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 rounded-lg hover:bg-sky-100 shadow-sm"
                        >
                          View Items
                        </button>
                        <button
                          onClick={() => openItemsModal(d, 'add')}
                          className={"px-1 py-1 text-xs font-semibold rounded-lg border shadow-sm bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"}
                        >
                          Add Items
                        </button>
                        <button
                          onClick={() => openItemsModal(d, 'remove')}
                          className="px-1 py-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 shadow-sm"
                        >
                          Remove Items
                        </button>
                        <button
                          onClick={() => setDeleteTarget(d)}
                          className="px-1 py-1 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* ===================== PAGINATION ===================== */}
        {pageMeta && pageMeta.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={pageMeta.totalPages}
            onChange={(p) => setPage(p)}
          />
        )}
      </main>
      {/* ===================== EDIT / CREATE MODAL ===================== */}
      <DiscountFormModal
        open={showFormModal}
        editingDiscount={editingDiscount}
        formState={formState}
        formError={formError}
        onChange={setFormState}
        onSubmit={submitDiscount}
        onClose={() => setShowFormModal(false)}
      />
      {/* ===================== VIEW ITEMS MODAL (DETAIL STYLE) ===================== */}
      {viewItemsDiscount && (
        <DiscountItemsModal
          discount={viewItemsDiscount}
          onClose={() => setViewItemsDiscount(null)}
        />
      )}
      {/* ===================== DELETE CONFIRMATION ===================== */}
      {deleteTarget && (
        <DeleteDiscountModal
          discount={deleteTarget}
          loading={deleteLoading}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {/* ===================== ITEM SELECTOR ===================== */}
      {itemTargetDiscount && (
        <DiscountItemSelectorModal
          open={itemModalOpen}
          mode={itemModalMode}
          discountId={itemTargetDiscount.id}
          existingItems={itemTargetDiscount.items}
          onClose={() => setItemModalOpen(false)}
          onConfirm={async codes => {
            if (itemModalMode === 'add') {
              await adminAddItemsToDiscount(itemTargetDiscount.id, codes);
            } else {
              await adminRemoveItemsFromDiscount(itemTargetDiscount.id, codes);
            }
            fetchDiscounts(page);
          }}
        />
      )}
    </div>
  );
};

export default DiscountsManagement;
