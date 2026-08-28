'use client';

import { useEffect, useRef, useState } from 'react';

import MoreVerticalIcon from '@/assets/icons/more-vertical.svg';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import {
  COMMUNITY_POST_META_ACTION_BUTTON_CLASS,
  COMMUNITY_POST_META_ACTION_ICON_CLASS,
  COMMUNITY_POST_MORE_MENU_PANEL_CLASS,
} from './communityDetailStyles';

const MENU_ITEM_CLASS =
  'flex w-full cursor-pointer px-4 py-2 text-left text-md-medium text-black-400 min-[46.5rem]:py-3 min-[46.5rem]:text-lg-medium xl:text-2lg-medium';

interface CommunityPostMoreMenuProps {
  isPostOwner: boolean;
  onCopyLink: () => void;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

/** 게시글 더보기 — 수정·삭제(본인) · 링크 복사(공통) */
export const CommunityPostMoreMenu = ({
  isPostOwner,
  onCopyLink,
  onEdit,
  onDelete,
  className = '',
}: CommunityPostMoreMenuProps) => {
  const { t } = useTranslation();
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
    <div
      ref={menuRef}
      className={cn(
        'relative flex shrink-0 items-center self-center',
        className
      )}
    >
      <button
        type="button"
        aria-label={t('community.postMenuAria')}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={COMMUNITY_POST_META_ACTION_BUTTON_CLASS}
      >
        <MoreVerticalIcon
          className={COMMUNITY_POST_META_ACTION_ICON_CLASS}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div className={COMMUNITY_POST_MORE_MENU_PANEL_CLASS}>
          {isPostOwner ? (
            <>
              <button
                type="button"
                onClick={() => closeAndRun(onEdit)}
                className={MENU_ITEM_CLASS}
              >
                {t('community.edit')}
              </button>
              <button
                type="button"
                onClick={() => closeAndRun(onDelete)}
                className={cn(MENU_ITEM_CLASS, 'text-red-200')}
              >
                {t('community.delete')}
              </button>
            </>
          ) : null}
          <button
            type="button"
            onClick={() => closeAndRun(onCopyLink)}
            className={MENU_ITEM_CLASS}
          >
            {t('share.copyLink')}
          </button>
        </div>
      ) : null}
    </div>
  );
};
