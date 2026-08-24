'use client';

import Link from 'next/link';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import { CHAT_CONTENT_CLASS } from '../../_components/chatLayout';

interface ChatRoomInvalidStateProps {
  className?: string;
}

/** `/chat/[roomId]` — roomId가 양의 정수가 아닐 때 */
export const ChatRoomInvalidState = ({
  className,
}: ChatRoomInvalidStateProps) => {
  const { t } = useTranslation();

  return (
    <div className={cn(CHAT_CONTENT_CLASS, className)}>
      <Link
        href="/chat"
        className="inline-flex w-fit items-center gap-1 text-md-medium text-gray-400 hover:text-black-400"
      >
        <ChevronLeftIcon className="size-5" aria-hidden />
        {t('chat.listLink')}
      </Link>
      <p className="mt-8 text-center text-lg-medium text-gray-300">
        {t('chat.roomNotFound')}
      </p>
    </div>
  );
};
