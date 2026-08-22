'use client';

import { useEffect, useLayoutEffect, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import { LANGUAGE_STORAGE_KEY, resolveLanguage } from '@/i18n/config';
import { i18n } from '@/i18n/i18n';
import { InitialLanguageProvider } from '@/i18n/InitialLanguageContext';
import { setLanguageCookie } from '@/i18n/languageCookie';

import type { SupportedLanguage } from '@/i18n/config';

interface I18nProviderProps {
  initialLanguage: SupportedLanguage;
  children: ReactNode;
}

export const I18nProvider = ({
  initialLanguage,
  children,
}: I18nProviderProps) => {
  useLayoutEffect(() => {
    if ((i18n.resolvedLanguage ?? i18n.language) !== initialLanguage) {
      void i18n.changeLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  useEffect(() => {
    const applyLanguage = (language: string) => {
      const resolvedLanguage = resolveLanguage(language);

      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, resolvedLanguage);
      setLanguageCookie(resolvedLanguage);
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

  return (
    <InitialLanguageProvider language={initialLanguage}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </InitialLanguageProvider>
  );
};
