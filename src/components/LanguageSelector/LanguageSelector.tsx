'use client';

import { type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import ChevronDownIcon from '@/assets/icons/chevron-down.svg';
import {
  isSupportedLanguage,
  resolveLanguage,
  type SupportedLanguage,
} from '@/i18n/config';
import { cn } from '@/lib/utils';

interface LanguageOption {
  value: SupportedLanguage;
  label: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
  { value: 'zh-CN', label: '简体中文' },
];

export interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector = ({ className }: LanguageSelectorProps) => {
  const { t, i18n } = useTranslation();
  const language = resolveLanguage(i18n.resolvedLanguage ?? i18n.language);

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLanguage = event.target.value;

    if (!isSupportedLanguage(nextLanguage)) {
      return;
    }

    void i18n.changeLanguage(nextLanguage);
  };

  return (
    <label
      className={cn(
        'relative inline-flex items-center text-sm-medium text-black-400',
        className
      )}
    >
      <span className="sr-only">{t('language.selectorLabel')}</span>
      <select
        value={language}
        onChange={handleLanguageChange}
        aria-label={t('language.selectorLabel')}
        className="cursor-pointer appearance-none rounded border border-line-100 bg-white py-1.5 pr-7 pl-2 text-sm-medium text-black-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-gray-400"
        aria-hidden
      />
    </label>
  );
};
