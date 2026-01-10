import React, { useState, useEffect, useCallback } from 'react';
import {
  adminFetchKarats
} from '../../../services/api';
import type { AdminKarat } from '../../../services/api';
import KaratFormModal from './KaratFormModal';
import KaratActions from './KaratActions';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../Pagination';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../LanguageSwitcher';

const KaratsManagement: React.FC = () => {
  const navigate = useNavigate();

  const [karats, setKarats] = useState<AdminKarat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingKarat, setEditingKarat] = useState<AdminKarat | null>(null);
  const { t } = useTranslation();

  const getErrorMessage = (err: any, fallback = 'Something went wrong') => {
    return (
      err.response?.data?.status?.description ||
      err?.response?.data?.message ||
      err?.message ||
      fallback
    );
  };

  const fetchKarats = useCallback(async (pageNum: number = 0) => {
    setLoading(true);
    setError('');
    try {
      const data = await adminFetchKarats({ page: pageNum, size: 10 });
      setKarats(data.content || []);
      setPage(data.page?.number || 0);
      setTotalPages(data.page?.totalPages || 0);
    } catch (err: any) {
      console.error('Fetch karats error:', err);
      setError(getErrorMessage(err, 'Fetch karats error'));
      setKarats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNewKarat = () => {
    setEditingKarat(null);
    setShowForm(true);
  };

  const handleEdit = async (karat: AdminKarat) => {
    setEditingKarat(karat);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingKarat(null);
  };

  const handleFormSuccess = async (pageNum: number) => {
    setError('');
    await fetchKarats(pageNum);
  };

  useEffect(() => {
    fetchKarats(0);
  }, [fetchKarats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-pulse">
            <div className="w-8 h-8 bg-white rounded-xl"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('admin.karats.loadingTitle')}</h2>
          <p className="text-gray-600">{t('admin.karats.loadingSubtitle')}</p>
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
                {t('admin.karats.title')}
              </h1>
              <p className="mt-1 text-sm text-gray-600 font-medium">
                {t('admin.karats.subtitle')}
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
                onClick={handleNewKarat}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                {t('admin.karats.addNew')}
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
        {karats.length === 0 && !loading ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mb-6">
              <span className="text-3xl text-gray-400">⭐</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('admin.karats.emptyTitle')}</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t('admin.karats.emptySubtitle')}
            </p>
            <button
              onClick={handleNewKarat}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-2xl hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 mx-auto"
            >
              {t('admin.karats.addFirst')}
            </button>
          </div>
        ) : (
          /* Table */
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.karats.table.name')}</th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.karats.table.displayName')}</th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">{t('admin.karats.table.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {karats.map((karat) => (
                    <tr key={karat.id} className="hover:bg-gray-50/80 transition-all duration-200">
                      <td className="px-3 py-6 text-center">
                        <span className="inline-flex px-5 py-1 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 text-sm font-bold rounded-xl shadow-sm">
                          {karat.name}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <p className="font-semibold text-gray-900">{karat.displayName}</p>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <KaratActions
                          karat={karat}
                          onEdit={handleEdit}
                          fetchKarats={fetchKarats}
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
            onChange={(p) => fetchKarats(p)}
          />
        )}
      </div>

      <KaratFormModal
        showForm={showForm}
        editingKarat={editingKarat}
        onClose={handleFormClose}
        onSubmitSuccess={handleFormSuccess}
        page={page}
      />
    </div>
  );
};

export default KaratsManagement;
