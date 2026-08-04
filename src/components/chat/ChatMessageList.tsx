'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type UIEvent,
} from 'react';

import { ChatMessageItem } from '@/components/chat/ChatMessageItem';
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
  className,
}: ChatMessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number | null>(null);
  const shouldStickToBottomRef = useRef(true);
  const prevMessageCountRef = useRef(0);
  const oldestMessageIdRef = useRef<number | null>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  // 이전 페이지 로드 후 스크롤 위치 보정
  useLayoutEffect(() => {
    const el = scrollRef.current;
    const prevHeight = prevScrollHeightRef.current;
    if (!el || prevHeight == null) {
      return;
    }

    el.scrollTop = el.scrollHeight - prevHeight;
    prevScrollHeightRef.current = null;
  }, [messages]);

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
    shouldStickToBottomRef.current = distanceFromBottom <= NEAR_BOTTOM_PX;

    if (
      el.scrollTop <= NEAR_TOP_PX &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      prevScrollHeightRef.current = el.scrollHeight;
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

      {!isPending &&
        !isError &&
        messages.map((message) => (
          <ChatMessageItem
            key={message.messageId}
            message={message}
            isMine={message.senderId === currentUserId}
          />
        ))}
    </div>
  );
};
