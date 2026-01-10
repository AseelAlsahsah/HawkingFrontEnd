import React, { useState, useEffect, useCallback } from 'react';
import {
  adminFetchCategories
} from '../../../services/api';
import type { AdminCategory } from '../../../services/api';
import CategoryFormModal from './CategoryFormModal';
import CategoryActions from './CategoryActions';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../Pagination';
import { useTranslation } from 'react-i18next';
import { pickLang } from '../../../utils/i18nHelpers';
import LanguageSwitcher from '../../LanguageSwitcher';

const CategoriesManagement: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const { t } = useTranslation();

  const getErrorMessage = (err: any, fallback = 'Something went wrong') => {
    return (
      err.response?.data?.status?.description ||
      err?.response?.data?.message ||
      err?.message ||
      fallback
    );
  };

  const fetchCategories = useCallback(async (pageNum: number = 0) => {
    setLoading(true);
    setError('');
    try {
      const data = await adminFetchCategories({ page: pageNum, size: 20 });
      setCategories(data.content || []);
      setPage(data.page?.number || 0);
      setTotalPages(data.page?.totalPages || 0);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Fetch categories error'));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNewCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category: AdminCategory) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleFormSuccess = async (pageNum: number) => {
    setError('');
    await fetchCategories(pageNum);
  };

  useEffect(() => {
    fetchCategories(0);
  }, [fetchCategories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-pulse">
            <div className="w-8 h-8 bg-white rounded-xl"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('admin.categories.loadingTitle')}</h2>
          <p className="text-gray-600">{t('admin.categories.loadingSubtitle')}</p>
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
                {t('admin.categories.title')}
              </h1>
              <p className="mt-1 text-sm text-gray-600 font-medium">
                {t('admin.categories.subtitle')}
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
                onClick={handleNewCategory}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                {t('admin.categories.addNew')}
              </button>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && !showForm && (
          <div className="bg-red-50/90 border border-red-200 text-red-800 px-6 py-4 rounded-2xl text-sm mb-8 backdrop-blur-sm shadow-sm">
            {error}
          </div>
        )}

        {/* Empty State */}
        {categories.length === 0 && !loading ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
              <span className="text-3xl text-gray-400">📦</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('admin.categories.emptyTitle')}</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t('admin.categories.emptySubtitle')}
            </p>
            <button
              onClick={handleNewCategory}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-2xl hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 mx-auto"
            >
              {t('admin.categories.addFirst')}
            </button>
          </div>
        ) : (
          /* Table */
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.categories.table.name')}</th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.categories.table.description')}</th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.categories.table.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50/80 transition-all duration-200">
                      <td className="px-6 py-6 text-center">
                        <span className="px-3 py-1 font-semibold text-gray-900">
                          {pickLang(category.name, category.arabicName)}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <p className="font-semibold text-gray-900 max-w-md">{pickLang(category.description, category.arabicDescription)}</p>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <CategoryActions
                          category={category}
                          onEdit={handleEdit}
                          fetchCategories={fetchCategories}
                          page={page}
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
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => fetchCategories(p)}
          />
        )}
      </div>

      <CategoryFormModal
        showForm={showForm}
        editingCategory={editingCategory}
        onClose={handleFormClose}
        onSubmitSuccess={handleFormSuccess}
        page={page}
      />
    </div>
  );
};

export default CategoriesManagement;
