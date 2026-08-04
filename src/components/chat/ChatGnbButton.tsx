'use client';

import { useEffect, useRef, useState } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { unreadCount } = useChatUnreadCount();
  const iconSizeClass = size === 'lg' ? 'size-9' : 'size-6';

  useOutsideClick(containerRef, isOpen, setIsOpen);

  useEffect(() => {
    if (closeSignal > 0) {
      setIsOpen(false);
    }
  }, [closeSignal]);

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        onOpen?.();
      }
      return next;
    });
  };

  const handleClose = () => setIsOpen(false);

  return (
    <div
      ref={containerRef}
      className={cn('relative flex items-center', className)}
    >
      <button
        type="button"
        aria-label="채팅"
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
        <div className="absolute top-full right-0 z-50 mt-2">
          <ChatPreviewDropdown onClose={handleClose} />
        </div>
      ) : null}
    </div>
  );
};
