'use client';

import { useEffect, useRef, useState } from 'react';

import MoreVerticalIcon from '@/assets/icons/more-vertical.svg';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

export interface ChatMessageMenuProps {
  onReport: () => void;
  className?: string;
}

/**
 * 상대 메시지 ⋯ 메뉴 — 「신고」.
 * 넓은 뷰포트 + fine pointer: 부모 `group/msg` 호버·포커스 시 노출.
 * 좁은 뷰포트·터치: 연한 ⋯ 상시 노출.
 * ChatRoomHeader 나가기 메뉴와 동일하게 outside click · Escape · role="menu".
 */
export const ChatMessageMenu = ({
  onReport,
  className,
}: ChatMessageMenuProps) => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, isMenuOpen, setIsMenuOpen);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  return (
    <div ref={menuRef} className={cn('relative shrink-0', className)}>
      <button
        type="button"
        aria-label={t('chat.messageMenuAria')}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className={cn(
          'inline-flex size-4 cursor-pointer items-center justify-center text-gray-300 transition-opacity hover:text-gray-400',
          isMenuOpen
            ? 'opacity-100'
            : [
                'opacity-40',
                'md:[@media(hover:hover)_and_(pointer:fine)]:opacity-0',
                'md:[@media(hover:hover)_and_(pointer:fine)]:group-hover/msg:opacity-100',
                'md:[@media(hover:hover)_and_(pointer:fine)]:group-focus-within/msg:opacity-100',
              ]
        )}
      >
        <MoreVerticalIcon className="size-4 rotate-90" aria-hidden />
      </button>

      {isMenuOpen ? (
        <div
          role="menu"
          className="absolute top-full left-0 z-50 mt-1 min-w-32 rounded-2xl border border-line-200 bg-white py-1.5 shadow-chat-panel"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full cursor-pointer px-4 py-3 text-left text-md-medium text-red-200"
            onClick={() => {
              setIsMenuOpen(false);
              onReport();
            }}
          >
            {t('chat.report')}
          </button>
        </div>
      ) : null}
    </div>
  );
};
