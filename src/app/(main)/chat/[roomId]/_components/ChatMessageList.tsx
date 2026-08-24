'use client';

import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type UIEvent,
} from 'react';

import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useTranslation } from '@/i18n/useTranslation';
import {
  formatChatDateSeparator,
  isSameLocalCalendarDay,
  isSameLocalMinute,
} from '@/lib/formatDate';
import { cn } from '@/lib/utils';

import { ChatMessageItem } from './ChatMessageItem';

import type { ChatMessage } from '@/types/chat';

export interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  /**
   * 상대 읽음 커서. `undefined`면 방 상세 미로드 → 읽음 UI 숨김.
   * `null`이면 상대 읽음 기록 없음 → 내 메시지 전부 `1`.
   */
  partnerLastReadMessageId?: number | null;
  /** 상대가 채팅방을 나간 상태 (#275). 방 상세 미로드면 false로 취급 */
  isPartnerLeft?: boolean;
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
  /** 상대 메시지 신고 — page.client에서 로그인 가드·모달 오케스트레이션 */
  onReportMessage?: (messageId: number) => void;
  className?: string;
}

const NEAR_TOP_PX = 80;
const NEAR_BOTTOM_PX = 120;

/**
 * 같은 보낸이가 같은 분(분 단위)에 연속 메시지를 보내면
 * 시간은 묶음의 마지막 메시지에만 표시한다 (카톡식).
 */
const shouldShowMessageTime = (
  current: ChatMessage,
  next: ChatMessage | undefined
): boolean => {
  if (!next) {
    return true;
  }
  if (next.senderId !== current.senderId) {
    return true;
  }
  return !isSameLocalMinute(current.createdAt, next.createdAt);
};

/**
 * 내 메시지 읽음 UI.
 * - 상대가 내 마지막까지 읽음 → 마지막에만 `읽음`
 * - 아니면 messageId > 커서(또는 커서 null)인 내 메시지마다 `1`
 */
const getMineReadReceiptFlags = (
  message: ChatMessage,
  currentUserId: string,
  partnerLastReadMessageId: number | null | undefined,
  myLastMessageId: number | null
): { showUnreadCount: boolean; showReadLabel: boolean } => {
  if (
    message.senderId !== currentUserId ||
    partnerLastReadMessageId === undefined
  ) {
    return { showUnreadCount: false, showReadLabel: false };
  }

  const isFullyRead =
    myLastMessageId != null &&
    partnerLastReadMessageId != null &&
    partnerLastReadMessageId >= myLastMessageId;

  if (isFullyRead) {
    return {
      showUnreadCount: false,
      showReadLabel: message.messageId === myLastMessageId,
    };
  }

  const isUnread =
    partnerLastReadMessageId == null ||
    message.messageId > partnerLastReadMessageId;

  return { showUnreadCount: isUnread, showReadLabel: false };
};

