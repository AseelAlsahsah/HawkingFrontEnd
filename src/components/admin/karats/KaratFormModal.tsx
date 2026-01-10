import React, { useState, useEffect } from 'react';
import type { AdminKarat } from '../../../services/api';
import { adminCreateKarat, adminUpdateKarat } from '../../../services/adminApi';
import { useToast } from '../../../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

interface KaratFormData {
  name: string;
  displayName: string;
}

interface KaratFormModalProps {
  showForm: boolean;
  editingKarat: AdminKarat | null;
  onClose: () => void;
  onSubmitSuccess: (page: number) => Promise<void>;
  page: number;
}

const KaratFormModal: React.FC<KaratFormModalProps> = ({
  showForm,
  editingKarat,
  onClose,
  onSubmitSuccess,
  page
}) => {
  const [formData, setFormData] = useState<KaratFormData>({
    name: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const { addToast } = useToast();

  useEffect(() => {
    if (editingKarat) {
      setFormData({
        name: editingKarat.name,
        displayName: editingKarat.displayName
      });
    } else {
      setFormData({ name: '', displayName: '' });
    }
    setError('');
  }, [editingKarat, showForm]);

  const getErrorMessage = (err: any, fallback = 'Something went wrong') => {
    return (
      err?.response?.data?.message ||
      err.response?.data?.status?.description ||
      err?.message ||
      fallback
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.displayName.trim()) {
      setError(t('admin.karats.form.requiredError'));
      return;
    }
    try {
      setLoading(true);
      setError('');
      const payload = {
        name: formData.name.trim(),
        displayName: formData.displayName.trim()
      };
      if (editingKarat) {
        await adminUpdateKarat(editingKarat.id, payload);
        addToast(
          t('admin.karats.updatedSuccess', { name: payload.displayName }),
          'success'
        );
      } else {
        await adminCreateKarat(payload);
        addToast(
          t('admin.karats.createdSuccess', { name: payload.displayName }),
          'success'
        );
      }
      onClose();
      await onSubmitSuccess(page);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
        <div className="bg-white/95 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingKarat ? t('admin.karats.editTitle') : t('admin.karats.newTitle')}
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
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('admin.karats.form.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={t('admin.karats.form.namePlaceholder')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('admin.karats.form.displayName')} <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={t('admin.karats.form.displayNamePlaceholder')}
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm font-semibold text-red-800">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-2 px-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      {t('common.save')}…
                    </>
                  ) : editingKarat ?
                    (t('admin.karats.update')) : (t('admin.karats.create'))
                  }
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-2 px-4 rounded-xl text-lg font-bold border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default KaratFormModal;
