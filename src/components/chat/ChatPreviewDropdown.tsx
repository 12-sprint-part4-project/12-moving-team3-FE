'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import CloseIcon from '@/assets/icons/close.svg';
import { ChatRoomListItem } from '@/components/chat/ChatRoomListItem';
import {
  CHAT_PREVIEW_SKELETON_COUNT,
  ChatRoomListSkeleton,
} from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useChatRooms } from '@/hooks/useChat';
import { useTranslation } from '@/i18n/useTranslation';
import { sortChatRoomsForGnbPreview } from '@/lib/chatRoomListSort';
import { cn } from '@/lib/utils';

const PREVIEW_LIMIT = 3;

export interface ChatPreviewDropdownProps {
  onClose: () => void;
  className?: string;
}

/** GNB 채팅 미리보기 — 알림 드롭다운 셸 참고 */
export const ChatPreviewDropdown = ({
  onClose,
  className,
}: ChatPreviewDropdownProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { rooms, isPending, isError, isEmpty } = useChatRooms();
  const previewRooms = useMemo(
    () => sortChatRoomsForGnbPreview(rooms).slice(0, PREVIEW_LIMIT),
    [rooms]
  );
  const showViewAllLink = rooms.length > PREVIEW_LIMIT;

  return (
    <div
      role="dialog"
      aria-label={t('chat.previewAria')}
      className={cn(
        'flex w-[19.5rem] max-w-[calc(100vw-2.5rem)] flex-col items-stretch rounded-3xl border border-line-200 bg-white px-4 py-2.5 shadow-[0.125rem_0.125rem_0.25rem] shadow-shadow-gray-200/20 md:w-chat-preview',
        className
      )}
    >
      <div className="flex w-full items-center justify-between py-3.5 pr-3 pl-6">
        <p className="text-2lg-bold text-black-400">{t('chat.title')}</p>
        <button
          type="button"
          aria-label={t('chat.closeAria')}
          onClick={onClose}
          className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center text-black-400"
        >
          <CloseIcon className="size-6" aria-hidden />
        </button>
      </div>

      <div className="flex w-full flex-col items-stretch">
        {isPending ? (
          <ChatRoomListSkeleton
            count={CHAT_PREVIEW_SKELETON_COUNT}
            itemClassName="w-full max-w-[20.4375rem] self-center border-line-200 px-6"
          />
        ) : null}

        {isError ? (
          <p className="px-6 py-8 text-center text-md-medium text-gray-300">
            {t('chat.listError')}
          </p>
        ) : null}

        {!isPending && !isError && isEmpty ? (
          <p className="px-6 py-8 text-center text-md-medium text-gray-300">
            {t('chat.empty')}
          </p>
        ) : null}

        {!isPending && !isError
          ? previewRooms.map((room) => (
              <ChatRoomListItem
                key={room.roomId}
                room={room}
                currentUserId={user?.id}
                onNavigate={onClose}
                className="w-full max-w-[20.4375rem] self-center border-line-200 px-6"
              />
            ))
          : null}
      </div>

      {showViewAllLink ? (
        <div className="flex w-full items-center justify-center border-t border-line-100 py-3">
          <Link
            href="/chat"
            onClick={onClose}
            className="text-md-medium text-gray-500 hover:text-black-400"
          >
            {t('chat.viewAll')}
          </Link>
        </div>
      ) : null}
    </div>
  );
};
