'use client';

import { useEffect, useRef, useState } from 'react';

import MoreVerticalIcon from '@/assets/icons/more-vertical.svg';
import { ReportAction } from '@/components/reports';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { cn } from '@/lib/utils';

import {
  COMMUNITY_POST_META_ACTION_BUTTON_CLASS,
  COMMUNITY_POST_META_ACTION_ICON_CLASS,
  COMMUNITY_POST_MORE_MENU_PANEL_CLASS,
} from './communityDetailStyles';

const MENU_ITEM_CLASS =
  'flex w-full cursor-pointer px-4 py-3 text-left text-2lg-medium text-black-400';

interface CommunityCommentMoreMenuProps {
  isOwn: boolean;
  commentId: number;
  onDelete: () => void;
  className?: string;
}

/** 댓글 더보기 — 삭제(본인) · 신고(타인) */
export const CommunityCommentMoreMenu = ({
  isOwn,
  commentId,
  onDelete,
  className,
}: CommunityCommentMoreMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useOutsideClick(menuRef, isOpen, setIsOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
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
        ref={triggerRef}
        type="button"
        aria-label="댓글 메뉴"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((prev) => !prev)}
        className={COMMUNITY_POST_META_ACTION_BUTTON_CLASS}
      >
        <MoreVerticalIcon
          className={COMMUNITY_POST_META_ACTION_ICON_CLASS}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div role="menu" className={cn(COMMUNITY_POST_MORE_MENU_PANEL_CLASS, 'right-0')}>
          {isOwn ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => closeAndRun(onDelete)}
              className={cn(MENU_ITEM_CLASS, 'text-red-200')}
            >
              삭제
            </button>
          ) : (
            <div role="menuitem">
              <ReportAction
                target="COMMENT"
                targetId={String(commentId)}
                buttonVariant="default"
                className={MENU_ITEM_CLASS}
              />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
