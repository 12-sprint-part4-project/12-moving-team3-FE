'use client';

import { useEffect, useRef, useState } from 'react';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { cn } from '@/lib/utils';

import {
  COMMUNITY_POST_META_ACTION_BUTTON_CLASS,
  COMMUNITY_POST_META_ACTION_ICON_CLASS,
} from './communityDetailStyles';

const MENU_ITEM_CLASS =
  'flex w-full cursor-pointer px-4 py-3 text-left text-md-medium text-black-400';

interface CommunityPostMoreMenuProps {
  isPostOwner: boolean;
  onCopyLink: () => void;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

/** 게시글 더보기 — 링크 복사(공통) · 수정·삭제(본인) */
export const CommunityPostMoreMenu = ({
  isPostOwner,
  onCopyLink,
  onEdit,
  onDelete,
  className = '',
}: CommunityPostMoreMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, isOpen, setIsOpen);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const closeAndRun = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  return (
    <div ref={menuRef} className={cn('relative flex shrink-0 items-center self-center', className)}>
      <button
        type="button"
        aria-label="게시글 메뉴"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={COMMUNITY_POST_META_ACTION_BUTTON_CLASS}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={COMMUNITY_POST_META_ACTION_ICON_CLASS}
          aria-hidden
        >
          <circle cx="12" cy="5" r="1.75" />
          <circle cx="12" cy="12" r="1.75" />
          <circle cx="12" cy="19" r="1.75" />
        </svg>
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute top-full right-0 z-50 mt-2 min-w-[8.75rem] overflow-hidden rounded-2xl border border-line-200 bg-white py-1.5 shadow-[0.125rem_0.125rem_0.25rem] shadow-shadow-gray-200/20"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => closeAndRun(onCopyLink)}
            className={MENU_ITEM_CLASS}
          >
            링크 복사
          </button>
          {isPostOwner ? (
            <>
              <button
                type="button"
                role="menuitem"
                onClick={() => closeAndRun(onEdit)}
                className={MENU_ITEM_CLASS}
              >
                수정
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => closeAndRun(onDelete)}
                className={cn(MENU_ITEM_CLASS, 'text-red-200')}
              >
                삭제
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
