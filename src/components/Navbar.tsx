import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from '../contexts/CartContext';
import type { Item } from "../services/api";
import { searchItems } from "../services/api";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { pickLang } from "../utils/i18nHelpers";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
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
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const res = await searchItems({ query: searchQuery, size: 5 });
        setSearchResults(res.content);
      } catch {
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const id = setTimeout(search, 300);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
    setSearchResults([]);
    setShowMobileSearch(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
      <nav className="max-w-6xl mx-auto flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-semibold tracking-wide text-gray-900"
        >
          {t('navbar.logo')}
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`hover:text-gold-600 ${location.pathname === link.path ? "text-gold-600" : ""
                  }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Search */}
          <div className="hidden md:block relative w-64" ref={searchRef}>
            <form onSubmit={handleSubmit}>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("navbar.searchPlaceholder")}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:ring-1 focus:ring-gold-300 bg-white"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>

            {searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                {searchResults.map((item) => (
                  <Link
                    key={item.code}
                    to={`/item/${item.code}`}
                    className="flex gap-3 p-3 hover:bg-gray-50 border-b last:border-0"
                    onClick={() => setSearchResults([])}
                  >
                    <img
                      src={item.imageUrl}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {pickLang(item.name, item.arabicName)}
                      </p>
                      <p className="text-xs text-gray-600">{item.code}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Search Icon */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
            onClick={() => setShowMobileSearch(true)}
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>

          {/* Language (Desktop) */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Cart */}
          <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100 relative">
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] bg-gold-500 text-white rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* ================= MOBILE SEARCH OVERLAY ================= */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-50 bg-gray-50">
          <div className="flex items-center gap-3 p-4 bg-white border-b">
            <button onClick={() => setShowMobileSearch(false)}>
              <X className="w-5 h-5" />
            </button>
            <form onSubmit={handleSubmit} className="flex-1">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("navbar.searchPlaceholder")}
                className="w-full px-4 py-2 border border-gray-200 rounded-full text-sm bg-white"
              />
            </form>
          </div>

          <div className="overflow-auto">
            {loading && (
              <p className="p-4 text-sm text-gray-500">
                {t("navbar.loading")}
              </p>
            )}

            {!loading &&
              searchResults.map((item) => (
                <Link
                  key={item.code}
                  to={`/item/${item.code}`}
                  className="flex gap-3 p-4 bg-white border-b border-gray-200 hover:bg-gray-100 transition"
                  onClick={() => setShowMobileSearch(false)}
                >
                  <img
                    src={item.imageUrl}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {pickLang(item.name, item.arabicName)}
                    </p>
                    <p className="text-xs text-gray-600">{item.code}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <ul className="px-4 py-3 space-y-3 text-sm text-gray-700">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="block py-2"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Language Switcher (Mobile) */}
            <li className="pt-3 border-t">
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
