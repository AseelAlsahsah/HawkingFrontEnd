import React, { useEffect, useState } from 'react';
import { searchItemsByCode } from '../../../services/api';

interface Item {
  id: number;
  code: string;
  name: string;
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
  discountId,
  existingItems,
  onClose,
  onConfirm,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const toggleSelect = (code: string) => {
    setSelected(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) return;
    setSubmitting(true);
    try {
      await onConfirm(selected);
      setSelected([]);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const existingCodes = new Set(existingItems.map(i => i.code));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
          <h3 className="text-lg font-semibold">
            {mode === 'add' ? 'Add Items to Discount' : 'Remove Items from Discount'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Search */}
        {mode === 'add' && (
          <div className="px-6 pt-4">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by item code…"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
        )}

        {/* Items */}
        <div className="px-6 py-4 max-h-[420px] overflow-y-auto space-y-2">
          {loading && <p className="text-sm text-gray-500">Searching…</p>}

          {!loading && results.length === 0 && (
            <p className="text-sm text-gray-500">No items found.</p>
          )}

          {results.map(item => {
            const disabled =
              mode === 'add' && existingCodes.has(item.code);

            return (
              <label
                key={item.code}
                className={`flex items-center gap-4 p-3 rounded-lg border ${
                  disabled
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  disabled={disabled}
                  checked={selected.includes(item.code)}
                  onChange={() => toggleSelect(item.code)}
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-gray-500 font-mono">{item.code}</p>
                </div>
                {disabled && (
                  <span className="text-xs text-amber-600 font-semibold">
                    Already added
                  </span>
                )}
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            disabled={selected.length === 0 || submitting}
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 disabled:opacity-50"
          >
            {mode === 'add'
              ? `Add ${selected.length} item(s)`
              : `Remove ${selected.length} item(s)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountItemSelectorModal;
