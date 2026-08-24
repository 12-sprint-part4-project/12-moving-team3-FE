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
import {
  CHAT_CONTENT_CLASS,
  CHAT_LIST_PANEL_CLASS,
  CHAT_LIST_STATE_MESSAGE_CLASS,
  CHAT_PAGE_TITLE_CLASS,
} from './_components/chatLayout';

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
      <div className={cn(CHAT_CONTENT_CLASS, className)}>
        <h1 className={CHAT_PAGE_TITLE_CLASS}>{t('chat.title')}</h1>
        <div className={CHAT_LIST_PANEL_CLASS}>
          <ChatRoomListSkeleton count={CHAT_LIST_SKELETON_COUNT} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn(CHAT_CONTENT_CLASS, className)}>
        <h1 className={CHAT_PAGE_TITLE_CLASS}>{t('chat.title')}</h1>
        <div className={CHAT_LIST_PANEL_CLASS}>
          <p className={CHAT_LIST_STATE_MESSAGE_CLASS}>{t('chat.listError')}</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={cn(CHAT_CONTENT_CLASS, className)}>
        <h1 className={CHAT_PAGE_TITLE_CLASS}>{t('chat.title')}</h1>
        <div className={CHAT_LIST_PANEL_CLASS}>
          <p className={CHAT_LIST_STATE_MESSAGE_CLASS}>{t('chat.empty')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(CHAT_CONTENT_CLASS, className)}>
      <h1 className={CHAT_PAGE_TITLE_CLASS}>{t('chat.title')}</h1>
      <div className={CHAT_LIST_PANEL_CLASS}>
        {rooms.map((room) => (
          <ChatRoomListItem key={room.roomId} room={room} />
        ))}
      </div>
    </div>
  );
};

export default ChatListPageClient;
