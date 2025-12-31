import React, { useState, useEffect } from 'react';
import type { AdminCategory } from '../../../services/api';
import { adminCreateCategory, adminUpdateCategory } from '../../../services/api';
import { useToast } from '../../../contexts/ToastContext';

interface CategoryFormData {
  name: string;
  description: string;
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
    description: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const { addToast } = useToast();

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        description: editingCategory.description
      });
    } else {
      setFormData({ name: '', description: '' });
    }
    setModalError('');
  }, [editingCategory, showForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setModalError('');

    try {
      if (!formData.name.trim()) throw new Error('Category name is required');
      if (!formData.description.trim()) throw new Error('Description is required');

      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim()
      };

      if (editingCategory) {
        await adminUpdateCategory(editingCategory.id, submitData);
        addToast(`"${formData.name}" updated successfully.`, 'success');
      } else {
        await adminCreateCategory(submitData);
        addToast(`"${formData.name}" created successfully.`, 'success');
      }

      onClose();
      await onSubmitSuccess(page);
    } catch (err: any) {
      console.error('Category save error:', err);
      const errorMsg = err.response?.data?.status?.description || 
                      err.response?.data?.message || 
                      err.response?.data?.error || 
                      err.message || 
                      'Failed to save category';
      setModalError(errorMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black bg-blue-700 bg-clip-text text-transparent">
              {editingCategory ? `Edit ${editingCategory.name}` : 'New Category'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {modalError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-2xl text-red-900 text-sm shadow-lg">
              <div className="flex items-start gap-3">
                <span className="text-lg font-bold mt-0.5">⚠️</span>
                <p className="font-semibold">{modalError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Category Name * (e.g. "Rings")</label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400 shadow-sm transition-all duration-300"
                placeholder="Rings"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Description * (e.g. "Rings Collection")</label>
              <input
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-400/50 focus:border-emerald-400 shadow-sm transition-all duration-300"
                placeholder="Rings Collection"
              />
            </div>

            <div className="flex gap-10">
              <button
                type="submit"
                disabled={submitLoading || !formData.name || !formData.description}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white py-3 px-7 text-lg font-bold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitLoading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 py-3 px-7 text-lg font-bold rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryFormModal;
