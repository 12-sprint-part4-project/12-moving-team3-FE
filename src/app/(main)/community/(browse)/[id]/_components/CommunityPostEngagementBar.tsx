'use client';

import { type FormEvent, type KeyboardEvent, useState } from 'react';

import LikeActiveIcon from '@/assets/icons/like-active.svg';
import SendIcon from '@/assets/icons/send.svg';
import { cn } from '@/lib/utils';

import {
  COMMUNITY_DETAIL_COMMENT_INPUT,
  COMMUNITY_ENGAGEMENT_BUTTON_CLASS,
  COMMUNITY_ENGAGEMENT_FORM_GAP_CLASS,
  COMMUNITY_ENGAGEMENT_ICON_CLASS,
} from './communityDetailStyles';

export interface CommunityPostEngagementBarProps {
  isLiked: boolean;
  isLikePending: boolean;
  isLikeDisabled?: boolean;
  isCommentPending: boolean;
  onLikeClick: () => void;
  commentValue: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: (content: string) => void;
  onCommentFocus?: () => void;
  className?: string;
}

/** 좋아요 + 댓글 입력 — Mobile만 하단 fixed, Tablet/Desktop은 본문 흐름 (Figma 15167:41692) */
export const CommunityPostEngagementBar = ({
  isLiked,
  isLikePending,
  isLikeDisabled = false,
  isCommentPending,
  onLikeClick,
  commentValue,
  onCommentChange,
  onCommentSubmit,
  onCommentFocus,
  className = '',
}: CommunityPostEngagementBarProps) => {
  const [animTrigger, setAnimTrigger] = useState(0);

  const handleLikeClick = () => {
    if (!isLiked) setAnimTrigger((t) => t + 1);
    onLikeClick();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = commentValue.trim();

    if (trimmed.length === 0 || isCommentPending) {
      return;
    }

    onCommentSubmit(trimmed);
  };

  const handleCommentKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const likeLabel = isLiked ? '좋아요 취소' : '좋아요';
  const isCommentSubmitDisabled =
    commentValue.trim().length === 0 || isCommentPending;

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
          'mx-auto flex w-full max-w-page items-center',
          COMMUNITY_ENGAGEMENT_FORM_GAP_CLASS,
          'tablet:max-w-none'
        )}
      >
        <button
          type="button"
          onClick={handleLikeClick}
          aria-label={likeLabel}
          aria-pressed={isLiked}
          aria-busy={isLikePending}
          disabled={isLikePending || isLikeDisabled}
          className={cn(
            COMMUNITY_ENGAGEMENT_BUTTON_CLASS,
            'border border-line-200 bg-white transition-transform',
            !(isLikePending || isLikeDisabled) && 'active:scale-90',
            (isLikePending || isLikeDisabled) && 'cursor-not-allowed opacity-60'
          )}
        >
          <LikeActiveIcon
            key={animTrigger}
            className={cn(
              COMMUNITY_ENGAGEMENT_ICON_CLASS,
              'transition-colors duration-200',
              isLiked ? 'animate-like-pop text-blue-300' : 'text-gray-200'
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
          onChange={(event) => onCommentChange(event.target.value)}
          onFocus={onCommentFocus}
          onKeyDown={handleCommentKeyDown}
          placeholder="댓글을 입력해 주세요."
          disabled={isCommentPending}
          className={cn(
            COMMUNITY_DETAIL_COMMENT_INPUT,
            isCommentPending && 'opacity-60'
          )}
        />
        <button
          type="submit"
          aria-label="댓글 등록"
          disabled={isCommentSubmitDisabled}
          className={cn(
            COMMUNITY_ENGAGEMENT_BUTTON_CLASS,
            'border border-line-200 bg-white text-blue-300',
            isCommentSubmitDisabled && 'cursor-not-allowed opacity-60'
          )}
        >
          <SendIcon className={COMMUNITY_ENGAGEMENT_ICON_CLASS} aria-hidden />
        </button>
      </form>
    </div>
  );
};
