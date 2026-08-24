'use client';

import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

interface ChatLoginRequiredProps {
  className?: string;
}

/** 채팅 목록·방 — 비로그인 안내 */
export const ChatLoginRequired = ({ className }: ChatLoginRequiredProps) => {
  const { t } = useTranslation();

  return (
    <div className={cn('chat-content', className)}>
      <h1 className="text-2xl-bold text-black-400">{t('chat.title')}</h1>
      <p className="mt-8 text-center text-lg-medium text-gray-300">
        {t('chat.loginRequired')}
      </p>
    </div>
  );
};
