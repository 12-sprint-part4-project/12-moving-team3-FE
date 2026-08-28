import enCommon from '@/i18n/locales/en/common.json';
import koCommon from '@/i18n/locales/ko/common.json';
import zhCnCommon from '@/i18n/locales/zh-CN/common.json';

export const resources = {
  ko: { common: koCommon },
  en: { common: enCommon },
  'zh-CN': { common: zhCnCommon },
} as const;
