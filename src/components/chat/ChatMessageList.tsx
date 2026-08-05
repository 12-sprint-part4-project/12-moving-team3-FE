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
  /** 초기 조회 실패(메시지 없음) */
  isError: boolean;
  /** 이전 이력(fetchNextPage) 실패 — 기존 메시지는 유지 */
  isFetchNextPageError?: boolean;
  isEmpty: boolean;
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  onLoadOlder: () => void;
  /** 최신 메시지 가시 영역(하단 근처) 여부 — 읽음 처리 등에 사용 */
  onNearBottomChange?: (isNearBottom: boolean) => void;
  /** 부모가 전송 직후 강제로 하단 이동을 요청할 때 증가하는 값 */
  scrollToBottomSignal?: number;
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
  isFetchNextPageError = false,
  isEmpty,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  onLoadOlder,
  onNearBottomChange,
  scrollToBottomSignal = 0,
  className,
}: ChatMessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  /** 이전 이력 prepend 전 스크롤 스냅샷 — 로드 중에는 덮어쓰지 않음 */
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
  /** 방 진입 후 첫 하단 정렬이 끝났는지 */
  const didInitialScrollRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);

  const isInitialError = isError && messages.length === 0;
  const canRenderMessages = !isPending && !isInitialError;

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

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    isProgrammaticScrollRef.current = true;
    el.scrollTop = el.scrollHeight;
    reportNearBottom(true);
    requestAnimationFrame(() => {
      isProgrammaticScrollRef.current = false;
    });
  }, [reportNearBottom]);

  // 이전 메시지 prepend 시에만 스크롤 복원 (앵커 스냅샷은 로드 중 유지)
  useLayoutEffect(() => {
    const el = scrollRef.current;
    const anchor = scrollAnchorRef.current;
    if (!el || anchor == null) {
      return;
    }

    const currentOldestId = messages[0]?.messageId ?? null;
    if (currentOldestId == null) {
      return;
    }

    if (currentOldestId === anchor.oldestMessageId) {
      return;
    }

    isProgrammaticScrollRef.current = true;
    el.scrollTop = anchor.top + (el.scrollHeight - anchor.height);
    scrollAnchorRef.current = null;
    requestAnimationFrame(() => {
      isProgrammaticScrollRef.current = false;
    });
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

  // 최초 로드: 페인트 직후 무조건 최하단
  useLayoutEffect(() => {
    if (isPending || didInitialScrollRef.current || messages.length === 0) {
      return;
    }

    scrollToBottom();
    didInitialScrollRef.current = true;
    prevMessageCountRef.current = messages.length;
    oldestMessageIdRef.current = messages[0]?.messageId ?? null;
  }, [isPending, messages, scrollToBottom]);

  // 이후 새 메시지 append 시 하단 고정
  useEffect(() => {
    if (!didInitialScrollRef.current || isPending) {
      return;
    }

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

    if (nextCount > prevCount && shouldStickToBottomRef.current) {
      scrollToBottom();
    }
  }, [messages, isPending, scrollToBottom]);

  // 전송 직후 강제 하단 이동
  useLayoutEffect(() => {
    if (scrollToBottomSignal === 0) {
      return;
    }

    shouldStickToBottomRef.current = true;
    scrollToBottom();
  }, [scrollToBottomSignal, scrollToBottom]);

  // 이미지 등으로 콘텐츠 높이가 늘어나도 하단 고정 중이면 따라감
  useEffect(() => {
    const scrollEl = scrollRef.current;
    const contentEl = contentRef.current;
    if (!scrollEl || !contentEl || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (!didInitialScrollRef.current || !shouldStickToBottomRef.current) {
        return;
      }
      if (scrollAnchorRef.current != null) {
        return;
      }
      isProgrammaticScrollRef.current = true;
      scrollEl.scrollTop = scrollEl.scrollHeight;
      requestAnimationFrame(() => {
        isProgrammaticScrollRef.current = false;
      });
    });

    observer.observe(contentEl);
    return () => observer.disconnect();
  }, []);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    const isNearBottom = distanceFromBottom <= NEAR_BOTTOM_PX;

    if (didInitialScrollRef.current && !isProgrammaticScrollRef.current) {
      reportNearBottom(isNearBottom);
    }

    const oldestMessageId = messages[0]?.messageId;
    if (
      el.scrollTop <= NEAR_TOP_PX &&
      hasNextPage &&
      !isFetching &&
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
        'min-h-0 flex-1 overflow-y-auto bg-background-100 px-4 py-5 md:px-6',
        className
      )}
    >
      <div ref={contentRef} className="flex flex-col gap-3.5">
        <div aria-live="polite" aria-atomic="true">
          {isFetchingNextPage ? (
            <p className="py-1 text-center text-sm-medium text-gray-300">
              이전 대화 불러오는 중…
            </p>
          ) : null}

          {!isFetchingNextPage && isFetchNextPageError ? (
            <div className="flex flex-col items-center gap-1 py-1">
              <p className="text-center text-sm-medium text-gray-300">
                이전 대화를 불러오지 못했어요
              </p>
              <button
                type="button"
                onClick={onLoadOlder}
                className="cursor-pointer text-sm-medium text-blue-300 underline-offset-2 hover:underline"
              >
                다시 시도
              </button>
            </div>
          ) : null}

          {isPending ? (
            <p className="py-16 text-center text-lg-medium text-gray-300">
              불러오는 중…
            </p>
          ) : null}

          {isInitialError ? (
            <p className="py-16 text-center text-lg-medium text-gray-300">
              메시지를 불러오지 못했어요
            </p>
          ) : null}

          {canRenderMessages && isEmpty ? (
            <p className="py-16 text-center text-lg-medium text-gray-300">
              대화를 시작해 보세요
            </p>
          ) : null}
        </div>

        {canRenderMessages &&
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
    </div>
  );
};
