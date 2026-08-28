import { createInstance } from 'i18next';

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/i18n/config';
import { resources } from '@/i18n/resources';

/** Server Component 전용. react-i18next를 쓰지 않아 RSC에서 안전하다. */
export const serverI18n = createInstance();

void serverI18n.init({
  resources,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  defaultNS: 'common',
  ns: ['common'],
  interpolation: {
    escapeValue: false,
  },
  initAsync: false,
});
