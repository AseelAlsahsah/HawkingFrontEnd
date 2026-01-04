import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

/* ===================== FORMATTERS ===================== */
const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-JO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-JO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
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
  const fetchDiscounts = useCallback(async (pageNum: number = page) => {
    try {
      setLoading(true);
      setError('');
      const data = await adminFetchDiscounts({ page: pageNum, size: 20 });
      setDiscounts(data.content);
      setPageMeta(data.page);
      setPage(data.page.number);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load discounts');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchDiscounts(0);
  }, [fetchDiscounts]);

  /* ===================== PAGINATION ===================== */
  const canPrev = useMemo(() => pageMeta && page > 0, [pageMeta, page]);
  const canNext = useMemo(
    () => pageMeta && page < pageMeta.totalPages - 1,
    [pageMeta, page]
  );

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
      setFormError(err?.response?.data?.message || 'Failed to save discount');
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
      err?.response?.data?.message ||
      err.response?.data?.status?.description ||
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

  /* ===================== LOADING ===================== */
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

  /* ===================== RENDER ===================== */
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ===================== HEADER ===================== */}
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

          {/* ===================== PAGINATION ===================== */}
          {pageMeta && pageMeta.totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Page {page + 1} of {pageMeta.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={!canPrev}
                  onClick={() => fetchDiscounts(page - 1)}
                  className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={!canNext}
                  onClick={() => fetchDiscounts(page + 1)}
                  className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ===================== EDIT / CREATE MODAL ===================== */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
              <h3 className="text-2xl font-bold">
                {editingDiscount ? 'Edit Discount' : 'New Discount'}
              </h3>
              <button onClick={() => setShowFormModal(false)}>✕</button>
            </div>

            <form onSubmit={submitDiscount} className="px-6 py-5 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Percentage *</label>
                <input
                  value={formState.percentage}
                  type="number"
                  onChange={(e) => setFormState(s => ({ ...s, percentage: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Discount %"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                <input
                  type="datetime-local"
                  value={formState.startDate}
                  onChange={e => setFormState(s => ({ ...s, startDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
                <input
                  type="datetime-local"
                  value={formState.endDate}
                  onChange={e => setFormState(s => ({ ...s, endDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  required
                />
              </div>

              {/* ===================== ACTIVE TOGGLE ===================== */}
              <div className="flex items-center justify-between pt-2">
                <div>
                    <p className="text-sm font-semibold text-gray-900">
                    Discount Status
                    </p>
                    <p className="text-xs text-gray-500">
                    {formState.isActive
                        ? 'Discount is active and can be applied'
                        : 'Discount is inactive and will not apply'}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                    setFormState(s => ({ ...s, isActive: !s.isActive }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${formState.isActive ? 'bg-emerald-500' : 'bg-gray-300'}
                    `}
                >
                    <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform
                        ${formState.isActive ? 'translate-x-5' : 'translate-x-1'}
                    `}
                    />
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== VIEW ITEMS MODAL (DETAIL STYLE) ===================== */}
      {viewItemsDiscount && (
        <div className="fixed inset-0 z-50 bg-black/10 flex items-center justify-center p-4">
            <div className="bg-white/95 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">

            {/* Header */}
            <div className="sticky top-0 bg-white/100 border-b border-gray-200 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Discount Items
                    </h2>
                    <p className="text-sm text-gray-500">
                    {formatPercentage(viewItemsDiscount.percentage)} discount •{' '}
                    {viewItemsDiscount.items.length} items
                    </p>
                </div>
                <button
                    onClick={() => setViewItemsDiscount(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                    ✕
                </button>
                </div>
            </div>

            {/* Items Grid */}
            <div className="p-6">
                {viewItemsDiscount.items.length === 0 ? (
                <p className="text-sm text-gray-500">
                    No items are assigned to this discount.
                </p>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {viewItemsDiscount.items.map(item => (
                    <div
                        key={item.id}
                        className="group bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        <div className="flex flex-col h-full">
                        {/* Image */}
                        <div className="w-full h-24 mb-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.imageUrl ? (
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={e => {
                                e.currentTarget.style.display = 'none';
                                (e.currentTarget.parentElement as HTMLElement).innerHTML = `
                                    <div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <span class="text-xs text-gray-500 font-medium">No Image</span>
                                    </div>
                                `;
                                }}
                            />
                            ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500 font-medium">
                                No Image
                                </span>
                            </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-h-0">
                            <h4 className="font-semibold text-gray-900 text-sm mb-2 leading-tight line-clamp-2">
                            {item.name}
                            </h4>

                            <div className="space-y-1">
                            <div className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded w-fit">
                                {item.code}
                            </div>

                            {(item.category || item.karat) && (
                                <div className="text-xs text-gray-600">
                                {item.category?.name}
                                {item.karat ? ` • ${item.karat.displayName}` : ''}
                                </div>
                            )}
                            </div>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end rounded-b-2xl">
                <button
                onClick={() => setViewItemsDiscount(null)}
                className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                Close
                </button>
            </div>
            </div>
        </div>
      )}

      {/* ===================== DELETE CONFIRMATION ===================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Delete Discount</h3>
            </div>
            <div className="px-6 py-5 text-sm text-gray-700">
              <p>Are you sure you want to delete discount {deleteTarget.percentage}% ?</p>
              <p>Applied from {formatDate(deleteTarget.startDate)} to {formatDate(deleteTarget.endDate)}</p>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
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
