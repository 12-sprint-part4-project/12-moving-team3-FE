'use client';

import { useState } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import { formatRelativeTime } from '@/lib/formatDate';
import { cn } from '@/lib/utils';

import { CommunityCommentMoreMenu } from './CommunityCommentMoreMenu';
import {
  COMMUNITY_COMMENT_REPLY_INDENT_CLASS,
  COMMUNITY_COMMENT_ROW_GAP_CLASS,
  COMMUNITY_DETAIL_COMMENT_INPUT,
  COMMUNITY_DETAIL_READING_TEXT_CLASS,
} from './communityDetailStyles';
import { CommunityPostAuthorBadge } from './CommunityPostAuthorBadge';

import type { CommentItem, CommentWithReplies } from '@/types/community';

interface CommunityCommentInteractionProps {
  postAuthorId?: string;
  currentUserId?: string;
  deletingCommentId?: number | null;
  onDeleteRequest?: (commentId: number) => void;
  onReplySubmit?: (commentId: number, content: string) => void;
  onLoginRequired?: () => void;
}

interface CommunityCommentItemProps extends CommunityCommentInteractionProps {
  comment: CommentWithReplies;
}

interface CommunityCommentRowProps extends CommunityCommentInteractionProps {
  item: CommentItem;
  isReply?: boolean;
  onReplyClick?: () => void;
}

const isOwnComment = (
  item: CommentItem,
  currentUserId: string | undefined
): boolean => {
  if (item.isMine === true) {
    return true;
  }

  if (item.isMine === false) {
    return false;
  }

  return currentUserId !== undefined && item.author.id === currentUserId;
};

/** Figma — Mobile 28px / Tablet 40px / Desktop 52px 아바타 */
const CommunityCommentRow = ({
  item,
  postAuthorId,
  currentUserId,
  deletingCommentId = null,
  onDeleteRequest,
  isReply = false,
  onReplyClick,
}: CommunityCommentRowProps) => {
  const { t } = useTranslation();
  const relativeTime = formatRelativeTime(item.createdAt);
  const isOwn = isOwnComment(item, currentUserId);
  const isDeleting = deletingCommentId === item.id;
  const isPostAuthor =
    postAuthorId !== undefined && item.author.id === postAuthorId;

  return (
    <div
      className={cn(
        'flex',
        COMMUNITY_COMMENT_ROW_GAP_CLASS,
        isReply && COMMUNITY_COMMENT_REPLY_INDENT_CLASS
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-x-1 min-[46.5rem]:gap-x-1.5">
            <span className="text-md-semibold text-black-400 min-[46.5rem]:text-lg-semibold xl:text-2lg-semibold">
              {item.author.nickname}
            </span>
            {isPostAuthor ? <CommunityPostAuthorBadge /> : null}
            <span className="text-md-regular text-gray-400 min-[46.5rem]:text-lg-regular xl:text-2lg-regular">
              {relativeTime}
            </span>
          </div>
          {!isDeleting && item.id > 0 ? (
            <CommunityCommentMoreMenu
              isOwn={isOwn}
              commentId={item.id}
              onDelete={() => onDeleteRequest?.(item.id)}
            />
          ) : null}
        </div>
        <p
          className={cn(
            'mt-0.5 whitespace-pre-wrap min-[46.5rem]:mt-1',
            COMMUNITY_DETAIL_READING_TEXT_CLASS
          )}
        >
          {item.content}
        </p>
        {!isReply && item.id > 0 && onReplyClick ? (
          <button
            type="button"
            onClick={onReplyClick}
            className="mt-1.5 cursor-pointer text-md-regular text-gray-400 hover:text-black-400 min-[46.5rem]:text-lg-regular xl:text-2lg-regular"
          >
            {t('community.reply')}
          </button>
        ) : null}
      </div>
    </div>
  );
};

/** 댓글 1건 + 대댓글 목록 */
export const CommunityCommentItem = ({
  comment,
  postAuthorId,
  currentUserId,
  deletingCommentId = null,
  onDeleteRequest,
  onReplySubmit,
  onLoginRequired,
}: CommunityCommentItemProps) => {
  const { t } = useTranslation();
  const [isReplying, setIsReplying] = useState(false);
  const [replyDraft, setReplyDraft] = useState('');

  const handleReplyClick = () => {
    if (!currentUserId) {
      onLoginRequired?.();
      return;
    }
    setIsReplying((prev) => !prev);
  };

  const handleReplySubmit = () => {
    const trimmed = replyDraft.trim();
    if (!trimmed) return;
    onReplySubmit?.(comment.id, trimmed);
    setReplyDraft('');
    setIsReplying(false);
  };

  return (
    <li className="flex flex-col gap-4 pl-2 min-[46.5rem]:gap-5">
      <CommunityCommentRow
        item={comment}
        postAuthorId={postAuthorId}
        currentUserId={currentUserId}
        deletingCommentId={deletingCommentId}
        onDeleteRequest={onDeleteRequest}
        onReplyClick={handleReplyClick}
      />

      {isReplying ? (
        <div className={cn('flex gap-2', COMMUNITY_COMMENT_REPLY_INDENT_CLASS)}>
          <input
            type="text"
            aria-label={t('community.replyInputAria')}
            className={COMMUNITY_DETAIL_COMMENT_INPUT}
            placeholder={t('community.replyPlaceholder')}
            value={replyDraft}
            onChange={(e) => setReplyDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleReplySubmit();
              }
            }}
            autoFocus
          />
          <button
            type="button"
            onClick={handleReplySubmit}
            disabled={!replyDraft.trim()}
            className={cn(
              'shrink-0 cursor-pointer rounded-lg px-4 text-md-semibold text-white min-[46.5rem]:text-lg-semibold xl:text-2lg-semibold',
              'bg-blue-300 hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50',
              'h-11 xl:h-[3.625rem]'
            )}
          >
            {t('community.create')}
          </button>
        </div>
      ) : null}

      {comment.replies.length > 0 ? (
        <ul className="flex flex-col gap-4 min-[46.5rem]:gap-5">
          {comment.replies.map((reply) => (
            <li key={reply.id}>
              <CommunityCommentRow
                item={reply}
                postAuthorId={postAuthorId}
                currentUserId={currentUserId}
                deletingCommentId={deletingCommentId}
                onDeleteRequest={onDeleteRequest}
                isReply
              />
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
};
