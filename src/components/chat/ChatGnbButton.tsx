'use client';

import { useRef, useState } from 'react';

import ChatIcon from '@/assets/icons/chat.svg';

import { ChatPreviewDropdown } from '@/components/chat/ChatPreviewDropdown';
import { ChatUnreadBadge } from '@/components/chat/ChatUnreadBadge';
import { useChatUnreadCount } from '@/hooks/useChat';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { cn } from '@/lib/utils';

export interface ChatGnbButtonProps {
  /** 데스크톱 size-9 / 모바일 size-6 */
  size?: 'sm' | 'lg';
  /** 드롭다운이 열릴 때 (프로필 등과 상호 배타) */
  onOpen?: () => void;
  /** 값이 바뀌면 드롭다운을 닫는다 */
  closeSignal?: number;
  className?: string;
}

/** GNB 채팅 아이콘 + unread 뱃지 + 미리보기 드롭다운 */
export const ChatGnbButton = ({
  size = 'lg',
  onOpen,
  closeSignal = 0,
  className,
}: ChatGnbButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prevCloseSignal, setPrevCloseSignal] = useState(closeSignal);
  const containerRef = useRef<HTMLDivElement>(null);
  const { unreadCount } = useChatUnreadCount();
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
  };

  const handleClose = () => setIsOpen(false);

  const ariaLabel =
    unreadCount > 0
      ? `채팅, 읽지 않은 메시지 ${unreadCount}개`
      : '채팅';

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
        <ChatIcon className={iconSizeClass} aria-hidden />
        <ChatUnreadBadge count={unreadCount} variant="icon" />
      </button>

      {isOpen ? (
        // mobile: viewport 고정(top 48 / right 20). sm+: 채팅 아이콘 기준
        <div
          className={cn(
            'z-50',
            'fixed top-12 right-5',
            'sm:absolute sm:top-full sm:right-0 sm:mt-2'
          )}
        >
          <ChatPreviewDropdown onClose={handleClose} />
        </div>
      ) : null}
    </div>
  );
};
