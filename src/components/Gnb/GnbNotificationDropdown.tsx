'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import ChevronDownIcon from '@/assets/icons/chevron-down.svg';
import CloseIcon from '@/assets/icons/close.svg';
import { GnbNotificationItem } from '@/components/Gnb/GnbNotificationItem';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { cn } from '@/lib/utils';

import type { NotificationItem } from '@/types/notification';

export interface GnbNotificationDropdownProps {
  items: NotificationItem[];
  isLoading?: boolean;
  onClose?: () => void;
  onItemClick?: (item: NotificationItem) => void;
  /** 아이템 hover 시 라우트 prefetch 등 */
  onItemPointerEnter?: (item: NotificationItem) => void;
  className?: string;
}

const EMPTY_MESSAGE = '새로운 알림이 없어요';
const LOADING_MESSAGE = '불러오는 중…';
/** scrollHeight 비교 오차 허용 (서브픽셀) */
const SCROLL_BOTTOM_THRESHOLD_PX = 2;
/** 스크롤 힌트 chevron이 위에서 아래로 한 번 떨어지는 주기(초) */
const SCROLL_HINT_BOUNCE_DURATION_S = 1.2;

/** GNB 알림 드롭다운 — 헤더·목록·empty/loading */
export const GnbNotificationDropdown = ({
  items,
  isLoading = false,
  onClose,
  onItemClick,
  onItemPointerEnter,
  className,
}: GnbNotificationDropdownProps) => {
  const shouldReduceMotion = useReducedMotion();
  const isEmpty = !isLoading && items.length === 0;
  const listRef = useRef<HTMLDivElement>(null);
  const listContentRef = useRef<HTMLDivElement>(null);
  // 목록이 max-height를 넘고 아직 맨 아래가 아닐 때만 하단 힌트 표시
  const [canScrollDown, setCanScrollDown] = useState(false);

  const updateScrollHint = useCallback(() => {
    const element = listRef.current;
    if (!element) {
      setCanScrollDown(false);
      return;
    }

    const hasOverflow = element.scrollHeight > element.clientHeight + 1;
    const remaining =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    setCanScrollDown(hasOverflow && remaining > SCROLL_BOTTOM_THRESHOLD_PX);
  }, []);

  useEffect(() => {
    updateScrollHint();

    const listElement = listRef.current;
    const contentElement = listContentRef.current;
    if (!listElement) {
      return;
    }

    // 패널 크기·아이템 높이 변화 모두 감지해 overflow 여부 갱신
    const resizeObserver = new ResizeObserver(updateScrollHint);
    resizeObserver.observe(listElement);
    if (contentElement) {
      resizeObserver.observe(contentElement);
    }
    listElement.addEventListener('scroll', updateScrollHint, { passive: true });

    return () => {
      resizeObserver.disconnect();
      listElement.removeEventListener('scroll', updateScrollHint);
    };
  }, [items, isLoading, updateScrollHint]);

  return (
    <div
      role="dialog"
      aria-label="알림"
      className={cn(
        'flex w-[19.5rem] max-w-[100vw] flex-col items-stretch rounded-3xl border border-line-200 bg-white px-4 py-2.5 shadow-[0.125rem_0.125rem_0.25rem] shadow-shadow-gray-200/20 md:w-[22.5rem]',
        className
      )}
    >
      <div className="flex w-full shrink-0 items-center justify-between py-3.5 pr-3 pl-4 md:pl-6">
        <p className="text-lg-bold text-black-300 md:text-2lg-bold md:text-black-400">
          알림
        </p>
        <button
          type="button"
          aria-label="알림 닫기"
          onClick={onClose}
          className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center text-black-400"
        >
          <CloseIcon className="size-6" aria-hidden />
        </button>
      </div>

      {/* 알림 많을 때 패널이 뷰포트를 넘지 않도록 목록만 스크롤 (헤더는 shrink-0) */}
      <div className="relative flex min-h-0 w-full flex-col">
        <div ref={listRef} className="max-h-[24rem] w-full overflow-y-auto">
          <div
            ref={listContentRef}
            className="flex w-full flex-col items-stretch"
          >
            {isLoading ? (
              <Spinner message={LOADING_MESSAGE} className="gap-3 py-8" />
            ) : null}

            {isEmpty ? (
              <p className="px-4 py-8 text-center text-md-medium text-gray-300 md:px-6">
                {EMPTY_MESSAGE}
              </p>
            ) : null}

            {!isLoading
              ? items.map((item) => (
                  <GnbNotificationItem
                    key={item.id}
                    item={item}
                    onClick={onItemClick}
                    onPointerEnter={onItemPointerEnter}
                  />
                ))
              : null}
          </div>
        </div>

        {/* 아래에 더 있음 — chevron이 위에서 아래로 떨어지는 힌트 (맨 아래면 숨김) */}
        {canScrollDown ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-white via-white/90 to-transparent pt-8 pb-1"
          >
            <motion.span
              className="inline-flex"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { y: [-6, 8], opacity: [0.25, 1, 0.25] }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: SCROLL_HINT_BOUNCE_DURATION_S,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
            >
              <ChevronDownIcon className="size-5 text-gray-300" />
            </motion.span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
