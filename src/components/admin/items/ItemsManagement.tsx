import React, { useState, useEffect, useCallback } from 'react';
import { adminFetchCategories } from '../../../services/api';
import { adminFetchItems, adminGetItemByCode } from '../../../services/adminApi';
import type { Item, AdminCategory } from '../../../services/api';
import type { AdminItem } from '../../../services/adminApi';
import AdminSearchBar from '../AdminSearchBar';
import AdminCodeSearchBar from '../AdminCodeSearchBar';
import ItemActions from './ItemActions';
import ItemFormModal from './ItemFormModal';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../Pagination';
import { useTranslation } from 'react-i18next';
import { pickLang } from '../../../utils/i18nHelpers';
import LanguageSwitcher from '../../LanguageSwitcher';

const ItemsManagement: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [nameSearchActive, setNameSearchActive] = useState(false);
  const [codeSearchActive, setCodeSearchActive] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminItem | null>(null);
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const { t } = useTranslation();

  const getImageSrc = (url?: string) => {
    return url && url.trim() !== ''
      ? url
      : 'placeholder.png';
  };

  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const data = await adminFetchCategories({ page: 0, size: 20 });
      setCategories(data.content || []);
    } catch (err: any) {
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const getErrorMessage = (err: any, fallback = 'Something went wrong') => {
    return (
      err?.response?.data?.message ||
      err.response?.data?.status?.description ||
      err?.message ||
      fallback
    );
  };

  const fetchItems = useCallback(async (pageNum: number = 0, category?: string) => {
    setLoading(true);
    setError('');
    setNameSearchActive(false);
    setCodeSearchActive(false);
    try {
      const data = await adminFetchItems({
        page: pageNum,
        size: 10,
        categoryName: category || undefined
      });
      setItems(data.content || []);
      setPage(data.page?.number || 0);
      setTotalPages(data.page?.totalPages || 0);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to load items'));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchItemByCode = useCallback(async (code: string): Promise<AdminItem> => {
    try {
      const fullItem = await adminGetItemByCode(code);
      return fullItem;
    } catch (err: any) {
      throw new Error(`Item "${code}" not found in database`);
    }
  }, []);

  const handleSearch = useCallback((searchType: 'name' | 'code', results: Item[]) => {
    if (!results || results.length === 0) {
      setItems([]);
      if (searchType === 'name') {
        setNameSearchActive(true);
        setCodeSearchActive(false);
      } else {
        setCodeSearchActive(true);
        setNameSearchActive(false);
      }
      setPage(0);
      setTotalPages(1);
      return;
    }

    const adminItems: AdminItem[] = results.map(item => ({
      id: item.id || 0,
      code: item.code,
      name: item.name,
      description: item.description || '',
      arabicName: item.arabicName,
      arabicDescription: item.arabicDescription || '',
      weight: item.weight,
      category: {
        id: 0,
        name: item.categoryName || 'Search Result',
        description: '',
        arabicName: item.arabicCategoryName,
        imageUrl: null
      },
      karat: {
        id: 0,
        name: item.karatName || 'Unknown',
        displayName: `${item.karatName || ''}K`
      },
      factoryPrice: item.factoryPrice,
      imageUrl: item.imageUrl || '',
      inStockCount: item.inStockCount,
      isActive: true,
      priceBeforeDiscount: item.priceBeforeDiscount || 0,
      reservedCount: (item as any).reservedCount || 0,
      discountPercentage: item.discountPercentage ?? undefined,
      priceAfterDiscount: item.priceAfterDiscount ?? undefined,
      goldPricePerGram: 0,
    }));

    setItems(adminItems);
    if (searchType === 'name') {
      setNameSearchActive(true);
      setCodeSearchActive(false);
    } else {
      setCodeSearchActive(true);
      setNameSearchActive(false);
    }
    setPage(0);
    setTotalPages(1);
  }, []);

  const handleClearNameSearch = useCallback(() => {
    setNameSearchActive(false);
    if (!codeSearchActive) {
      fetchItems(0, categoryFilter || undefined);
    }
  }, [fetchItems, categoryFilter, codeSearchActive]);

  const handleClearCodeSearch = useCallback(() => {
    setCodeSearchActive(false);
    if (!nameSearchActive) {
      fetchItems(0, categoryFilter || undefined);
    }
  }, [fetchItems, categoryFilter, nameSearchActive]);

  const handleClearAllSearch = useCallback(() => {
    setNameSearchActive(false);
    setCodeSearchActive(false);
    fetchItems(0, categoryFilter || undefined);
  }, [fetchItems, categoryFilter]);

  const handleNewItem = () => {
    setEditingItem(null);
    setModalError('');
    setShowForm(true);
  };

  const handleEdit = async (item: AdminItem) => {
    let fullItem: AdminItem = item;
    if ((nameSearchActive || codeSearchActive) || !item.id || item.id === 0) {
      try {
        fullItem = await fetchItemByCode(item.code!);
      } catch (err: any) {
        setError(getErrorMessage(err, 'Failed to load items'));
        return;
      }
    }
    setEditingItem(fullItem);
    setModalError('');
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
    setModalError('');
  };

  const handleFormSuccess = async (pageNum: number, category: string) => {
    setError('');
    setModalError('');
    await fetchItems(pageNum, category);
  };

  useEffect(() => {
    fetchCategories();
    fetchItems(0);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenItemId(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-pulse">
            <div className="w-8 h-8 bg-white rounded-xl"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('admin.items.loadingTitle')}</h2>
          <p className="text-gray-600">{t('admin.items.loadingSubtitle')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t('admin.items.title')}
              </h1>
              <p className="mt-1 text-sm sm:text-lg text-gray-600 font-medium">
                {t('admin.items.subtitle')}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
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
                onClick={handleNewItem}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl flex items-center gap-2"
              >
                {t('admin.items.addNew')}
              </button>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Fields */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Name Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                {t('admin.items.searchByName')}
              </label>
              <AdminSearchBar
                onSearch={(results) => handleSearch('name', results)}
                onClear={handleClearNameSearch}
              />
            </div>

            {/* Code Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                {t('admin.items.searchByCode')}
              </label>
              <AdminCodeSearchBar
                onSearch={(results: Item[]) => handleSearch('code', results)}
                onClear={handleClearCodeSearch}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">{t('admin.items.filterCategory')}</label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  const newCategory = e.target.value;
                  setCategoryFilter(newCategory);
                  setPage(0);
                  setNameSearchActive(false);
                  setCodeSearchActive(false);
                  fetchItems(0, newCategory || undefined);
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/50 backdrop-blur-sm shadow-sm disabled:opacity-50"
                disabled={(nameSearchActive || codeSearchActive) || categoriesLoading}
              >
                <option value="">{t('admin.items.allCategories')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {pickLang(category.name, category.arabicName)}
                  </option>
                ))}
              </select>
              {categoriesLoading && (
                <p className="text-xs text-gray-500 mt-1"> {t('common.loading')}</p>
              )}
            </div>
          </div>

          {/* Search Status */}
          {(nameSearchActive || codeSearchActive) && (
            <div className="mt-6 p-2 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="text-sm font-medium text-amber-700 flex items-center gap-2 justify-between">
                <span>{t('admin.items.showingResults')}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearAllSearch}
                    className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-lg hover:bg-red-200"
                  >
                    {t('admin.items.clearSearch')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Only show list errors when modal is CLOSED */}
        {error && !showForm && (
          <div className="bg-red-50/90 border border-red-200 text-red-800 px-6 py-4 rounded-2xl text-sm mb-8 backdrop-blur-sm shadow-sm">
            {error}
          </div>
        )}

        {/* Table Logic */}
        {items.length === 0 && !loading ? (
          (nameSearchActive || codeSearchActive) ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('admin.items.noItems')}</h3>
              <p className="text-gray-600 mb-8">{t('admin.items.noItemsHint')}</p>
              <button
                onClick={handleClearAllSearch}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 mx-auto"
              >
                {t('admin.items.clearSearch')}
              </button>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mb-6">
                <span className="text-3xl text-gray-400">📦</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('admin.items.noItems')}</h3>
              <p className="text-gray-600 mb-4">{t('admin.items.noItemsHint')}</p>
              <button
                onClick={handleNewItem}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-2xl hover:shadow-xl transition-all"
              >
                {t('admin.items.addFirst')}
              </button>
            </div>
          )
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-10 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.items.table.code')}</th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.items.table.item')}</th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.items.table.category')}</th>
                    <th className="px-2 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.items.table.karat')}</th>
                    <th className="px-2 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.items.table.weight')}</th>
                    <th className="px-10 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.items.table.stock')}</th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.items.table.price')}</th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.items.table.discount')}</th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.items.table.status')}</th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.items.table.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-all duration-200">
                      <td className="px-6 py-6 font-mono font-bold text-sm text-gray-900">{item.code}</td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={getImageSrc(item.imageUrl)}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover shadow-md ring-2 ring-gray-200"
                            onError={(e) => {
                              const img = e.currentTarget;
                              if (img.src.includes('placeholder')) return;
                              img.src = '/images/placeholder.png';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm text-gray-900 truncate">{pickLang(item.name, item.arabicName)}</p>
                            <p className="text-xs text-gray-500 truncate">{pickLang(item.description, item.arabicDescription)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="inline-flex px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full shadow-sm">
                          {pickLang(item.category.name, item.category.arabicName)}
                        </span>
                      </td>
                      <td className="px-4 py-6 text-center text-medium text-gray-900">
                        {item.karat.displayName}
                      </td>
                      <td dir="ltr" className="px-6 py-6 text-center text-medium text-gray-900">
                        {item.weight.toFixed(1)}g
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div>
                          <span dir="ltr" className={`text-medium font-bold ${item.inStockCount > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {item.inStockCount}
                          </span>
                          {item.reservedCount >= 0 && (
                            <p className="text-xs text-gray-500 mt-1">({t('admin.items.table.reserved', { count: item.reservedCount })})</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div>
                          <p dir="ltr" className="text-lg font-semibold text-gray-900">
                            ${item.priceBeforeDiscount?.toFixed(2) || '0.00'}
                          </p>
                          {item.discountPercentage && item.priceAfterDiscount && (
                            <p dir="ltr" className="text-sm text-emerald-600 font-semibold">
                              ${item.priceAfterDiscount.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div>
                          {item.discountPercentage ? (
                            <p dir="ltr" className="text-sm text-emerald-600 font-semibold">
                              % {item.discountPercentage.toFixed(1)}
                            </p>
                          ) : (
                            <p dir="ltr" className="text-sm text-emerald-600 font-semibold">
                              % 0.0
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm border-2 ${item.isActive
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          : 'bg-gray-100 border-gray-300 text-gray-700'
                          }`}>
                          {item.isActive ? t('admin.items.status.active') : t('admin.items.status.inactive')}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <ItemActions
                          item={item}
                          open={openItemId === item.id}
                          onToggle={() =>
                            setOpenItemId(prev => (prev === item.id ? null : item.id))
                          }
                          onClose={() => setOpenItemId(null)}
                          onEdit={handleEdit}
                          fetchItems={fetchItems}
                          page={page}
                          categoryFilter={categoryFilter}
                          setError={setError}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!nameSearchActive && !codeSearchActive && totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => {
              setPage(p);
              fetchItems(p, categoryFilter || undefined);
            }}
          />
        )}
      </div>

      {/* PASS MODAL ERROR HANDLERS */}
      <ItemFormModal
        showForm={showForm}
        editingItem={editingItem}
        categories={categories}
        onClose={handleFormClose}
        onSubmitSuccess={handleFormSuccess}
        page={page}
        categoryFilter={categoryFilter}
        modalError={modalError}
        setModalError={setModalError}
      />
    </div>
  );
};

export default ItemsManagement;
