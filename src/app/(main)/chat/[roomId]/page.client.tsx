'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ReportAction } from '@/components/reports';
import { useAuth } from '@/hooks/useAuth';
import {
  useChatMessages,
  useChatRoom,
  useLeaveChatRoom,
} from '@/hooks/useChat';
import { useChatRoomMobileViewport } from '@/hooks/useChatRoomMobileViewport';
import { useChatSocketRoom } from '@/hooks/useChatSocketRoom';
import { useIsMobileViewport } from '@/hooks/useIsMobileViewport';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/i18n/useTranslation';
import { ApiError } from '@/lib/apiClient';
import { chatPartnerDisplayName } from '@/lib/chatPartnerDisplayName';
import { parsePositiveInt } from '@/lib/parsePositiveInt';
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
import { useChatRoomReadReceipt } from './_lib/useChatRoomReadReceipt';
import { useChatRoomScrollChip } from './_lib/useChatRoomScrollChip';
import { useChatRoomSend } from './_lib/useChatRoomSend';

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

  const leaveMutation = useLeaveChatRoom();
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [reportMessageId, setReportMessageId] = useState<number | null>(null);

  useChatSocketRoom(enabled ? roomId : 0);

  // 모바일만: body를 visualViewport에 고정 → 키보드 시 채팅 UI가 가시 영역에 맞게 축소 (#279)
  const isMobileViewport = useIsMobileViewport();
  useChatRoomMobileViewport(enabled && isMobileViewport);

  const {
    isNearBottom,
    scrollChipMode,
    scrollToBottomSignal,
    focusInputSignal,
    handleNearBottomChange,
    handleScrollToBottom,
    handleComposerHeightChange,
    notifyMessageSent,
  } = useChatRoomScrollChip({
    roomId,
    enabled,
    messages,
    currentUserId: user?.id,
  });

  useChatRoomReadReceipt({
    roomId,
    enabled,
    messages,
    currentUserId: user?.id,
    isNearBottom,
  });

  const isMessagingAllowed = room?.isMessagingAllowed !== false;

  const { handleSend, handleSendImages, isSending } = useChatRoomSend({
    roomId,
    isMessagingAllowed,
    onMessageSent: notifyMessageSent,
  });

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

  const handleReportMessage = (messageId: number) => {
    if (!user) {
      showToast({ content: t('chat.loginNeeded') });
      return;
    }
    setReportMessageId(messageId);
  };

  const composerDisabled = !isMessagingAllowed;

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
            onReportMessage={handleReportMessage}
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

      {reportMessageId != null ? (
        <ReportAction
          target="MESSAGE"
          targetId={String(reportMessageId)}
          controlledOpen
          onControlledClose={() => setReportMessageId(null)}
        />
      ) : null}
    </div>
  );
};

export default ChatRoomPageClient;