/** 메시지 스크롤 영역 — 상단 도달 시 이전 이력 로드 */
export const ChatMessageList = ({
  messages,
  currentUserId,
  partnerLastReadMessageId,
  isPartnerLeft = false,
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
  onReportMessage,
  className,
}: ChatMessageListProps) => {
  const { t } = useTranslation();

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
  /** Composer 높이 변화로 스크롤 영역이 줄었는지 감지 */
  const lastClientHeightRef = useRef(0);
  /** 지연 retry 무효화 — 새 하단 이동 요청 또는 언마운트 시 증가 */
  const scrollRetryGenerationRef = useRef(0);
  const scrollRetryTimeoutIdsRef = useRef<number[]>([]);

  const isInitialError = isError && messages.length === 0;
  const canRenderMessages = !isPending && !isInitialError;

  const myLastMessageId = (() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index]?.senderId === currentUserId) {
        return messages[index].messageId;
      }
    }
    return null;
  })();

  const clearScrollRetries = useCallback(() => {
    for (const timeoutId of scrollRetryTimeoutIdsRef.current) {
      window.clearTimeout(timeoutId);
    }
    scrollRetryTimeoutIdsRef.current = [];
  }, []);

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
    (options?: { retry?: boolean }) => {
      const el = scrollRef.current;
      if (!el) {
        return;
      }

      clearScrollRetries();
      scrollRetryGenerationRef.current += 1;
      const generation = scrollRetryGenerationRef.current;

      const run = (options?: { force?: boolean }) => {
        if (scrollRetryGenerationRef.current !== generation) {
          return;
        }
        if (!options?.force && !shouldStickToBottomRef.current) {
          return;
        }

        const target = scrollRef.current;
        if (!target) {
          return;
        }
        isProgrammaticScrollRef.current = true;
        target.scrollTop = target.scrollHeight;
        reportNearBottom(true);
        requestAnimationFrame(() => {
          isProgrammaticScrollRef.current = false;
        });
      };

      // 호출 직후 1회는 강제 정렬 (전송·칩·최초 진입)
      run({ force: true });

      // 키보드 resize·레이아웃 안정화 후 재정렬 (모바일 인앱/iOS) (#279)
      if (options?.retry) {
        const retry = () => {
          if (scrollRetryGenerationRef.current !== generation) {
            return;
          }
          if (!shouldStickToBottomRef.current) {
            return;
          }
          run();
        };

        requestAnimationFrame(() => {
          retry();
          scrollRetryTimeoutIdsRef.current.push(
            window.setTimeout(retry, 100),
            window.setTimeout(retry, 280)
          );
        });
      }
    },
    [clearScrollRetries, reportNearBottom]
  );

  const scrollToBottomRef = useRef(scrollToBottom);

  useLayoutEffect(() => {
    scrollToBottomRef.current = scrollToBottom;
  }, [scrollToBottom]);

  useEffect(
    () => () => {
      clearScrollRetries();
      scrollRetryGenerationRef.current += 1;
    },
    [clearScrollRetries]
  );

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

    clearScrollRetries();
    scrollRetryGenerationRef.current += 1;
    isProgrammaticScrollRef.current = true;
    el.scrollTop = anchor.top + (el.scrollHeight - anchor.height);
    scrollAnchorRef.current = null;
    // prepend 복원 중 ResizeObserver가 최하단으로 끌어가지 않도록 하단 고정 해제
    reportNearBottom(false);
    requestAnimationFrame(() => {
      isProgrammaticScrollRef.current = false;
    });
  }, [messages, reportNearBottom, clearScrollRetries]);

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

    shouldStickToBottomRef.current = true;
    scrollToBottom();
    didInitialScrollRef.current = true;
    lastClientHeightRef.current = scrollRef.current?.clientHeight ?? 0;
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
      scrollToBottom({ retry: true });
    }
  }, [messages, isPending, scrollToBottom]);

  // 전송·칩 탭 등 부모가 요청한 강제 하단 이동 (signal 증가 시에만)
  useLayoutEffect(() => {
    if (scrollToBottomSignal === 0) {
      return;
    }

    shouldStickToBottomRef.current = true;
    scrollToBottomRef.current({ retry: true });
  }, [scrollToBottomSignal]);

  // 키보드로 visualViewport가 줄어도 하단 고정 중이면 따라감 (#279)
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) {
      return;
    }

    const handleViewportResize = () => {
      // CSS 변수·레이아웃 반영 후 정렬 (동일 프레임 선실행 방지)
      requestAnimationFrame(() => {
        if (!didInitialScrollRef.current || !shouldStickToBottomRef.current) {
          return;
        }
        if (scrollAnchorRef.current != null) {
          return;
        }
        scrollToBottomRef.current();
      });
    };

    vv.addEventListener('resize', handleViewportResize);
    return () => vv.removeEventListener('resize', handleViewportResize);
  }, []);

  // 메시지 콘텐츠·스크롤 영역(Composer 높이)이 바뀌어도 하단 고정 중이면 따라감
  useEffect(() => {
    const scrollEl = scrollRef.current;
    const contentEl = contentRef.current;
    if (!scrollEl || !contentEl || typeof ResizeObserver === 'undefined') {
      return;
    }

    const pinToBottomIfStuck = () => {
      lastClientHeightRef.current = scrollEl.clientHeight;
      if (!didInitialScrollRef.current || !shouldStickToBottomRef.current) {
        return;
      }
      if (scrollAnchorRef.current != null) {
        return;
      }
      isProgrammaticScrollRef.current = true;
      scrollEl.scrollTop = scrollEl.scrollHeight;
      reportNearBottom(true);
      requestAnimationFrame(() => {
        isProgrammaticScrollRef.current = false;
      });
    };

    const observer = new ResizeObserver(pinToBottomIfStuck);
    observer.observe(contentEl);
    observer.observe(scrollEl);
    return () => observer.disconnect();
  }, [reportNearBottom]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    const prevClientHeight = lastClientHeightRef.current;
    const nextClientHeight = el.clientHeight;
    lastClientHeightRef.current = nextClientHeight;

    // Composer가 커져 리스트 높이가 줄어들면 브라우저가 scroll을 띄울 수 있다.
    // 하단 고정 중이면 사용자가 위로 올린 것으로 오인하지 않고 최신에 붙인다.
    if (
      didInitialScrollRef.current &&
      prevClientHeight > 0 &&
      nextClientHeight < prevClientHeight &&
      shouldStickToBottomRef.current
    ) {
      isProgrammaticScrollRef.current = true;
      el.scrollTop = el.scrollHeight;
      reportNearBottom(true);
      requestAnimationFrame(() => {
        isProgrammaticScrollRef.current = false;
      });
      return;
    }

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isNearBottom = distanceFromBottom <= NEAR_BOTTOM_PX;

    if (didInitialScrollRef.current && !isProgrammaticScrollRef.current) {
      reportNearBottom(isNearBottom);
      // 수동으로 하단을 벗어나면 예약된 retry가 끌어내리지 않도록 무효화
      if (!isNearBottom) {
        clearScrollRetries();
        scrollRetryGenerationRef.current += 1;
      }
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
        'min-h-0 flex-1 overflow-y-auto overscroll-contain bg-background-200 px-4 py-5 md:px-6',
        className
      )}
    >
        <div ref={contentRef} className="flex flex-col gap-3.5">
          <div aria-live="polite" aria-atomic="true">
            {isFetchingNextPage ? (
              <p className="py-1 text-center text-sm-medium text-gray-300">
                {t('chat.loadingOlder')}
              </p>
            ) : null}

            {!isFetchingNextPage && isFetchNextPageError ? (
              <div className="flex flex-col items-center gap-1 py-1">
                <p className="text-center text-sm-medium text-gray-300">
                  {t('chat.olderError')}
                </p>
                <button
                  type="button"
                  onClick={onLoadOlder}
                  className="cursor-pointer text-sm-medium text-blue-300 underline-offset-2 hover:underline"
                >
                  {t('common.retry')}
                </button>
              </div>
            ) : null}

            {isPending ? (
              <Spinner message={t('chat.loading')} className="gap-3 py-16" />
            ) : null}

            {isInitialError ? (
              <p className="py-16 text-center text-lg-medium text-gray-300">
                {t('chat.messagesError')}
              </p>
            ) : null}

            {canRenderMessages && isEmpty ? (
              <p className="py-16 text-center text-lg-medium text-gray-300">
                {isPartnerLeft
                  ? t('chat.partnerLeft')
                  : t('chat.startConversation')}
              </p>
            ) : null}
          </div>

          {canRenderMessages &&
            messages.map((message, index) => {
              const previous = messages[index - 1];
              const next = messages[index + 1];
              const showDateSeparator =
                !previous ||
                !isSameLocalCalendarDay(previous.createdAt, message.createdAt);
              const dateLabel = showDateSeparator
                ? formatChatDateSeparator(message.createdAt)
                : '';
              const isMine = message.senderId === currentUserId;
              const showTime = shouldShowMessageTime(message, next);
              const { showUnreadCount, showReadLabel } =
                getMineReadReceiptFlags(
                  message,
                  currentUserId,
                  partnerLastReadMessageId,
                  myLastMessageId
                );

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
                    isMine={isMine}
                    showTime={showTime}
                    showUnreadCount={showUnreadCount}
                    showReadLabel={showReadLabel}
                    onReport={
                      isMine || !onReportMessage
                        ? undefined
                        : () => onReportMessage(message.messageId)
                    }
                    className={
                      showTime || showUnreadCount || showReadLabel
                        ? undefined
                        : '-mb-2'
                    }
                  />
                </Fragment>
              );
            })}

          {canRenderMessages && !isEmpty && isPartnerLeft ? (
            <p
              role="status"
              className="py-3 text-center text-xs-medium text-gray-300"
            >
              {t('chat.partnerLeft')}
            </p>
          ) : null}
        </div>
      </div>
    );
  };
