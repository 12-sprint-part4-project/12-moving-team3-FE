'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import { ChatComposer } from '@/components/chat/ChatComposer';
import { ChatMessageList } from '@/components/chat/ChatMessageList';
import { ChatRoomHeader } from '@/components/chat/ChatRoomHeader';
import { ChatRoomHeaderPlaceholder } from '@/components/chat/ChatRoomHeaderPlaceholder';
import { useAuth } from '@/hooks/useAuth';
import {
  useChatMessages,
  useChatRoom,
  useMarkChatRoomAsRead,
  useSendChatMessage,
} from '@/hooks/useChat';
import { useChatRoomMobileViewport } from '@/hooks/useChatRoomMobileViewport';
import { useChatSocketRoom } from '@/hooks/useChatSocketRoom';
import { useIsMobileViewport } from '@/hooks/useIsMobileViewport';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import {
  CHAT_PAGE_DOCUMENT_TITLE,
  chatRoomDocumentTitle,
} from '@/lib/chatPartnerDisplayName';
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

  const {
    room,
    isPending: isRoomPending,
    isError: isRoomError,
  } = useChatRoom(roomId, { enabled });

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
  const lastPartnerMessageIdRef = useRef<number | null>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showNewMessageChip, setShowNewMessageChip] = useState(false);
  const [trackedRoomId, setTrackedRoomId] = useState(roomId);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [scrollToBottomSignal, setScrollToBottomSignal] = useState(0);
  const [focusInputSignal, setFocusInputSignal] = useState(0);

  if (trackedRoomId !== roomId) {
    setTrackedRoomId(roomId);
    setIsNearBottom(true);
    setShowNewMessageChip(false);
  }

  useChatSocketRoom(enabled ? roomId : 0);

  // 모바일만: body를 visualViewport에 고정 → 키보드 시 채팅 UI가 가시 영역에 맞게 축소 (#279)
  // 데스크톱은 훅 미사용 — 메시지 리스트 스크롤·전송 하단 이동 기존 유지
  const isMobileViewport = useIsMobileViewport();
  useChatRoomMobileViewport(enabled && isMobileViewport);

  // SEO 탭 타이틀 — auth(localStorage)라 generateMetadata 불가, room 로드 후 absolute로 설정
  useEffect(() => {
    document.title =
      enabled && room
        ? chatRoomDocumentTitle(room.partner)
        : CHAT_PAGE_DOCUMENT_TITLE;

    return () => {
      document.title = CHAT_PAGE_DOCUMENT_TITLE;
    };
  }, [enabled, room]);

  useEffect(() => {
    lastMarkedMessageIdRef.current = null;
    lastPartnerMessageIdRef.current = null;
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

  // 상대 새 메시지 추적 — 하단이면 커서만 갱신, 위로 스크롤 중이면 안내 칩 활성화
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const latest = messages.at(-1);
    if (!latest || latest.senderId === user?.id) {
      return;
    }

    const latestId = latest.messageId;
    if (isNearBottom) {
      lastPartnerMessageIdRef.current = latestId;
      return;
    }

    if (lastPartnerMessageIdRef.current === latestId) {
      return;
    }

    lastPartnerMessageIdRef.current = latestId;
    setShowNewMessageChip(true);
  }, [enabled, messages, user?.id, isNearBottom]);

  const handleNearBottomChange = useCallback((nearBottom: boolean) => {
    setIsNearBottom(nearBottom);
    if (nearBottom) {
      setShowNewMessageChip(false);
    }
  }, []);

  const handleScrollToBottom = useCallback(() => {
    setScrollToBottomSignal((current) => current + 1);
    setShowNewMessageChip(false);
  }, []);

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
      // 하단 스크롤을 먼저 요청한 뒤, preventScroll 포커스로 문서 밀림을 막는다 (#279)
      handleScrollToBottom();
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
      handleScrollToBottom();
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
  const scrollChipMode =
    !isNearBottom && showNewMessageChip
      ? 'new-message'
      : !isNearBottom
        ? 'to-bottom'
        : 'hidden';

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
        'chat-room-content',
        // 모바일 + viewport lock: body가 vv 높이이므로 main 남은 공간을 채움
        enabled && isMobileViewport
          ? 'h-full min-h-0 max-h-full flex-1'
          : 'h-[calc(100dvh-var(--height-gnb))] max-h-[calc(100dvh-var(--height-gnb))]',
        'lg:h-[calc(100dvh-var(--height-gnb-lg))] lg:max-h-[calc(100dvh-var(--height-gnb-lg))]',
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
          roomType={room.roomType}
          quoteStatus={room.quoteStatus}
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
            isPartnerLeft={room?.isPartnerLeft ?? false}
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
            onNearBottomChange={handleNearBottomChange}
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
            scrollChipMode={scrollChipMode}
            onScrollChipClick={handleScrollToBottom}
            className="shrink-0"
          />
        </>
      )}
    </div>
  );
};
