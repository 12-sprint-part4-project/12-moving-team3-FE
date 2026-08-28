'use client';

import { useSyncExternalStore } from 'react';
import { useTranslation as useI18nextTranslation } from 'react-i18next';

import { useInitialLanguage } from '@/i18n/InitialLanguageContext';

const subscribeToNothing = () => () => undefined;
const getClientHydratedSnapshot = () => true;
const getServerHydratedSnapshot = () => false;

/** SSR HTML과 첫 페인트가 같도록, hydrate 전에는 쿠키 언어로 t()를 고정한다. */
export const useTranslation = ((
  ...args: Parameters<typeof useI18nextTranslation>
) => {
  const translation = useI18nextTranslation(...args);
  const initialLanguage = useInitialLanguage();
  const hasHydrated = useSyncExternalStore(
    subscribeToNothing,
    getClientHydratedSnapshot,
    getServerHydratedSnapshot
  );

  if (hasHydrated) {
    return translation;
  }

  const i18n = new Proxy(translation.i18n, {
    get: (target, property, receiver) => {
      if (property === 'language' || property === 'resolvedLanguage') {
        return initialLanguage;
      }

      return Reflect.get(target, property, receiver);
    },
  });

  return {
    ...translation,
    i18n,
    t: translation.i18n.getFixedT(initialLanguage),
  };
}) as typeof useI18nextTranslation;
