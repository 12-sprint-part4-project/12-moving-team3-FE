'use client';

import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type UIEvent,
} from 'react';

import { ChatMessageItem } from '@/components/chat/ChatMessageItem';
import {
  formatChatDateSeparator,
  isSameLocalCalendarDay,
} from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types/chat';

export interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  isPending: boolean;
  isError: boolean;
  isEmpty: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadOlder: () => void;
  /** 최신 메시지 가시 영역(하단 근처) 여부 — 읽음 처리 등에 사용 */
  onNearBottomChange?: (isNearBottom: boolean) => void;
  className?: string;
}

const NEAR_TOP_PX = 80;
const NEAR_BOTTOM_PX = 120;

/** 메시지 스크롤 영역 — 상단 도달 시 이전 이력 로드 */
export const ChatMessageList = ({
  messages,
  currentUserId,
  isPending,
  isError,
  isEmpty,
  hasNextPage,
  isFetchingNextPage,
  onLoadOlder,
  onNearBottomChange,
  className,
}: ChatMessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<{
    height: number;
    top: number;
    oldestMessageId: number;
  } | null>(null);
  const shouldStickToBottomRef = useRef(true);
  const reportedNearBottomRef = useRef<boolean | null>(null);
  const prevMessageCountRef = useRef(0);
  const oldestMessageIdRef = useRef<number | null>(null);
  const wasFetchingNextPageRef = useRef(false);

  const reportNearBottom = useCallback(
    (isNearBottom: boolean) => {
      shouldStickToBottomRef.current = isNearBottom;
      if (reportedNearBottomRef.current === isNearBottom) {
        return;
      }
      reportedNearBottomRef.current = isNearBottom;
      onNearBottomChange?.(isNearBottom);
    },
    [onNearBottomChange]
  );

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'auto') => {
      const el = scrollRef.current;
      if (!el) {
        return;
      }
      el.scrollTo({ top: el.scrollHeight, behavior });
      reportNearBottom(true);
    },
    [reportNearBottom]
  );

  // 이전 메시지 prepend 시에만 스크롤 앵커 복원 (소켓 append에는 적용하지 않음)
  useLayoutEffect(() => {
    const el = scrollRef.current;
    const anchor = scrollAnchorRef.current;
    if (!el || anchor == null) {
      return;
    }

    const currentOldestId = messages[0]?.messageId ?? null;
    if (
      currentOldestId == null ||
      currentOldestId === anchor.oldestMessageId
    ) {
      return;
    }

    el.scrollTop = anchor.top + (el.scrollHeight - anchor.height);
    scrollAnchorRef.current = null;
  }, [messages]);

  // 이전 페이지 요청이 끝나도 oldest가 그대로면(실패·빈 페이지) 앵커 해제 → 재시도 가능
  useEffect(() => {
    const wasFetching = wasFetchingNextPageRef.current;
    wasFetchingNextPageRef.current = isFetchingNextPage;

    if (!wasFetching || isFetchingNextPage) {
      return;
    }

    const anchor = scrollAnchorRef.current;
    if (!anchor) {
      return;
    }

    const currentOldestId = messages[0]?.messageId ?? null;
    if (currentOldestId === anchor.oldestMessageId) {
      scrollAnchorRef.current = null;
    }
  }, [isFetchingNextPage, messages]);

  // 최초 로드·하단 고정 시 스크롤 / 새 메시지 도착
  useEffect(() => {
    const prevCount = prevMessageCountRef.current;
    const nextCount = messages.length;
    const oldestId = messages[0]?.messageId ?? null;
    const didPrependOlder =
      prevCount > 0 &&
      oldestId != null &&
      oldestMessageIdRef.current != null &&
      oldestId !== oldestMessageIdRef.current &&
      nextCount > prevCount;

    prevMessageCountRef.current = nextCount;
    oldestMessageIdRef.current = oldestId;

    if (didPrependOlder) {
      return;
    }

    if (isPending) {
      return;
    }

    if (shouldStickToBottomRef.current) {
      scrollToBottom(prevCount === 0 ? 'auto' : 'smooth');
    }
  }, [messages, isPending, scrollToBottom]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    reportNearBottom(distanceFromBottom <= NEAR_BOTTOM_PX);

    const oldestMessageId = messages[0]?.messageId;
    if (
      el.scrollTop <= NEAR_TOP_PX &&
      hasNextPage &&
      !isFetchingNextPage &&
      scrollAnchorRef.current == null &&
      oldestMessageId != null
    ) {
      scrollAnchorRef.current = {
        height: el.scrollHeight,
        top: el.scrollTop,
        oldestMessageId,
      };
      onLoadOlder();
    }
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto bg-background-100 px-4 py-5 md:px-6',
        className
      )}
    >
      <div aria-live="polite" aria-atomic="true">
        {isFetchingNextPage ? (
          <p className="py-1 text-center text-sm-medium text-gray-300">
            이전 대화 불러오는 중…
          </p>
        ) : null}

        {isPending ? (
          <p className="m-auto text-center text-lg-medium text-gray-300">
            불러오는 중…
          </p>
        ) : null}

        {!isPending && isError ? (
          <p className="m-auto text-center text-lg-medium text-gray-300">
            메시지를 불러오지 못했어요
          </p>
        ) : null}

        {!isPending && !isError && isEmpty ? (
          <p className="m-auto text-center text-lg-medium text-gray-300">
            대화를 시작해 보세요
          </p>
        ) : null}
      </div>

      {!isPending &&
        !isError &&
        messages.map((message, index) => {
          const previous = messages[index - 1];
          const showDateSeparator =
            !previous ||
            !isSameLocalCalendarDay(previous.createdAt, message.createdAt);
          const dateLabel = showDateSeparator
            ? formatChatDateSeparator(message.createdAt)
            : '';

          return (
            <Fragment key={message.messageId}>
              {showDateSeparator && dateLabel ? (
                <p
                  role="separator"
                  aria-label={dateLabel}
                  className="py-1 text-center text-xs-medium text-gray-300"
                >
                  {dateLabel}
                </p>
              ) : null}
              <ChatMessageItem
                message={message}
                isMine={message.senderId === currentUserId}
              />
            </Fragment>
          );
        })}
    </div>
  );
};
