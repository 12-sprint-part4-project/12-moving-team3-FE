'use client';

import { createContext, useContext, type ReactNode } from 'react';

import { DEFAULT_LANGUAGE, type SupportedLanguage } from '@/i18n/config';

const InitialLanguageContext = createContext<SupportedLanguage>(DEFAULT_LANGUAGE);

interface InitialLanguageProviderProps {
  language: SupportedLanguage;
  children: ReactNode;
}

export const InitialLanguageProvider = ({
  language,
  children,
}: InitialLanguageProviderProps) => (
  <InitialLanguageContext.Provider value={language}>
    {children}
  </InitialLanguageContext.Provider>
);

export const useInitialLanguage = () => useContext(InitialLanguageContext);
