import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const switchLanguage = (lang: 'en' | 'ar') => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => switchLanguage('en')}
        className={`px-2 py-1 rounded ${
          i18n.language === 'en' ? 'text-gold-600 font-semibold' : 'text-gray-600'
        }`}
      >
        EN
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => switchLanguage('ar')}
        className={`px-2 py-1 rounded ${
          i18n.language === 'ar' ? 'text-gold-600 font-semibold' : 'text-gray-600'
        }`}
      >
        AR
      </button>
    </div>
  );
}
