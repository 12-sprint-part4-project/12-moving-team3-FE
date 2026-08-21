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
}: ChatRoomListSkeletonProps) => (
  <div
    className={cn('flex w-full flex-col items-stretch', className)}
    role="status"
    aria-busy="true"
    aria-label="채팅 목록 불러오는 중"
  >
    {Array.from({ length: count }, (_, index) => (
      <ChatRoomListItemSkeleton key={index} className={itemClassName} />
    ))}
  </div>
);
