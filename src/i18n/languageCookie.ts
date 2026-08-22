import { LANGUAGE_STORAGE_KEY, type SupportedLanguage } from '@/i18n/config';

export const LANGUAGE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** SSR이 선택 언어를 읽을 수 있도록 localStorage와 함께 쿠키에도 기록한다. */
export const setLanguageCookie = (language: SupportedLanguage) => {
  document.cookie = `${LANGUAGE_STORAGE_KEY}=${encodeURIComponent(language)}; path=/; Max-Age=${LANGUAGE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
};
