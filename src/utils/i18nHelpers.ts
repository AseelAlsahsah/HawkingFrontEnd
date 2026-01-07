import i18n from 'i18next';

export const isArabic = () => i18n.language === 'ar';

export const pickLang = (en?: string, ar?: string) => {
  if (i18n.language === 'ar') {
    return ar || en || '';
  }
  return en || ar || '';
};
