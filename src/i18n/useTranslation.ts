'use client';

import { useSyncExternalStore } from 'react';
import { useTranslation as useI18nextTranslation } from 'react-i18next';

import { DEFAULT_LANGUAGE } from '@/i18n/config';

const subscribeToNothing = () => () => undefined;
const getClientHydratedSnapshot = () => true;
const getServerHydratedSnapshot = () => false;

/** 서버 HTML은 기본 언어라서, hydrate가 끝나기 전에는 t()도 기본 언어를 쓴다. */
export const useTranslation = ((
  ...args: Parameters<typeof useI18nextTranslation>
) => {
  const translation = useI18nextTranslation(...args);
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
        return DEFAULT_LANGUAGE;
      }

      return Reflect.get(target, property, receiver);
    },
  });

  return {
    ...translation,
    i18n,
    t: translation.i18n.getFixedT(DEFAULT_LANGUAGE),
  };
}) as typeof useI18nextTranslation;
