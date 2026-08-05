'use client';

import { ChatAvatar } from '@/components/chat/ChatAvatar';
import { formatRelativeTime } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import type { CommentItem, CommentWithReplies } from '@/types/community';

import { CommunityPostAuthorBadge } from './CommunityPostAuthorBadge';

interface CommunityCommentInteractionProps {
  postAuthorId?: string;
  currentUserId?: string;
  deletingCommentId?: number | null;
  onDeleteRequest?: (commentId: number) => void;
}

interface CommunityCommentItemProps extends CommunityCommentInteractionProps {
  comment: CommentWithReplies;
  className?: string;
}

interface CommunityCommentRowProps extends CommunityCommentInteractionProps {
  item: CommentItem;
  isReply?: boolean;
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

  return (
    currentUserId !== undefined && item.author.id === currentUserId
  );
};

/** Figma — Mobile 28px / Tablet 40px / Desktop 52px 아바타 */
const CommunityCommentRow = ({
  item,
  postAuthorId,
  currentUserId,
  deletingCommentId = null,
  onDeleteRequest,
  isReply = false,
}: CommunityCommentRowProps) => {
  const relativeTime = formatRelativeTime(item.createdAt);
  const canDelete = onDeleteRequest !== undefined && isOwnComment(item, currentUserId);
  const isDeleting = deletingCommentId === item.id;
  const isPostAuthor =
    postAuthorId !== undefined && item.author.id === postAuthorId;

  return (
    <div
      className={cn(
        'flex gap-2 min-[46.5rem]:gap-3',
        isReply && 'pl-9 min-[46.5rem]:pl-12 xl:pl-[3.75rem]'
      )}
    >
      <ChatAvatar
        src={item.author.profileImageUrl}
        alt={`${item.author.nickname} 프로필`}
        className="size-7 shrink-0 min-[46.5rem]:size-10 xl:size-[3.25rem]"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-x-1 min-[46.5rem]:gap-x-1.5">
            <span className="text-xs-semibold text-black-400 min-[46.5rem]:text-sm-semibold xl:text-lg-semibold">
              {item.author.nickname}
            </span>
            {isPostAuthor ? <CommunityPostAuthorBadge /> : null}
            <span className="text-xs-regular text-gray-400 xl:text-sm-regular">
              {relativeTime}
            </span>
          </div>
          {canDelete ? (
            <button
              type="button"
              aria-label="댓글 삭제"
              disabled={isDeleting}
              onClick={() => onDeleteRequest(item.id)}
              className={cn(
                'shrink-0 cursor-pointer text-xs-regular text-gray-400 xl:text-sm-regular',
                'hover:text-black-400 disabled:cursor-not-allowed disabled:opacity-60'
              )}
            >
              삭제
            </button>
          ) : null}
        </div>
        <p className="mt-0.5 text-xs-regular whitespace-pre-wrap text-black-400 min-[46.5rem]:mt-1 min-[46.5rem]:text-sm-medium xl:text-lg-regular">
          {item.content}
        </p>
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
  className = '',
}: CommunityCommentItemProps) => (
  <li className={cn('flex flex-col gap-4 min-[46.5rem]:gap-5', className)}>
    <CommunityCommentRow
      item={comment}
      postAuthorId={postAuthorId}
      currentUserId={currentUserId}
      deletingCommentId={deletingCommentId}
      onDeleteRequest={onDeleteRequest}
    />
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
