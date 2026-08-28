'use client';

import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import { ChatRoomListItemSkeleton } from './ChatRoomListItemSkeleton';

export interface ChatRoomListSkeletonProps {
  count: number;
  className?: string;
  itemClassName?: string;
}

/** 채팅방 목록 스켈레톤 — count는 화면별 고정 상수 사용 */
export const ChatRoomListSkeleton = ({
  count,
  className,
  itemClassName,
}: ChatRoomListSkeletonProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn('flex w-full flex-col items-stretch', className)}
      role="status"
      aria-busy="true"
      aria-label={t('a11y.skeleton.chatList')}
    >
      {Array.from({ length: count }, (_, index) => (
        <ChatRoomListItemSkeleton key={index} className={itemClassName} />
      ))}
    </div>
  );
};
