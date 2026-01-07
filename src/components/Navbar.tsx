import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from '../contexts/CartContext';
import type { Item } from "../services/api";
import { searchItems } from "../services/api";  
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const searchRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const navLinks = [
    { label: t('navbar.home'), path: '/' },
    { label: t('navbar.collections'), path: '/collections' },
    { label: t('navbar.about'), path: '/about' },
    { label: t('navbar.contact'), path: '/contact' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const results = await searchItems({ 
          query: searchQuery, 
          size: 5 
        });
        setSearchResults(results.content);
        setShowSearchDropdown(true);
      } catch (error) {
        setSearchResults([]);
        setShowSearchDropdown(false);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchDropdown(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
      <nav className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/" 
          className="text-xl sm:text-2xl font-semibold tracking-wide text-gray-900"
        >
          {t('navbar.logo')}
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.label}>
                <Link
                  to={link.path}
                  className={
                    "hover:text-gold-600 cursor-pointer " +
                    (isActive ? "text-gold-600" : "")
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Search + Icons */}
        <div className="flex items-center gap-2 sm:gap-4" ref={searchRef}>          
          {/* Search */}
          <div className="relative flex-1 md:w-64 max-w-md">
            <form onSubmit={handleSearchSubmit} className="flex">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                  placeholder={t('navbar.searchPlaceholder')}
                  className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-full focus:border-gold-300 focus:ring-1 focus:ring-gold-300 focus:outline-none transition-all duration-300 bg-white/50 text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"
                  disabled={loading}
                >
                  <Search className={`w-4 h-4 ${loading ? 'text-gray-300' : 'text-gray-500'}`} />
                </button>
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-auto z-50">
                <div className="py-2 max-h-96">
                  {searchResults.map((item) => (
                    <Link
                      key={item.code}
                      to={`/item/${item.code}`}
                      className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-gold.jpg';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 truncate">{item.code}</p>
                        <p className="text-sm font-semibold text-gold-600">
                          JD{item.priceBeforeDiscount.toFixed(3)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {showSearchDropdown && searchResults.length === 0 && !loading && searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                <div className="p-4 text-center text-gray-500 text-sm">
                  {t('navbar.noItems')}
                </div>
              </div>
            )}
          </div>

          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Cart */}
          <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100 relative">
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-white bg-gold-500 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur">
          <ul className="px-4 py-3 space-y-2 text-sm font-medium text-gray-700">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.path}
                  className="block py-1 hover:text-gold-600"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
