export const SUPPORTED_LANGUAGES = ['ko', 'en', 'zh-CN'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'ko';
export const LANGUAGE_STORAGE_KEY = 'moving-language';

export const isSupportedLanguage = (
  language: string | null
): language is SupportedLanguage =>
  SUPPORTED_LANGUAGES.some(
    (supportedLanguage) => supportedLanguage === language
  );

export const resolveLanguage = (language: string | null): SupportedLanguage =>
  isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;
