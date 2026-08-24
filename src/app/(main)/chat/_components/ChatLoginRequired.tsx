'use client';

import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import { CHAT_CONTENT_CLASS, CHAT_PAGE_TITLE_CLASS } from './chatLayout';

interface ChatLoginRequiredProps {
  className?: string;
}

/** 채팅 목록·방 — 비로그인 안내 */
export const ChatLoginRequired = ({ className }: ChatLoginRequiredProps) => {
  const { t } = useTranslation();

  return (
    <div className={cn(CHAT_CONTENT_CLASS, className)}>
      <h1 className={CHAT_PAGE_TITLE_CLASS}>{t('chat.title')}</h1>
      <p className="mt-8 text-center text-lg-medium text-gray-300">
        {t('chat.loginRequired')}
      </p>
    </div>
  );
};
