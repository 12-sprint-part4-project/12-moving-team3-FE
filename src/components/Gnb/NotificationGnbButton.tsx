'use client';

import { useRef, useState } from 'react';

import AlarmIcon from '@/assets/icons/alarm.svg';

import { ChatUnreadBadge } from '@/components/chat/ChatUnreadBadge';
import { GnbNotificationDropdown } from '@/components/Gnb/GnbNotificationDropdown';
import { useNotifications } from '@/hooks/useNotifications';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { cn } from '@/lib/utils';
import type { NotificationRole } from '@/types/notification';

export interface NotificationGnbButtonProps {
  /** 알림 목록 API role (customer | mover) */
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

/** GNB 알림 벨 + 미읽음 배지 + 드롭다운 (실 API) */
export const NotificationGnbButton = ({
  role,
  size = 'lg',
  onOpen,
  closeSignal = 0,
  onAlarmClick,
  className,
}: NotificationGnbButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prevCloseSignal, setPrevCloseSignal] = useState(closeSignal);
  const containerRef = useRef<HTMLDivElement>(null);
  // 드롭다운 닫혀 있어도 배지를 위해 마운트 시 목록 조회
  const { items, unreadCount, isLoading } = useNotifications(role);
  const iconSizeClass = size === 'lg' ? 'size-9' : 'size-6';

  useOutsideClick(containerRef, isOpen, setIsOpen);

  // props 변화에 맞춘 상태 조정 (effect setState 대신 render-time 패턴)
  if (closeSignal !== prevCloseSignal) {
    setPrevCloseSignal(closeSignal);
    if (closeSignal > 0) {
      setIsOpen(false);
    }
  }

  const handleToggle = () => {
    const next = !isOpen;
    if (next) {
      onOpen?.();
    }
    setIsOpen(next);
    onAlarmClick?.();
  };

  const handleClose = () => setIsOpen(false);

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
          'relative inline-flex shrink-0 cursor-pointer items-center justify-center text-gray-200',
          iconSizeClass
        )}
      >
        <AlarmIcon className={iconSizeClass} aria-hidden />
        <ChatUnreadBadge count={unreadCount} variant="icon" />
      </button>

      {isOpen ? (
        <div className="absolute top-full right-0 z-50 mt-2">
          <GnbNotificationDropdown
            items={items}
            isLoading={isLoading}
            onClose={handleClose}
          />
        </div>
      ) : null}
    </div>
  );
};
