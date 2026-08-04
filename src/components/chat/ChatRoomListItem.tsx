'use client';

import Link from 'next/link';

import { ChatAvatar } from '@/components/chat/ChatAvatar';
import { ChatUnreadBadge } from '@/components/chat/ChatUnreadBadge';
import { getChatLastMessagePreview } from '@/lib/chatMessagePreview';
import { formatRelativeTime } from '@/lib/formatDate';
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
  const preview = getChatLastMessagePreview(room.lastMessage);
  const relativeTime = room.lastMessage
    ? formatRelativeTime(room.lastMessage.createdAt)
    : '';
  const hasUnread = room.unreadCount > 0;

  return (
    <Link
      href={`/chat/${room.roomId}`}
      onClick={onNavigate}
      className={cn(
        'flex w-full items-start gap-3 border-b border-line-200 bg-white px-6 py-4 last:border-b-0',
        'hover:bg-background-100 focus-visible:bg-background-100 focus-visible:outline-none',
        className
      )}
    >
      <ChatAvatar
        src={room.partner.profileImageUrl}
        alt=""
        className="size-10"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              'min-w-0 flex-1 truncate text-black-400',
              hasUnread ? 'text-lg-semibold' : 'text-lg-medium'
            )}
          >
            {room.partner.nickname}
          </p>
          <ChatUnreadBadge count={room.unreadCount} />
        </div>

        <p className="truncate text-md-medium text-black-400">{preview}</p>

        {relativeTime ? (
          <p className="text-md-medium text-gray-300">{relativeTime}</p>
        ) : null}
      </div>
    </Link>
  );
};
