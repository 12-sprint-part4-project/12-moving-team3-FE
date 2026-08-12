'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import AlarmIcon from '@/assets/icons/alarm.svg';

import { ChatUnreadBadge } from '@/components/chat/ChatUnreadBadge';
import { GnbNotificationDropdown } from '@/components/Gnb/GnbNotificationDropdown';
import { useMarkNotificationAsRead } from '@/hooks/useMarkNotificationAsRead';
import { useNotifications } from '@/hooks/useNotifications';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { getNotificationHref } from '@/lib/getNotificationHref';
import { cn } from '@/lib/utils';
import type {
  NotificationItem,
  NotificationRole,
} from '@/types/notification';

export interface NotificationGnbButtonProps {
  /** 딥링크용 역할 (customer | mover) — 목록 API는 역할 분기 없음 */
  role: NotificationRole;
  /** 데스크톱 size-9 / 모바일 size-6 */
  size?: 'sm' | 'lg';
  /** 드롭다운이 열릴 때 (프로필·채팅과 상호 배타) */
  onOpen?: () => void;
  /** 값이 바뀌면 드롭다운을 닫는다 */
  closeSignal?: number;
  /** 토글 시 외부 훅 (Header는 미전달 OK) */
  onAlarmClick?: () => void;
  className?: string;
}

/** 드롭다운 열림/닫힘 모션 시간(초) */
const DROPDOWN_MOTION_DURATION_S = 0.18;

/** GNB 알림 벨 + 미읽음 배지 + 드롭다운 (실 API) */
export const NotificationGnbButton = ({
  role,
  size = 'lg',
  onOpen,
  closeSignal = 0,
  onAlarmClick,
  className,
}: NotificationGnbButtonProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [prevCloseSignal, setPrevCloseSignal] = useState(closeSignal);
  const containerRef = useRef<HTMLDivElement>(null);
  // 드롭다운 닫혀 있어도 배지를 위해 마운트 시 목록 조회
  const { items, unreadCount, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const iconSizeClass = size === 'lg' ? 'size-9' : 'size-6';

  useOutsideClick(containerRef, isOpen, setIsOpen);

  // props 변화에 맞춘 상태 조정 (effect setState 대신 render-time 패턴)
  if (closeSignal !== prevCloseSignal) {
    setPrevCloseSignal(closeSignal);
    if (closeSignal > 0) {
      setIsOpen(false);
    }
  }

  // 드롭다운이 열리면 이동 가능한 알림 경로를 라우트 셸만 미리 받는다
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    for (const item of items) {
      const href = getNotificationHref(item, role);
      if (href) {
        router.prefetch(href);
      }
    }
  }, [isOpen, items, role, router]);

  const handleToggle = () => {
    const next = !isOpen;
    if (next) {
      onOpen?.();
    }
    setIsOpen(next);
    onAlarmClick?.();
  };

  const handleClose = () => setIsOpen(false);

  // 읽음 처리 후 상세/목록 이동. 읽음 API 실패해도 이동은 진행
  const handleItemClick = async (item: NotificationItem) => {
    setIsOpen(false);

    if (!item.isRead) {
      try {
        await markAsRead.mutateAsync(item.id);
      } catch {
        // 읽음 실패는 무시 — 이동이 우선
      }
    }

    const href = getNotificationHref(item, role);
    if (href) {
      router.push(href);
    }
  };

  // hover 시에도 해당 경로만 한 번 더 prefetch (오픈 직후 목록 갱신 대비)
  const handleItemPointerEnter = (item: NotificationItem) => {
    const href = getNotificationHref(item, role);
    if (href) {
      router.prefetch(href);
    }
  };

  const ariaLabel =
    unreadCount > 0
      ? `알림, 읽지 않은 알림 ${unreadCount}개`
      : '알림';

  return (
    <div
      ref={containerRef}
      className={cn('relative flex items-center', className)}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={handleToggle}
        className={cn(
          'relative inline-flex shrink-0 cursor-pointer items-center justify-center',
          unreadCount > 0 ? 'text-yellow-100' : 'text-gray-200',
          iconSizeClass
        )}
      >
        <AlarmIcon className={iconSizeClass} aria-hidden />
        <ChatUnreadBadge count={unreadCount} variant="icon" />
      </button>

      {/* mobile: viewport 고정(top 48 / right 20). sm+: 벨 아이콘 기준 */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="gnb-notification-dropdown"
            // fadeInDown — 위에서 살짝 내려오며 나타남 (scale/origin 없음)
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: DROPDOWN_MOTION_DURATION_S, ease: 'easeOut' }}
            className={cn(
              'z-50',
              'fixed top-12 right-5',
              'sm:absolute sm:top-full sm:right-0 sm:mt-2'
            )}
          >
            <GnbNotificationDropdown
              items={items}
              isLoading={isLoading}
              onClose={handleClose}
              onItemClick={handleItemClick}
              onItemPointerEnter={handleItemPointerEnter}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
