import { resolveLanguage, type SupportedLanguage } from '@/i18n/config';
import { i18n } from '@/i18n/i18n';

export const getActiveLanguage = (): SupportedLanguage =>
  resolveLanguage(i18n.resolvedLanguage ?? i18n.language ?? null);

export const toBcp47Locale = (language: SupportedLanguage): string => {
  switch (language) {
    case 'en':
      return 'en-US';
    case 'zh-CN':
      return 'zh-CN';
    default:
      return 'ko-KR';
  }
};
