import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  adminFetchGoldPrices,
  type AdminGoldPrice
} from '../../../services/adminApi';
import GoldPriceFormModal from './GoldPriceFormModal';
import GoldPriceActions from './GoldPriceActions';
import Pagination from '../../Pagination';

const GoldPricesManagement: React.FC = () => {
  const navigate = useNavigate();

  const [goldPrices, setGoldPrices] = useState<AdminGoldPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingGoldPrice, setEditingGoldPrice] = useState<AdminGoldPrice | null>(null);

  const getErrorMessage = (err: any, fallback = 'Something went wrong') => {
    return (
      err.response?.data?.status?.description ||
      err?.response?.data?.message ||
      err?.message ||
      fallback
    );
  };

  const fetchGoldPrices = useCallback(async (pageNum: number = 0) => {
    setLoading(true);
    setError('');
    try {
      const data = await adminFetchGoldPrices({ page: pageNum, size: 10 });
      setGoldPrices(data.content || []);
      setPage(data.page?.number || 0);
      setTotalPages(data.page?.totalPages || 0);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to load gold prices'));
      setGoldPrices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNewGoldPrice = () => {
    setEditingGoldPrice(null);
    setShowForm(true);
  };

  const handleEdit = (goldPrice: AdminGoldPrice) => {
    setEditingGoldPrice(goldPrice);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingGoldPrice(null);
  };

  const handleFormSuccess = async (pageNum: number) => {
    setError('');
    await fetchGoldPrices(pageNum);
  };

  useEffect(() => {
    fetchGoldPrices(0);
  }, [fetchGoldPrices]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-pulse">
            <div className="w-8 h-8 bg-white rounded-xl"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Gold Prices...</h2>
          <p className="text-gray-600">Fetching daily gold prices</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gold Price Management
                </h1>
                <p className="mt-1 text-sm text-gray-600 font-medium">
                  Manage daily gold prices per karat
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
              <button
                onClick={handleNewGoldPrice}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-xl transition-all duration-300 flex items-center gap-2"
              >
              Add New Price
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && !showForm && (
          <div className="bg-red-50/90 border border-red-200 text-red-800 px-6 py-4 rounded-2xl text-sm mb-8 backdrop-blur-sm shadow-sm">
            {error}
          </div>
        )}

        {goldPrices.length === 0 && !loading ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mb-6">
              <span className="text-3xl text-gray-400">💰</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No gold prices found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add gold prices for different karats and dates to get started
            </p>
            <button
              onClick={handleNewGoldPrice}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-2xl hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 mx-auto"
            >
              Add First Price
            </button>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Karat</th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Price/Gram</th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {goldPrices.map((goldPrice) => (
                    <tr key={goldPrice.id} className="hover:bg-gray-50/80 transition-all duration-200">
                      <td className="px-6 py-6 text-center">
                        <span className="inline-flex px-5 py-1 bg-gradient-to-r from-amber-100 to-yellow-200 text-amber-800 text-sm font-bold rounded-xl shadow-sm">
                          {goldPrice.karat.displayName}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="inline-flex px-4 py-1 text-emerald-700 text-sm font-bold">
                          ${goldPrice.pricePerGram.toFixed(3)}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <p className="font-semibold text-gray-900">
                          {new Date(goldPrice.effectiveDate).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                          goldPrice.isActive 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {goldPrice.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <GoldPriceActions 
                          goldPrice={goldPrice}
                          onEdit={handleEdit}
                          fetchGoldPrices={fetchGoldPrices}
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
            onChange={(p) => fetchGoldPrices(p)}
          />
        )}
      </div>

      <GoldPriceFormModal
        showForm={showForm}
        editingGoldPrice={editingGoldPrice}
        onClose={handleFormClose}
        onSubmitSuccess={handleFormSuccess}
        page={page}
      />
    </div>
  );
};

export default GoldPricesManagement;
