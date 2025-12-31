import React, { useState, useEffect } from 'react';
import type { AdminKarat } from '../../../services/api';
import { adminCreateKarat, adminUpdateKarat } from '../../../services/api';
import { useToast } from '../../../contexts/ToastContext';

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
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalError, setModalError] = useState('');

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
    setModalError('');
  }, [editingKarat, showForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setModalError('');

    try {
      if (!formData.name.trim()) throw new Error('Karat name is required');
      if (!formData.displayName.trim()) throw new Error('Display name is required');

      const submitData = {
        name: formData.name.trim(),
        displayName: formData.displayName.trim()
      };

      if (editingKarat) {
        await adminUpdateKarat(editingKarat.id, submitData);
        addToast(`"${formData.displayName}" updated successfully.`, 'success');
      } else {
        await adminCreateKarat(submitData);
        addToast(`"${formData.displayName}" created successfully.`, 'success');
      }

      onClose();
      await onSubmitSuccess(page);
    } catch (err: any) {
      console.error('Karat save error:', err);
      const errorMsg = err.response?.data?.status?.description || 
                    err.response?.data?.message || 
                    err.response?.data?.error || 
                    err.message || 
                    'Failed to save karat';
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
            <h2 className="text-3xl font-black bg-gray-900 bg-clip-text text-transparent">
              {editingKarat ? `Edit ${editingKarat.displayName}` : 'Create New Karat'}
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
                <span className="text-lg font-bold mt-0.9">⚠️</span>
                <p className="font-semibold mt-0.5">{modalError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Karat Name * (e.g. "18")</label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-400/50 focus:border-amber-400 text-s shadow-sm transition-all duration-300"
                placeholder="18"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Display Name * (e.g. "18K Gold")</label>
              <input
                required
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-400/50 focus:border-emerald-400 text-s shadow-sm transition-all duration-300"
                placeholder="18K Gold"
              />
            </div>

            <div className="flex gap-10 ">
              <button
                type="submit"
                disabled={submitLoading || !formData.name || !formData.displayName}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white py-3 px-7 text-lg font-bold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitLoading ? 'Saving...' : editingKarat ? 'Update Karat' : 'Create Karat'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 py-3 px-7 text-lg font-bold rounded-xl "              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KaratFormModal;
