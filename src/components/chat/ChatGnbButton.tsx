'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';

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

/** 드롭다운 열림/닫힘 모션 시간(초) — 알림 GNB와 동일 */
const DROPDOWN_MOTION_DURATION_S = 0.18;

/** GNB 채팅 아이콘 + unread 뱃지 + 미리보기 드롭다운 */
export const ChatGnbButton = ({
  size = 'lg',
  onOpen,
  closeSignal = 0,
  className,
}: ChatGnbButtonProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [prevCloseSignal, setPrevCloseSignal] = useState(closeSignal);
  const containerRef = useRef<HTMLDivElement>(null);
  const { unreadCount } = useChatUnreadCount();
  const iconSizeClass = size === 'lg' ? 'size-9' : 'size-6';
  // prefers-reduced-motion이면 위치 이동 없이 opacity만
  const dropdownOffsetY = shouldReduceMotion ? 0 : -12;

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
      ? t('gnb.chat.unread', { count: unreadCount })
      : t('gnb.chat.label');

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

      {/* mobile: viewport 고정(top 48 / right 20). sm+: 채팅 아이콘 기준 */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="gnb-chat-dropdown"
            // fadeInDown — reduced motion이면 opacity만 (y=0)
            initial={{ opacity: 0, y: dropdownOffsetY }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dropdownOffsetY }}
            transition={{
              duration: DROPDOWN_MOTION_DURATION_S,
              ease: 'easeOut',
            }}
            className={cn(
              'z-50',
              'fixed top-12 right-5',
              'sm:absolute sm:top-full sm:right-0 sm:mt-2'
            )}
          >
            <ChatPreviewDropdown onClose={handleClose} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
