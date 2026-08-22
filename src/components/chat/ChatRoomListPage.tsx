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

export interface ChatRoomListPageProps {
  className?: string;
}

/** 채팅방 전체 목록 */
export const ChatRoomListPage = ({ className }: ChatRoomListPageProps) => {
  const { t } = useTranslation();
  const { user, isReady } = useAuth();
  const enabled = Boolean(isReady && user);
  const { rooms, isPending, isError, isEmpty } = useChatRooms({ enabled });

  if (!isReady) {
    return null;
  }

  if (!user) {
    return (
      <div className={cn('chat-content', className)}>
        <h1 className="text-2xl-bold text-black-400">{t('chat.title')}</h1>
        <p className="mt-8 text-center text-lg-medium text-gray-300">
          {t('chat.loginRequired')}
        </p>
      </div>
    );
  }

  return (
    <div className={cn('chat-content', className)}>
      <h1 className="text-2xl-bold text-black-400">{t('chat.title')}</h1>

      <div className="mt-6 flex flex-col overflow-hidden rounded-3xl border border-line-200 bg-white">
        {isPending ? (
          <ChatRoomListSkeleton count={CHAT_LIST_SKELETON_COUNT} />
        ) : null}

        {isError ? (
          <p className="px-6 py-10 text-center text-md-medium text-gray-300">
            {t('chat.listError')}
          </p>
        ) : null}

        {!isPending && !isError && isEmpty ? (
          <p className="px-6 py-10 text-center text-md-medium text-gray-300">
            {t('chat.empty')}
          </p>
        ) : null}

        {!isPending && !isError
          ? rooms.map((room) => (
              <ChatRoomListItem key={room.roomId} room={room} />
            ))
          : null}
      </div>
    </div>
  );
};
