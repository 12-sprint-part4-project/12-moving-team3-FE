'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';

import { ChatAvatar } from '@/components/chat/ChatAvatar';
import { ChatComposer } from '@/components/chat/ChatComposer';
import { ChatMessageList } from '@/components/chat/ChatMessageList';
import { useAuth } from '@/hooks/useAuth';
import {
  useChatMessages,
  useChatRoom,
  useMarkChatRoomAsRead,
  useSendChatMessage,
} from '@/hooks/useChat';
import { useChatSocketRoom } from '@/hooks/useChatSocketRoom';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { cn } from '@/lib/utils';

export interface ChatRoomPageProps {
  roomId: string;
  className?: string;
}

/**
 * Phase 2 채팅방 상세 — 메시지 이력·전송·실시간 수신·읽음.
 * 이미지 첨부·나가기·발송 제한 UI는 Phase 3~4.
 */
export const ChatRoomPage = ({
  roomId: roomIdParam,
  className,
}: ChatRoomPageProps) => {
  const roomId = Number(roomIdParam);
  const isValidRoomId = Number.isFinite(roomId) && roomId > 0;

  const { user, isReady } = useAuth();
  const { showToast } = useToast();
  const enabled = Boolean(isReady && user && isValidRoomId);

  const { room, isPending: isRoomPending, isError: isRoomError } = useChatRoom(
    roomId,
    { enabled }
  );

  const {
    messages,
    isPending: isMessagesPending,
    isError: isMessagesError,
    isFetchNextPageError,
    isEmpty,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
  } = useChatMessages(roomId, { enabled });

  const sendMutation = useSendChatMessage(roomId);
  const { mutate: markAsRead } = useMarkChatRoomAsRead(roomId);
  const lastMarkedMessageIdRef = useRef<number | null>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [trackedRoomId, setTrackedRoomId] = useState(roomId);

  // 방 전환 시 하단 고정 상태 초기화 (props 변경에 맞춘 state 조정)
  if (trackedRoomId !== roomId) {
    setTrackedRoomId(roomId);
    setIsNearBottom(true);
  }

  useChatSocketRoom(enabled ? roomId : 0);

  useEffect(() => {
    lastMarkedMessageIdRef.current = null;
  }, [roomId]);

  // 상대 최신 메시지를 실제로 보고 있을 때만 읽음 처리
  useEffect(() => {
    if (!enabled) {
      lastMarkedMessageIdRef.current = null;
      return;
    }

    if (!isNearBottom) {
      return;
    }

    const latest = messages.at(-1);
    if (!latest || latest.senderId === user?.id) {
      return;
    }

    const latestMessageId = latest.messageId;
    if (lastMarkedMessageIdRef.current === latestMessageId) {
      return;
    }

    lastMarkedMessageIdRef.current = latestMessageId;
    markAsRead(
      { lastReadMessageId: latestMessageId },
      {
        onError: () => {
          if (lastMarkedMessageIdRef.current === latestMessageId) {
            lastMarkedMessageIdRef.current = null;
          }
        },
      }
    );
  }, [enabled, roomId, messages, markAsRead, user?.id, isNearBottom]);

  const handleSend = async (content: string) => {
    try {
      await sendMutation.mutateAsync({
        messageType: 'TEXT',
        content,
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '메시지 전송에 실패했습니다.';
      showToast({ content: message });
      throw error;
    }
  };

  if (!isReady) {
    return null;
  }

  if (!user) {
    return (
      <div className={cn('chat-content', className)}>
        <h1 className="text-2xl-bold text-black-400">채팅</h1>
        <p className="mt-8 text-center text-lg-medium text-gray-300">
          로그인 후 채팅을 이용할 수 있어요
        </p>
      </div>
    );
  }

  if (!isValidRoomId) {
    return (
      <div className={cn('chat-content', className)}>
        <Link
          href="/chat"
          className="inline-flex w-fit items-center gap-1 text-md-medium text-gray-400 hover:text-black-400"
        >
          <ChevronLeftIcon className="size-5" aria-hidden />
          채팅 목록
        </Link>
        <p className="mt-8 text-center text-lg-medium text-gray-300">
          존재하지 않는 채팅방이에요
        </p>
      </div>
    );
  }

  return (
    <div className={cn('chat-room-content', className)}>
      <header className="flex w-full shrink-0 items-center gap-3 border-b border-line-100 bg-white px-4 py-3 md:px-6">
        <Link
          href="/chat"
          aria-label="채팅 목록으로"
          className="inline-flex size-6 shrink-0 items-center justify-center text-black-400"
        >
          <ChevronLeftIcon className="size-6" aria-hidden />
        </Link>

        {isRoomPending ? (
          <p className="text-2lg-semibold text-gray-300">불러오는 중…</p>
        ) : null}

        {!isRoomPending && room ? (
          <>
            <ChatAvatar
              src={room.partner.profileImageUrl}
              alt=""
              className="size-9"
            />
            <p className="min-w-0 flex-1 truncate text-2lg-semibold text-black-400">
              {room.partner.nickname}
            </p>
          </>
        ) : null}

        {!isRoomPending && (isRoomError || !room) ? (
          <p className="text-2lg-semibold text-black-400">채팅방</p>
        ) : null}
      </header>

      {isRoomError && !room ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16">
          <p className="text-center text-lg-medium text-gray-300">
            채팅방을 불러오지 못했어요
          </p>
          <Link
            href="/chat"
            className="text-md-medium text-blue-300 underline-offset-2 hover:underline"
          >
            채팅 목록으로
          </Link>
        </div>
      ) : (
        <>
          <ChatMessageList
            key={roomId}
            messages={messages}
            currentUserId={user.id}
            isPending={isMessagesPending}
            isError={isMessagesError}
            isFetchNextPageError={isFetchNextPageError}
            isEmpty={isEmpty}
            hasNextPage={Boolean(hasNextPage)}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            onLoadOlder={() => {
              void fetchNextPage();
            }}
            onNearBottomChange={setIsNearBottom}
          />
          <ChatComposer
            isSending={sendMutation.isPending}
            onSend={handleSend}
          />
        </>
      )}
    </div>
  );
};
