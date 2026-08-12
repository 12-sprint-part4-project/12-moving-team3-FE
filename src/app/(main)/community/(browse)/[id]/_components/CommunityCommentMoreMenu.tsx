'use client';

import { useEffect, useRef, useState } from 'react';

import MoreVerticalIcon from '@/assets/icons/more-vertical.svg';
import ReportIcon from '@/assets/icons/report.svg';
import { ReportAction } from '@/components/reports';
import { useAuth } from '@/hooks/useAuth';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

import {
  COMMUNITY_POST_META_ACTION_BUTTON_CLASS,
  COMMUNITY_POST_META_ACTION_ICON_CLASS,
  COMMUNITY_POST_MORE_MENU_PANEL_CLASS,
} from './communityDetailStyles';

const MENU_ITEM_CLASS =
  'flex w-full cursor-pointer px-4 py-2 text-left text-md-medium text-black-400 min-[46.5rem]:py-3 min-[46.5rem]:text-lg-medium xl:text-2lg-medium';

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
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
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

  const handleReportClick = () => {
    setIsOpen(false);
    if (!user) {
      showToast({ content: '로그인이 필요한 기능입니다' });
      return;
    }
    setIsReportOpen(true);
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
            <button
              type="button"
              role="menuitem"
              onClick={handleReportClick}
              className={cn(MENU_ITEM_CLASS, 'inline-flex items-center gap-1 text-gray-400')}
            >
              <ReportIcon className="size-4" aria-hidden />
              신고
            </button>
          )}
        </div>
      ) : null}

      {/* controlled 모드: 드롭다운 언마운트와 무관하게 항상 마운트 유지 */}
      {!isOwn ? (
        <ReportAction
          target="COMMENT"
          targetId={String(commentId)}
          controlledOpen={isReportOpen}
          onControlledClose={() => setIsReportOpen(false)}
        />
      ) : null}
    </div>
  );
};
