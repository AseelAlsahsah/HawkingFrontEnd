import React, { useState, useEffect } from 'react';
import type { AdminCategory, AdminKarat } from '../../../services/api';
import type { AdminItem } from '../../../services/adminApi';
import { adminFetchKarats } from '../../../services/api';
import { adminCreateItem, adminUpdateItem } from '../../../services/adminApi';
import { useToast } from '../../../contexts/ToastContext';
import { useTranslation } from 'react-i18next';
import { pickLang } from '../../../utils/i18nHelpers';

interface ItemFormData {
  code: string;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
  weight: number | '';
  categoryName: string;
  karatName: string;
  factoryPrice: number | '';
  imageUrl: string;
  inStockCount: number | '';
  reservedCount: number | '';
  isActive: boolean;
}

interface ItemFormModalProps {
  showForm: boolean;
  editingItem: AdminItem | null;
  categories: AdminCategory[];
  onClose: () => void;
  onSubmitSuccess: (page: number, categoryFilter: string) => Promise<void>;
  page: number;
  categoryFilter: string;
  modalError: string;
  setModalError: (error: string) => void;
}

const ItemFormModal: React.FC<ItemFormModalProps> = ({
  showForm,
  editingItem,
  categories,
  onClose,
  onSubmitSuccess,
  page,
  categoryFilter,
  modalError,
  setModalError
}) => {
  const [formData, setFormData] = useState<ItemFormData>({
    code: '',
    name: '',
    arabicName: '',
    description: '',
    arabicDescription: '',
    weight: '',
    categoryName: '',
    karatName: '',
    factoryPrice: '',
    imageUrl: '',
    inStockCount: '',
    reservedCount: '',
    isActive: true,
  });
  const [karats, setKarats] = useState<AdminKarat[]>([]);
  const [karatsLoading, setKaratsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { addToast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchKarats = async () => {
      try {
        setKaratsLoading(true);
        const data = await adminFetchKarats({ page: 0, size: 20 });
        setKarats(data.content || []);
      } catch (err: any) {
        console.error('Failed to fetch karats:', err);
        setKarats([]);
      } finally {
        setKaratsLoading(false);
      }
    };
    fetchKarats();
  }, []);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        code: editingItem.code,
        name: editingItem.name,
        arabicName: editingItem.arabicName || '',
        description: editingItem.description || '',
        arabicDescription: editingItem.arabicDescription || '',
        weight: editingItem.weight,
        categoryName: editingItem.category.name,
        karatName: editingItem.karat.name,
        factoryPrice: editingItem.factoryPrice,
        imageUrl: editingItem.imageUrl,
        inStockCount: editingItem.inStockCount,
        reservedCount: editingItem.reservedCount,
        isActive: editingItem.isActive,
      });
    } else {
      setFormData({
        code: '', name: '', description: '', arabicName: '', arabicDescription: '', weight: '', categoryName: '',
        karatName: '', factoryPrice: '', imageUrl: '', inStockCount: '',
        reservedCount: '', isActive: true
      });
    }
  }, [editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setModalError('');

    try {
      // VALIDATION CHECKS
      if (!formData.code.trim()) throw new Error(t('admin.items.modal.validation.codeRequired'));
      if (!formData.name.trim()) throw new Error(t('admin.items.modal.validation.nameRequired'));
      if (!formData.arabicName.trim()) throw new Error(t('admin.items.modal.validation.arabicNameRequired'));
      if (!formData.categoryName) throw new Error(t('admin.items.modal.validation.categoryRequired'));
      if (!formData.karatName) throw new Error(t('admin.items.modal.validation.karatRequired'));
      if (!formData.imageUrl.trim()) throw new Error(t('admin.items.modal.validation.imageRequired'));
      if (formData.weight === '') throw new Error(t('admin.items.modal.validation.weightRequired'));
      if (formData.factoryPrice === '') throw new Error(t('admin.items.modal.validation.factoryPriceRequired'));
      if (formData.inStockCount === '') throw new Error(t('admin.items.modal.validation.stockRequired'));

      if (editingItem && (!editingItem.id || editingItem.id <= 0)) {
        throw new Error(t('admin.items.modal.validation.invalidId'))
      }

      const submitData = {
        ...formData,
        weight: Number(formData.weight),
        factoryPrice: Number(formData.factoryPrice),
        inStockCount: Number(formData.inStockCount),
        reservedCount: Number(formData.reservedCount || 0),
      };

      if (editingItem) {
        await adminUpdateItem(editingItem.id!, submitData);
        addToast(`"${formData.name}" updated successfully.`, 'success');
      } else {
        await adminCreateItem(submitData);
        addToast(`"${formData.name}" created successfully.`, 'success');
      }
      onClose();
      await onSubmitSuccess(page, categoryFilter);
    } catch (err: any) {
      console.error('ERROR:', err);
      const errorMsg =
        err.response?.data?.status?.description ||
        err.response?.data?.message ||
        err.message ||
        'Failed to save item';
      setModalError(errorMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!showForm) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
        <div className="bg-white/95 rounded-xl shadow-2xl max-w-4xl w-full border border-gray-200 animate-in slide-in-from-bottom-4 duration-300 max-h-[95vh] overflow-y-auto">
          <div className="p-6 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem
                  ? t('admin.items.modal.editTitle', { name: editingItem.name })
                  : t('admin.items.modal.newTitle')}
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
            {/* Form – */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2"> {t('admin.items.modal.fields.code')} *</label>
                <input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder={t('admin.items.modal.placeholders.code')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('admin.items.modal.fields.category')} *</label>
                <select
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  required
                >
                  <option value="">{t('admin.items.modal.placeholders.category')}</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{pickLang(c.name, c.arabicName)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('admin.items.modal.fields.name')} *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder={t('admin.items.modal.placeholders.name')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('admin.items.modal.fields.arabicName')}  *
                </label>
                <input
                  value={formData.arabicName}
                  onChange={(e) =>
                    setFormData({ ...formData, arabicName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
                  placeholder={t('admin.items.modal.placeholders.arabicName')}
                  required
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('admin.items.modal.fields.karat')} *</label>
                <select
                  value={formData.karatName}
                  onChange={(e) => setFormData({ ...formData, karatName: e.target.value })}
                  disabled={karatsLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md disabled:opacity-50"
                  required
                >
                  <option value="">{t('admin.items.modal.placeholders.karat')}</option>
                  {karats.map(k => (
                    <option key={k.id} value={k.name}>{k.displayName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">{t('admin.items.modal.fields.weight')} *</label>
                <input
                  required
                  type="number" step="0.01"
                  value={formData.weight}
                  placeholder={t('admin.items.modal.placeholders.weight')}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value === '' ? '' : Number(e.target.value), })}
                  className="w-full px-5 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400 text-s shadow-sm transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">{t('admin.items.modal.fields.factoryPrice')} *</label>
                <input
                  required
                  type="number" step="0.01"
                  value={formData.factoryPrice}
                  placeholder={t('admin.items.modal.placeholders.factoryPrice')}
                  onChange={(e) => setFormData({ ...formData, factoryPrice: e.target.value === '' ? '' : Number(e.target.value), })}
                  className="w-full px-5 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400 text-s shadow-sm transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">{t('admin.items.modal.fields.stock')}  *</label>
                <input
                  required
                  type="number"
                  value={formData.inStockCount}
                  placeholder={t('admin.items.modal.placeholders.stock')}
                  onChange={(e) => setFormData({ ...formData, inStockCount: e.target.value === '' ? '' : Number(e.target.value), })}
                  className="w-full px-5 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-400/50 focus:border-emerald-400 text-s shadow-sm transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">{t('admin.items.modal.fields.reserved')}</label>
                <input
                  type="number"
                  value={formData.reservedCount}
                  placeholder={t('admin.items.modal.placeholders.reserved')}
                  onChange={(e) => setFormData({ ...formData, reservedCount: e.target.value === '' ? '' : Number(e.target.value), })}
                  className="w-full px-5 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-400/50 focus:border-orange-400 text-s shadow-sm transition-all duration-300"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-3">{t('admin.items.modal.fields.imageUrl')} *</label>
                <input
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-5 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 text-s shadow-sm transition-all duration-300"
                  dir='ltr'
                  placeholder={t('admin.items.modal.placeholders.imageUrl')}
                />
                <p className="text-xs text-gray-500 mt-2">{t('admin.items.modal.hint.drive')}</p>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-3">{t('admin.items.modal.fields.description')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-5 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 text-s shadow-sm transition-all duration-300 resize-vertical"
                  placeholder={t('admin.items.modal.placeholders.description')}
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  {t('admin.items.modal.fields.arabicDescription')}
                </label>
                <textarea
                  value={formData.arabicDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, arabicDescription: e.target.value })
                  }
                  rows={3}
                  dir="rtl"
                  className="w-full px-5 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 shadow-sm resize-vertical"
                  placeholder={t('admin.items.modal.placeholders.arabicDescription')}
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-3">{t('admin.items.modal.fields.status')}</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="sr-only peer"
                  />

                  <div
                    className="w-14 h-7 bg-gray-200 rounded-full relative
                      peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
                      peer-checked:bg-blue-600
                      after:content-['']
                      after:absolute after:top-[2px] after:start-[2px]
                      after:bg-white after:border after:border-gray-300
                      after:rounded-full after:h-6 after:w-6
                      after:transition-all
                      peer-checked:after:translate-x-full
                      rtl:peer-checked:after:-translate-x-full"
                  />

                  <span className="ms-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {formData.isActive ? t('common.active') : t('common.inactive')}
                  </span>
                </label>
              </div>
              {/* Error */}
              {modalError && (
                <div className="lg:col-span-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm font-semibold text-red-800">
                    {modalError}
                  </p>
                </div>
              )}
              {/* Actions */}
              <div className="lg:col-span-2 flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-2 px-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading
                    ? t('admin.items.modal.actions.saving')
                    : editingItem
                      ? t('admin.items.modal.actions.update')
                      : t('admin.items.modal.actions.create')}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-4 rounded-xl text-lg font-semibold border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {t('admin.items.modal.actions.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemFormModal;
