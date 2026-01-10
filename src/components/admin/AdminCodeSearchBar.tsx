import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import type { Item } from '../../services/api';
import { searchItemsByCode } from '../../services/api';
import { useTranslation } from 'react-i18next';

interface AdminCodeSearchBarProps {
  onSearch: (results: Item[]) => void;
  onClear: () => void;
}

export default function AdminCodeSearchBar({ onSearch, onClear }: AdminCodeSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const debouncedSearch = useCallback(async () => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const results = await searchItemsByCode({
        query: searchQuery,
        size: 8
      });
      setSearchResults(results.content);
      setShowSearchDropdown(true);
      onSearch(results.content);
    } catch (error) {
      setSearchResults([]);
      setShowSearchDropdown(false);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(debouncedSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchDropdown(false);
    setLoading(false);
    onClear();
  };

  return (
    <div className="relative flex-1 max-w-md" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
          placeholder={t('admin.items.searchByCodePlaceholder')}
          className="w-full ps-10 pe-20 py-2 border border-gray-200 rounded-xl focus:border-amber-300 focus:ring-2 focus:ring-amber-200/50 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm text-sm font-medium"
        />
        {loading ? (
          <div className="absolute end-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleClear}
              className="absolute end-12 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-xl transition-colors"
              disabled={!searchQuery}
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
            <button
              type="button"
              className="absolute end-4 top-1/2 -translate-y-1/2 p-2 hover:bg-amber-50 rounded-xl transition-all group"
            >
              <Search className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}
      </div>

      {showSearchDropdown && searchResults.length === 0 && !loading && searchQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl z-50">
          <div className="p-6 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-medium">{t('admin.items.noItems')} "{searchQuery}"</p>
          </div>
        </div>
      )}
    </div>
  );
}
