import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './texts/en';
import ar from './texts/ar';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: 'en', // default
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
