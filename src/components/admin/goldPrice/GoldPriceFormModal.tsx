import React, { useState, useEffect } from 'react';
import { adminFetchKarats } from '../../../services/api';
import { adminCreateGoldPrice, adminUpdateGoldPrice, type AdminGoldPrice, type AdminKarat } from '../../../services/adminApi';

interface GoldPriceFormModalProps {
  showForm: boolean;
  editingGoldPrice: AdminGoldPrice | null;
  onClose: () => void;
  onSubmitSuccess: (pageNum: number) => Promise<void>;
  page: number;
}

const GoldPriceFormModal: React.FC<GoldPriceFormModalProps> = ({
  showForm,
  editingGoldPrice,
  onClose,
  onSubmitSuccess,
  page
}) => {
  const [karats, setKarats] = useState<AdminKarat[]>([]);
  const [formData, setFormData] = useState({
    karatName: '',
    pricePerGram: '',
    effectiveDate: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [karatsLoading, setKaratsLoading] = useState(true);

  useEffect(() => {
    const loadKarats = async () => {
      try {
        setKaratsLoading(true);
        const response = await adminFetchKarats({ page: 0, size: 100 });
        setKarats(response.content);
      } catch (err) {
        setError('Failed to load karats');
      } finally {
        setKaratsLoading(false);
      }
    };
    loadKarats();
  }, []);

  useEffect(() => {
    if (editingGoldPrice) {
      setFormData({
        karatName: editingGoldPrice.karat.name,
        pricePerGram: editingGoldPrice.pricePerGram.toString(),
        effectiveDate: new Date(editingGoldPrice.effectiveDate).toLocaleDateString('sv').replace(/[-\s]/g, '-'),
        isActive: editingGoldPrice.isActive
      });
      setError('');
    } else {
      setFormData({
        karatName: '',
        pricePerGram: '',
        effectiveDate: new Date().toLocaleDateString('sv').replace(/[-\s]/g, '-'),
        isActive: true
      });
      setError('');
    }
  }, [editingGoldPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.karatName || !formData.pricePerGram || !formData.effectiveDate) {
      setError('Please fill all fields');
      return;
    }

    const pricePerGram = parseFloat(formData.pricePerGram);
    if (isNaN(pricePerGram) || pricePerGram <= 0) {
      setError('Please enter a valid price');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        karatName: formData.karatName,
        pricePerGram,
        effectiveDate: `${formData.effectiveDate}T00:00:00`,
        isActive: formData.isActive
      };

      if (editingGoldPrice) {
        await adminUpdateGoldPrice(editingGoldPrice.id, payload);
      } else {
        await adminCreateGoldPrice(payload);
      }

      onClose();
      await onSubmitSuccess(page); // ✅ INSIDE TRY BLOCK
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200" />
      <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
        <div className="bg-white/95 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-200 animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingGoldPrice ? 'Edit Gold Price' : 'New Gold Price'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Karat <span className="text-red-500">*</span>
                </label>
                {karatsLoading ? (
                  <div className="flex items-center justify-center p-8 bg-gray-50 rounded-xl">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                  </div>
                ) : (
                  <select
                    value={formData.karatName}
                    onChange={(e) => setFormData({ ...formData, karatName: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">Select Karat</option>
                    {karats.map((karat) => (
                      <option key={karat.id} value={karat.name}>
                        {karat.displayName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price per Gram ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={formData.pricePerGram}
                  onChange={(e) => setFormData({ ...formData, pricePerGram: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Effective Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    disabled={loading}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm font-semibold text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-2 px-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : editingGoldPrice ? (
                    'Update Price'
                  ) : (
                    'Create Price'
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-2 px-4 rounded-xl text-lg font-bold border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoldPriceFormModal;
