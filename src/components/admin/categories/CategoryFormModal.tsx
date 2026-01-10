import React, { useState, useEffect } from 'react';
import type { AdminCategory } from '../../../services/adminApi';
import { adminCreateCategory, adminUpdateCategory } from '../../../services/adminApi';
import { useToast } from '../../../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

interface CategoryFormData {
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
}

interface CategoryFormModalProps {
  showForm: boolean;
  editingCategory: AdminCategory | null;
  onClose: () => void;
  onSubmitSuccess: (page: number) => Promise<void>;
  page: number;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  showForm,
  editingCategory,
  onClose,
  onSubmitSuccess,
  page
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    arabicName: '',
    description: '',
    arabicDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        arabicName: editingCategory.arabicName || '',
        description: editingCategory.description,
        arabicDescription: editingCategory.arabicDescription || '',
      });
    } else {
      setFormData({ name: '', description: '', arabicName: '', arabicDescription: '' });
    }
    setError('');
  }, [editingCategory, showForm]);

  const getErrorMessage = (err: any, fallback = 'Something went wrong') => {
    return (
      err.response?.data?.status?.description ||
      err?.response?.data?.message ||
      err?.message ||
      fallback
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      setError(t('admin.categories.form.requiredError'));
      return;
    }
    try {
      setLoading(true);
      setError('');
      const payload = {
        name: formData.name.trim(),
        arabicName: formData.arabicName.trim() || undefined,
        description: formData.description.trim(),
        arabicDescription: formData.arabicDescription.trim() || undefined
      };
      if (editingCategory) {
        await adminUpdateCategory(editingCategory.id, payload);
        addToast(t('admin.categories.form.updateSuccess', { name: payload.name }), 'success');
      } else {
        await adminCreateCategory(payload);
        addToast(t('admin.categories.form.createSuccess', { name: payload.name }), 'success');
      }
      onClose();
      await onSubmitSuccess(page);
    } catch (err: any) {
      setError(getErrorMessage(err))
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
                {editingCategory ? t('admin.categories.editTitle') : t('admin.categories.newTitle')}
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
                  {t('admin.categories.fields.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('admin.categories.fields.arabicName')} <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.arabicName}
                  onChange={(e) =>
                    setFormData({ ...formData, arabicName: e.target.value })
                  }
                  disabled={loading}
                  dir="rtl"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  placeholder="اسم الفئة"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('admin.categories.fields.description')} <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('admin.categories.fields.arabicDescription')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.arabicDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, arabicDescription: e.target.value })
                  }
                  disabled={loading}
                  dir="rtl"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm resize-vertical"
                  placeholder="الوصف بالعربية"
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
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {t('admin.categories.form.saving')}
                    </>
                  ) : editingCategory ? (
                   t('admin.categories.form.update')
                  ) : (
                    t('admin.categories.form.create')
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-2 px-4 rounded-xl text-lg font-bold border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('admin.categories.actions.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryFormModal;
