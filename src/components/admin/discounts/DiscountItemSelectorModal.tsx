import React, { useEffect, useMemo, useState } from 'react';
import { searchItemsByCode } from '../../../services/api';
import { useTranslation } from 'react-i18next';
import { pickLang } from '../../../utils/i18nHelpers';

interface Item {
  id: number;
  code: string;
  name: string;
  arabicName: string;
  imageUrl?: string;
  category?: { name: string };
  karat?: { displayName: string };
}

interface Props {
  open: boolean;
  mode: 'add' | 'remove';
  discountId: number;
  existingItems: Item[];
  onClose: () => void;
  onConfirm: (codes: string[]) => Promise<void>;
}

const DiscountItemSelectorModal: React.FC<Props> = ({
  open,
  mode,
  existingItems,
  onClose,
  onConfirm,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<Record<string, Item>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;

    if (mode === 'remove') {
      setResults(existingItems);
      return;
    }
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchItemsByCode({ query, size: 20 });
        setResults(res.content);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, mode, existingItems, open]);

  const toggleSelect = (item: Item) => {
    setSelectedCodes(prev =>
      prev.includes(item.code)
        ? prev.filter(c => c !== item.code)
        : [...prev, item.code]
    );

    setSelectedItems(prev => {
      if (prev[item.code]) {
        const copy = { ...prev };
        delete copy[item.code];
        return copy;
      }
      return { ...prev, [item.code]: item };
    });
  };

  const handleSubmit = async () => {
    if (selectedCodes.length === 0) return;
    setSubmitting(true);
    try {
      await onConfirm(selectedCodes);
      setSelectedCodes([]);
      setSelectedItems({});
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const displayItems = useMemo(() => {
    const selectedList = Object.values(selectedItems);
    const selectedSet = new Set(selectedCodes);

    const unselectedResults = results.filter(
      item => !selectedSet.has(item.code)
    );

    return [...selectedList, ...unselectedResults];
  }, [results, selectedItems, selectedCodes]);

  const resetSelection = () => {
    setSelectedCodes([]);
    setSelectedItems({});
  };

  if (!open) return null;

  const existingCodes = new Set(existingItems.map(i => i.code));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
          <h3 className="text-lg font-semibold">
            {mode === 'add'
              ? t('admin.discounts.selector.addTitle')
              : t('admin.discounts.selector.removeTitle')}
          </h3>
          <button
            onClick={() => {
              resetSelection();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Search */}
        {mode === 'add' && (
          <div className="px-6 pt-4">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('admin.discounts.selector.search')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
        )}

        {/* Items */}
        <div className="px-6 py-4 max-h-[420px] overflow-y-auto space-y-2">
          {loading && <p className="text-sm text-gray-500">{t('common.searching')}</p>}

          {!loading && displayItems.length === 0 && (
            <p className="text-sm text-gray-500">{t('admin.discounts.selector.noResults')}</p>
          )}

          {selectedCodes.length > 0 && (
            <div className="text-xs text-gray-500 font-semibold mt-2 mb-1">
              {t('admin.discounts.selector.selected')}
            </div>
          )}

          {displayItems.map(item => {
            const disabled =
              mode === 'add' && existingCodes.has(item.code);

            return (
              <label
                key={item.code}
                className={`flex items-center gap-4 p-3 rounded-lg border transition ${disabled
                  ? 'bg-gray-50 border-gray-200 opacity-60'
                  : selectedCodes.includes(item.code)
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <input
                  type="checkbox"
                  disabled={disabled}
                  checked={selectedCodes.includes(item.code)}
                  onChange={() => toggleSelect(item)}
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{pickLang(item.name, item.arabicName)}</p>
                  <p className="text-xs text-gray-500 font-mono">
                    {item.code}
                  </p>
                </div>
                {disabled && (
                  <span className="text-xs text-amber-600 font-semibold">
                    {t('admin.discounts.selector.alreadyAdded')}
                  </span>
                )}
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={() => {
              resetSelection();
              onClose();
            }}
            className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
          >
            {t('common.cancel')}
          </button>
          <button
            disabled={selectedCodes.length === 0 || submitting}
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 disabled:opacity-50"
          >
            {mode === 'add'
              ? t('admin.discounts.selector.addCount', { count: selectedCodes.length })
              : t('admin.discounts.selector.removeCount', { count: selectedCodes.length })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountItemSelectorModal;
