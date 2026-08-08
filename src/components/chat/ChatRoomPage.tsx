'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';

import { ChatComposer } from '@/components/chat/ChatComposer';
import { ChatMessageList } from '@/components/chat/ChatMessageList';
import { ChatRoomHeader } from '@/components/chat/ChatRoomHeader';
import { ChatRoomHeaderPlaceholder } from '@/components/chat/ChatRoomHeaderPlaceholder';
import {
  CHAT_MESSAGE_REPORT_HINT_DELAY_MS,
  CHAT_MESSAGE_REPORT_HINT_STORAGE_KEY,
  getChatMessageReportHintMessage,
} from '@/constants/chatUi';
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
import { uploadChatImage } from '@/lib/uploadChatImage';
import { cn } from '@/lib/utils';

export interface ChatRoomPageProps {
  roomId: string;
  className?: string;
}

/** 채팅방 상세 — 텍스트·이미지 전송, 나가기, 발송 제한 */

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
  const reportHintShownRef = useRef(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [trackedRoomId, setTrackedRoomId] = useState(roomId);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [scrollToBottomSignal, setScrollToBottomSignal] = useState(0);
  const [focusInputSignal, setFocusInputSignal] = useState(0);

  if (trackedRoomId !== roomId) {
    setTrackedRoomId(roomId);
    setIsNearBottom(true);
  }

  useChatSocketRoom(enabled ? roomId : 0);

  useEffect(() => {
    lastMarkedMessageIdRef.current = null;
  }, [roomId]);

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

  /** 채팅 기능 최초 1회 — 메시지 신고 안내 (방마다 아님) */
  useEffect(() => {
    if (!enabled || !room || isMessagesPending) {
      return;
    }

    let alreadySeen = false;
    try {
      alreadySeen = Boolean(
        localStorage.getItem(CHAT_MESSAGE_REPORT_HINT_STORAGE_KEY)
      );
    } catch {
      // storage 읽기 실패 → 미표시로 간주하고 안내 진행
    }
    if (alreadySeen) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (reportHintShownRef.current) {
        return;
      }

      try {
        if (localStorage.getItem(CHAT_MESSAGE_REPORT_HINT_STORAGE_KEY)) {
          return;
        }
        localStorage.setItem(CHAT_MESSAGE_REPORT_HINT_STORAGE_KEY, '1');
      } catch {
        // storage 실패 시 ref로 이번 마운트에서 1회만 표시
      }

      reportHintShownRef.current = true;
      showToast({ content: getChatMessageReportHintMessage() });
    }, CHAT_MESSAGE_REPORT_HINT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [enabled, room, isMessagesPending, showToast]);

  const isMessagingAllowed = room?.isMessagingAllowed !== false;

  const handleSend = async (content: string) => {
    if (!isMessagingAllowed) {
      return;
    }

    try {
      await sendMutation.mutateAsync({
        messageType: 'TEXT',
        content,
      });
      setScrollToBottomSignal((current) => current + 1);
      setFocusInputSignal((current) => current + 1);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '메시지 전송에 실패했습니다.';
      showToast({ content: message });
      throw error;
    }
  };

  const handleSendImages = async (files: File[]) => {
    if (!isMessagingAllowed || files.length === 0) {
      return;
    }

    setIsUploadingImages(true);
    try {
      const attachments = await Promise.all(files.map(uploadChatImage));
      await sendMutation.mutateAsync({
        messageType: 'IMAGE',
        attachments,
      });
      setScrollToBottomSignal((current) => current + 1);
      setFocusInputSignal((current) => current + 1);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '이미지 전송에 실패했습니다.';
      showToast({ content: message });
      throw error;
    } finally {
      setIsUploadingImages(false);
    }
  };

  const isSending = sendMutation.isPending || isUploadingImages;
  const composerDisabled = !isMessagingAllowed;

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
    <div
      className={cn(
        'chat-room-content h-[calc(100dvh-var(--height-gnb))] max-h-[calc(100dvh-var(--height-gnb))] lg:h-[calc(100dvh-var(--height-gnb-lg))] lg:max-h-[calc(100dvh-var(--height-gnb-lg))]',
        className
      )}
    >
      {isRoomPending ? (
        <ChatRoomHeaderPlaceholder
          title="불러오는 중…"
          titleClassName="text-gray-300"
        />
      ) : null}

      {!isRoomPending && room ? (
        <ChatRoomHeader
          partner={room.partner}
          roomId={roomId}
          className="shrink-0"
        />
      ) : null}

      {!isRoomPending && (isRoomError || !room) ? (
        <ChatRoomHeaderPlaceholder
          title="채팅방"
          titleClassName="text-black-400"
        />
      ) : null}

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
            partnerLastReadMessageId={
              room ? room.partnerLastReadMessageId : undefined
            }
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
            scrollToBottomSignal={scrollToBottomSignal}
          />
          <ChatComposer
            disabled={composerDisabled}
            disabledReason={
              composerDisabled
                ? '현재 이 채팅방에서는 메시지를 보낼 수 없습니다.'
                : undefined
            }
            isSending={isSending}
            onSend={handleSend}
            onSendImages={isMessagingAllowed ? handleSendImages : undefined}
            focusInputSignal={focusInputSignal}
            className="shrink-0"
          />
        </>
      )}
    </div>
  );
};
