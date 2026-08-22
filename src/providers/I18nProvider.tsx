'use client';

import { useEffect, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import { LANGUAGE_STORAGE_KEY, resolveLanguage } from '@/i18n/config';
import { i18n } from '@/i18n/i18n';

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  useEffect(() => {
    const applyLanguage = (language: string) => {
      const resolvedLanguage = resolveLanguage(language);

      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, resolvedLanguage);
      document.documentElement.lang = resolvedLanguage;
    };

    const storedLanguage = resolveLanguage(
      window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    );

    applyLanguage(storedLanguage);
    i18n.on('languageChanged', applyLanguage);

    if ((i18n.resolvedLanguage ?? i18n.language) !== storedLanguage) {
      void i18n.changeLanguage(storedLanguage);
    }

    return () => {
      i18n.off('languageChanged', applyLanguage);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
