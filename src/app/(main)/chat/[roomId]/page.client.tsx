'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import {
  useChatMessages,
  useChatRoom,
  useLeaveChatRoom,
  useMarkChatRoomAsRead,
  useSendChatMessage,
} from '@/hooks/useChat';
import { useChatRoomMobileViewport } from '@/hooks/useChatRoomMobileViewport';
import { useChatSocketRoom } from '@/hooks/useChatSocketRoom';
import { useIsMobileViewport } from '@/hooks/useIsMobileViewport';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/i18n/useTranslation';
import { ApiError } from '@/lib/apiClient';
import { chatPartnerDisplayName } from '@/lib/chatPartnerDisplayName';
import { parsePositiveInt } from '@/lib/parsePositiveInt';
import { uploadChatImage } from '@/lib/uploadChatImage';
import { cn } from '@/lib/utils';

import { ChatLoginRequired } from '../_components/ChatLoginRequired';
import { ChatComposer } from './_components/ChatComposer';
import { ChatMessageList } from './_components/ChatMessageList';
import { ChatRoomErrorState } from './_components/ChatRoomErrorState';
import { ChatRoomHeader } from './_components/ChatRoomHeader';
import { ChatRoomHeaderPlaceholder } from './_components/ChatRoomHeaderPlaceholder';
import { ChatRoomInvalidState } from './_components/ChatRoomInvalidState';
import { ChatRoomLeaveModal } from './_components/ChatRoomLeaveModal';
import {
  CHAT_ROOM_CONTENT_CLASS,
  CHAT_ROOM_HEIGHT_DEFAULT_CLASS,
  CHAT_ROOM_HEIGHT_DESKTOP_CLASS,
  CHAT_ROOM_HEIGHT_MOBILE_LOCK_CLASS,
} from './_components/chatRoomStyles';

export interface ChatRoomPageClientProps {
  roomId: string;
  className?: string;
}

/** `/chat/[roomId]` 클라이언트 — 채팅방 상세 */
const ChatRoomPageClient = ({
  roomId: roomIdParam,
  className,
}: ChatRoomPageClientProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const numericRoomId = parsePositiveInt(roomIdParam);
  const isValidRoomId = numericRoomId != null;
  const roomId = numericRoomId ?? 0;

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
  const leaveMutation = useLeaveChatRoom();
  const { mutate: markAsRead } = useMarkChatRoomAsRead(roomId);
  const lastMarkedMessageIdRef = useRef<number | null>(null);
  const lastPartnerMessageIdRef = useRef<number | null>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showNewMessageChip, setShowNewMessageChip] = useState(false);
  const [trackedRoomId, setTrackedRoomId] = useState(roomId);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [scrollToBottomSignal, setScrollToBottomSignal] = useState(0);
  const [focusInputSignal, setFocusInputSignal] = useState(0);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const isNearBottomRef = useRef(true);

  if (trackedRoomId !== roomId) {
    setTrackedRoomId(roomId);
    setIsNearBottom(true);
    setShowNewMessageChip(false);
  }

  useChatSocketRoom(enabled ? roomId : 0);

  // 모바일만: body를 visualViewport에 고정 → 키보드 시 채팅 UI가 가시 영역에 맞게 축소 (#279)
  const isMobileViewport = useIsMobileViewport();
  useChatRoomMobileViewport(enabled && isMobileViewport);

  // auth(localStorage)라 generateMetadata 불가 — room 로드 후 document.title 설정
  useEffect(() => {
    document.title =
      enabled && room
        ? t('chat.roomDocumentTitle', {
            name: chatPartnerDisplayName(room.partner),
          })
        : t('chat.pageDocumentTitle');

    return () => {
      document.title = t('chat.pageDocumentTitle');
    };
  }, [enabled, room, t]);

  useEffect(() => {
    lastMarkedMessageIdRef.current = null;
    lastPartnerMessageIdRef.current = null;
    isNearBottomRef.current = true;
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

  // 상대 새 메시지 — 하단이면 커서만 갱신, 위로 스크롤 중이면 안내 칩
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
    isNearBottomRef.current = nearBottom;
    setIsNearBottom(nearBottom);
    if (nearBottom) {
      setShowNewMessageChip(false);
    }
  }, []);

  const handleScrollToBottom = useCallback(() => {
    setScrollToBottomSignal((current) => current + 1);
    setShowNewMessageChip(false);
  }, []);

  const handleComposerHeightChange = useCallback(() => {
    if (isNearBottomRef.current) {
      handleScrollToBottom();
    }
  }, [handleScrollToBottom]);

  const handleLeaveClick = () => {
    setIsLeaveModalOpen(true);
  };

  const handleLeaveModalClose = () => {
    setIsLeaveModalOpen(false);
  };

  const handleLeaveConfirm = async () => {
    if (leaveMutation.isPending) {
      return;
    }

    try {
      const result = await leaveMutation.mutateAsync(roomId);
      setIsLeaveModalOpen(false);
      showToast({
        content: result ? t('chat.left') : t('chat.alreadyLeft'),
      });
      router.replace('/chat');
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : t('chat.leaveFail');
      showToast({ content: message });
    }
  };

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
      handleScrollToBottom();
      setFocusInputSignal((current) => current + 1);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : t('chat.sendFail');
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
        error instanceof ApiError ? error.message : t('chat.imageSendFail');
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
    return <ChatLoginRequired className={className} />;
  }

  if (!isValidRoomId) {
    return <ChatRoomInvalidState className={className} />;
  }

  return (
    <div
      className={cn(
        CHAT_ROOM_CONTENT_CLASS,
        enabled && isMobileViewport
          ? CHAT_ROOM_HEIGHT_MOBILE_LOCK_CLASS
          : CHAT_ROOM_HEIGHT_DEFAULT_CLASS,
        CHAT_ROOM_HEIGHT_DESKTOP_CLASS,
        className
      )}
    >
      {isRoomPending ? <ChatRoomHeaderPlaceholder variant="loading" /> : null}

      {!isRoomPending && room ? (
        <ChatRoomHeader
          partner={room.partner}
          roomType={room.roomType}
          quoteStatus={room.quoteStatus}
          onLeaveClick={handleLeaveClick}
          className="shrink-0"
        />
      ) : null}

      {!isRoomPending && (isRoomError || !room) ? (
        <ChatRoomHeaderPlaceholder
          title={t('chat.room')}
          titleClassName="text-black-400"
        />
      ) : null}

      {isRoomError && !room ? (
        <ChatRoomErrorState />
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
            disabledReason={composerDisabled ? t('chat.cannotSend') : undefined}
            isSending={isSending}
            onSend={handleSend}
            onSendImages={isMessagingAllowed ? handleSendImages : undefined}
            focusInputSignal={focusInputSignal}
            scrollChipMode={scrollChipMode}
            onScrollChipClick={handleScrollToBottom}
            onHeightChange={handleComposerHeightChange}
            className="shrink-0"
          />
        </>
      )}

      {isLeaveModalOpen ? (
        <ChatRoomLeaveModal
          isLeavePending={leaveMutation.isPending}
          onClose={handleLeaveModalClose}
          onConfirm={() => void handleLeaveConfirm()}
        />
      ) : null}
    </div>
  );
};

export default ChatRoomPageClient;
