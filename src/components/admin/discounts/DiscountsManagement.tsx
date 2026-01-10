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
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../LanguageSwitcher';
import ModalPortal from '../../ModalPortal';

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
  const { t } = useTranslation();

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
      setFormError(t('admin.discounts.errors.invalidPercentage'));
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
          {t('admin.discounts.loading')}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t('admin.discounts.title')}
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-1">
                {t('admin.discounts.subtitle')}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 sm:justify-end">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 text-sm font-semibold text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('common.backToDashboard')}
              </button>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-xl flex items-center gap-2"
              >
                {t('admin.discounts.addNew')}
              </button>
              <LanguageSwitcher />
            </div>
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
              {t('admin.discounts.all', { count: pageMeta?.totalElements ?? 0 })}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">{t('admin.discounts.percentage')}</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">{t('admin.discounts.startDate')}</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">{t('admin.discounts.endDate')}</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">{t('admin.discounts.endDate')}</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">{t('admin.discounts.itemsCount')}</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {discounts.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {formatPercentage(d.percentage)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400 sm:hidden">
                          {t('admin.discounts.startDate')}
                        </span>
                        <span className="whitespace-nowrap">
                          {formatDateTime(d.startDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400 sm:hidden">
                          {t('admin.discounts.endDate')}
                        </span>
                        <span className="whitespace-nowrap">
                          {formatDateTime(d.endDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {d.isActive ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full
                                            bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {t('common.active')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full
                                            bg-gray-100 text-gray-600 border border-gray-300">
                          {t('common.inactive')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 border border-gray-200">
                        {d.items.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {/* ================= DESKTOP ACTIONS ================= */}
                      <div className="hidden sm:flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(d)}
                          className="px-2 py-1 text-xs font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
                        >
                          {t('common.edit')}
                        </button>
                        <button
                          onClick={() => setViewItemsDiscount(d)}
                          className="px-1 py-1 text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 rounded-lg hover:bg-sky-100 shadow-sm"
                        >
                          {t('admin.discounts.viewItems')}
                        </button>
                        <button
                          onClick={() => openItemsModal(d, 'add')}
                          className="px-1 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 shadow-sm"
                        >
                          {t('admin.discounts.addItems')}
                        </button>
                        <button
                          onClick={() => openItemsModal(d, 'remove')}
                          className="px-1 py-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 shadow-sm"
                        >
                          {t('admin.discounts.removeItems')}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(d)}
                          className="px-1 py-1 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 shadow-sm"
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                      {/* ================= MOBILE ACTION MENU ================= */}
                      <div className="relative sm:hidden flex justify-center">
                        <button
                          onClick={() =>
                            setViewItemsDiscount(
                              viewItemsDiscount?.id === d.id ? null : d
                            )
                          }
                          className="p-2 rounded-lg border border-gray-300 bg-white shadow-sm"
                          aria-label="Actions"
                        >
                          ⋮
                        </button>
                        {viewItemsDiscount?.id === d.id && (
                          <div className="absolute right-0 top-10 z-30 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                            <button
                              onClick={() => {
                                setViewItemsDiscount(null);
                                openEditModal(d);
                              }}
                              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                            >
                              {t('common.edit')}
                            </button>
                            <button
                              onClick={() => {
                                setViewItemsDiscount(null);
                                setViewItemsDiscount(d);
                              }}
                              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                            >
                              {t('admin.discounts.viewItems')}
                            </button>
                            <button
                              onClick={() => {
                                setViewItemsDiscount(null);
                                openItemsModal(d, 'add');
                              }}
                              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                            >
                              {t('admin.discounts.addItems')}
                            </button>
                            <button
                              onClick={() => {
                                setViewItemsDiscount(null);
                                openItemsModal(d, 'remove');
                              }}
                              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                            >
                              {t('admin.discounts.removeItems')}
                            </button>
                            <button
                              onClick={() => {
                                setViewItemsDiscount(null);
                                setDeleteTarget(d);
                              }}
                              className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                            >
                              {t('common.delete')}
                            </button>
                          </div>
                        )}
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
        <ModalPortal>
          <DeleteDiscountModal
            discount={deleteTarget}
            loading={deleteLoading}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        </ModalPortal>
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
