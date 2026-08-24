'use client';

import { ChatRoomListItem } from '@/components/chat/ChatRoomListItem';
import {
  CHAT_LIST_SKELETON_COUNT,
  ChatRoomListSkeleton,
} from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useChatRooms } from '@/hooks/useChat';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import { ChatLoginRequired } from './_components/ChatLoginRequired';

export interface ChatListPageClientProps {
  className?: string;
}

/** `/chat` 클라이언트 — 채팅방 목록 */
const ChatListPageClient = ({ className }: ChatListPageClientProps) => {
  const { t } = useTranslation();
  const { user, isReady } = useAuth();
  const enabled = Boolean(isReady && user);
  const { rooms, isPending, isError, isEmpty } = useChatRooms({ enabled });

  if (!isReady) {
    return null;
  }

  if (!user) {
    return <ChatLoginRequired className={className} />;
  }

  if (isPending) {
    return (
      <div className={cn('chat-content', className)}>
        <h1 className="text-2xl-bold text-black-400">{t('chat.title')}</h1>
        <div className="mt-6 flex flex-col overflow-hidden rounded-3xl border border-line-200 bg-white">
          <ChatRoomListSkeleton count={CHAT_LIST_SKELETON_COUNT} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn('chat-content', className)}>
        <h1 className="text-2xl-bold text-black-400">{t('chat.title')}</h1>
        <div className="mt-6 flex flex-col overflow-hidden rounded-3xl border border-line-200 bg-white">
          <p className="px-6 py-10 text-center text-md-medium text-gray-300">
            {t('chat.listError')}
          </p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={cn('chat-content', className)}>
        <h1 className="text-2xl-bold text-black-400">{t('chat.title')}</h1>
        <div className="mt-6 flex flex-col overflow-hidden rounded-3xl border border-line-200 bg-white">
          <p className="px-6 py-10 text-center text-md-medium text-gray-300">
            {t('chat.empty')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('chat-content', className)}>
      <h1 className="text-2xl-bold text-black-400">{t('chat.title')}</h1>
      <div className="mt-6 flex flex-col overflow-hidden rounded-3xl border border-line-200 bg-white">
        {rooms.map((room) => (
          <ChatRoomListItem key={room.roomId} room={room} />
        ))}
      </div>
    </div>
  );
};

export default ChatListPageClient;
