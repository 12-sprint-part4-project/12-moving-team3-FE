'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import MenuIcon from '@/assets/icons/menu.svg';
import { ChatAvatar } from '@/components/chat/ChatAvatar';
import { ChatRoomStatusChip } from '@/components/chat/ChatRoomStatusChip';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import { CHAT_ROOM_HEADER_CLASS } from './chatRoomStyles';

import type { ChatPartner, ChatRoomType } from '@/types/chat';
import type { QuoteStatus } from '@/types/quote';

export interface ChatRoomHeaderProps {
  partner: ChatPartner;
  roomType: ChatRoomType;
  quoteStatus: QuoteStatus | null;
  onLeaveClick: () => void;
  className?: string;
}

/** 채팅방 상단 — 뒤로가기 / 중앙 상대·상태 / 나가기 메뉴 */
export const ChatRoomHeader = ({
  partner,
  roomType,
  quoteStatus,
  onLeaveClick,
  className,
}: ChatRoomHeaderProps) => {
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
    <header className={cn(CHAT_ROOM_HEADER_CLASS, className)}>
      <Link
        href="/chat"
        aria-label={t('chat.backToListAria')}
        className="z-10 inline-flex size-6 shrink-0 items-center justify-center text-black-400"
      >
        <ChevronLeftIcon className="size-6" aria-hidden />
      </Link>

      <div className="pointer-events-none absolute inset-x-0 flex items-center justify-center gap-1.5 px-14">
        <ChatAvatar
          src={partner.profileImageUrl}
          alt=""
          className="size-9 shrink-0"
        />
        <p className="max-w-36 truncate text-2lg-semibold text-black-400 sm:max-w-48">
          {partner.displayName}
        </p>
        <ChatRoomStatusChip roomType={roomType} quoteStatus={quoteStatus} />
      </div>

      <div ref={menuRef} className="relative z-10 shrink-0">
        <button
          type="button"
          aria-label={t('chat.menuAria')}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex size-6 cursor-pointer items-center justify-center text-gray-300"
        >
          <MenuIcon className="size-6" aria-hidden />
        </button>

        {isMenuOpen ? (
          <div
            role="menu"
            className="absolute top-full right-0 z-50 mt-2 min-w-[8.75rem] rounded-2xl border border-line-200 bg-white py-1.5 shadow-[0.125rem_0.125rem_0.25rem] shadow-shadow-gray-200/20"
          >
            <button
              type="button"
              role="menuitem"
              className="flex w-full cursor-pointer px-4 py-3 text-left text-md-medium text-red-200"
              onClick={() => {
                setIsMenuOpen(false);
                onLeaveClick();
              }}
            >
              {t('chat.leave')}
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};
