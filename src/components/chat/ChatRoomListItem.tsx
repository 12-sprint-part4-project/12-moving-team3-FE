'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ChatAvatar } from '@/components/chat/ChatAvatar';
import { ChatRoomStatusChip } from '@/components/chat/ChatRoomStatusChip';
import { ChatUnreadBadge } from '@/components/chat/ChatUnreadBadge';
import { useAuth } from '@/hooks/useAuth';
import { getChatListStatusLabel } from '@/lib/chatListStatusLabel';
import { getChatLastMessagePreview } from '@/lib/chatMessagePreview';
import { cn } from '@/lib/utils';
import type { ChatRoomListItem as ChatRoomListItemData } from '@/types/chat';

export interface ChatRoomListItemProps {
  room: ChatRoomListItemData;
  /** 드롭다운 등에서 네비게이션 전 닫기 */
  onNavigate?: () => void;
  className?: string;
}

/** 채팅방 목록/미리보기 공용 행 */
export const ChatRoomListItem = ({
  room,
  onNavigate,
  className,
}: ChatRoomListItemProps) => {
  const { user } = useAuth();
  const [, setStatusTick] = useState(0);
  const preview = getChatLastMessagePreview(room.lastMessage);
  const hasUnread = room.unreadCount > 0;

  const statusLabel =
    user != null ? getChatListStatusLabel(room, user.id) : '';

  useEffect(() => {
    if (!room.lastMessage) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setStatusTick((current) => current + 1);
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, [room.lastMessage]);

  return (
    <Link
      href={`/chat/${room.roomId}`}
      onClick={onNavigate}
      className={cn(
        'flex w-full items-center gap-3 border-b border-line-200 bg-white px-6 py-4 last:border-b-0',
        'hover:bg-background-100 focus-visible:bg-background-100 focus-visible:outline-none',
        className
      )}
    >
      <ChatAvatar
        src={room.partner.profileImageUrl}
        alt=""
        className="size-10 shrink-0"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <p
            className={cn(
              'min-w-0 truncate text-black-400',
              hasUnread ? 'text-lg-semibold' : 'text-lg-medium'
            )}
          >
            {room.partner.displayName}
          </p>
          <ChatRoomStatusChip
            roomType={room.roomType}
            quoteStatus={room.quoteStatus}
          />
        </div>

        <p className="truncate text-md-medium text-black-400">{preview}</p>

        {statusLabel ? (
          <p className="text-md-medium text-gray-300">{statusLabel}</p>
        ) : null}
      </div>

      <ChatUnreadBadge count={room.unreadCount} />
    </Link>
  );
};
