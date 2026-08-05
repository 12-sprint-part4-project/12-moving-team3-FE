'use client';

import { useState, type FormEvent, type KeyboardEvent } from 'react';

import LikeActiveIcon from '@/assets/icons/like-active.svg';
import { cn } from '@/lib/utils';

import {
  COMMUNITY_DETAIL_COMMENT_INPUT,
  COMMUNITY_ENGAGEMENT_BUTTON_CLASS,
  COMMUNITY_ENGAGEMENT_ICON_CLASS,
} from './communityDetailStyles';

export interface CommunityPostEngagementBarProps {
  isLiked: boolean;
  isLikePending: boolean;
  isCommentPending: boolean;
  onLikeClick: () => void;
  onCommentSubmit: (content: string) => void;
  onCommentFocus?: () => void;
  className?: string;
}

/** 좋아요 + 댓글 입력 — Mobile만 하단 fixed, Tablet/Desktop은 본문 흐름 (Figma 15167:41692) */
export const CommunityPostEngagementBar = ({
  isLiked,
  isLikePending,
  isCommentPending,
  onLikeClick,
  onCommentSubmit,
  onCommentFocus,
  className = '',
}: CommunityPostEngagementBarProps) => {
  const [commentValue, setCommentValue] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = commentValue.trim();

    if (trimmed.length === 0 || isCommentPending) {
      return;
    }

    onCommentSubmit(trimmed);
    setCommentValue('');
  };

  const handleCommentKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const likeLabel = isLiked ? '좋아요 취소' : '좋아요';

  return (
    <div
      className={cn(
        'border-t border-shadow-gray-200 bg-white',
        'fixed inset-x-0 bottom-0 z-40 px-4 py-3',
        'min-[46.5rem]:static min-[46.5rem]:border-t-0 min-[46.5rem]:px-0 min-[46.5rem]:py-0',
        className
      )}
    >
      <form
        onSubmit={handleSubmit}
        className={cn(
          'mx-auto flex w-full max-w-page items-center gap-[0.6875rem]',
          'min-[46.5rem]:max-w-none min-[46.5rem]:gap-3 xl:gap-[1.0625rem]'
        )}
      >
        <button
          type="button"
          onClick={onLikeClick}
          aria-label={likeLabel}
          aria-pressed={isLiked}
          aria-busy={isLikePending}
          disabled={isLikePending}
          className={cn(
            COMMUNITY_ENGAGEMENT_BUTTON_CLASS,
            'border border-line-200 bg-white',
            isLikePending && 'opacity-60',
            isLiked && 'border-blue-300'
          )}
        >
          <LikeActiveIcon
            className={cn(
              COMMUNITY_ENGAGEMENT_ICON_CLASS,
              isLiked ? 'text-blue-400' : 'text-gray-200'
            )}
            aria-hidden
          />
        </button>

        <label className="sr-only" htmlFor="community-comment-input">
          댓글 입력
        </label>
        <input
          id="community-comment-input"
          type="text"
          value={commentValue}
          onChange={(event) => setCommentValue(event.target.value)}
          onFocus={onCommentFocus}
          onKeyDown={handleCommentKeyDown}
          placeholder="댓글을 입력해 주세요."
          disabled={isCommentPending}
          className={cn(
            COMMUNITY_DETAIL_COMMENT_INPUT,
            isCommentPending && 'opacity-60'
          )}
        />
      </form>
    </div>
  );
};
