import React from 'react';
import type { AdminDiscount } from '../../../services/adminApi';
import { useTranslation } from 'react-i18next';

interface DiscountFormState {
    percentage: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

interface DiscountFormModalProps {
    open: boolean;
    editingDiscount: AdminDiscount | null;
    formState: DiscountFormState;
    formError: string;
    onChange: (state: DiscountFormState) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

const DiscountFormModal: React.FC<DiscountFormModalProps> = ({
    open,
    editingDiscount,
    formState,
    formError,
    onChange,
    onSubmit,
    onClose,
}) => {
    if (!open) return null;
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
                    <h3 className="text-2xl font-bold">
                        {editingDiscount ? t('admin.discounts.form.editTitle') : t('admin.discounts.form.newTitle')}
                    </h3>
                    <button onClick={onClose}>✕</button>
                </div>

                <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
                    {formError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {formError}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('admin.discounts.form.percentage')} *</label>
                        <input
                            value={formState.percentage}
                            type="number"
                            onChange={e => onChange({ ...formState, percentage: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                            placeholder={t('admin.discounts.form.percentagePlaceholder')}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('admin.discounts.form.startDate')} *</label>
                        <input
                            type="datetime-local"
                            value={formState.startDate}
                            onChange={e => onChange({ ...formState, startDate: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('admin.discounts.form.startDate')} *</label>
                        <input
                            type="datetime-local"
                            value={formState.endDate}
                            onChange={e => onChange({ ...formState, endDate: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                            required
                        />
                    </div>
                    {/* ===================== ACTIVE TOGGLE ===================== */}
                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                {t('admin.discounts.form.status')}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formState.isActive
                                    ? t('admin.discounts.form.activeHelp')
                                    : t('admin.discounts.form.inactiveHelp')}
                            </p>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formState.isActive}
                                onChange={(e) =>
                                    onChange({ ...formState, isActive: e.target.checked })
                                }
                                className="sr-only peer"
                            />
                            <div
                                className="w-11 h-6 bg-gray-300 rounded-full relative
                                    peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300
                                    peer-checked:bg-emerald-500
                                    after:content-['']
                                    after:absolute after:top-[2px] after:start-[2px]
                                    after:bg-white after:rounded-full after:h-5 after:w-5
                                    after:transition-all
                                    peer-checked:after:translate-x-full
                                    rtl:peer-checked:after:-translate-x-full"
                            />
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">
                            {t('common.cancel')}
                        </button>
                        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
                            {t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DiscountFormModal;
