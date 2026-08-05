import { ChatAvatar } from '@/components/chat/ChatAvatar';
import { formatRelativeTime } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import type { CommentItem, CommentWithReplies } from '@/types/community';

interface CommunityCommentItemProps {
  comment: CommentWithReplies;
  className?: string;
}

interface CommunityCommentRowProps {
  item: CommentItem;
  isReply?: boolean;
}

/** Figma — Mobile 28px / Tablet 40px / Desktop 52px 아바타 */
const CommunityCommentRow = ({
  item,
  isReply = false,
}: CommunityCommentRowProps) => {
  const relativeTime = formatRelativeTime(item.createdAt);

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
        <div className="flex flex-wrap items-baseline gap-x-1.5 min-[46.5rem]:gap-x-2">
          <span className="text-[0.6875rem] font-semibold text-[#1a1a1a] min-[46.5rem]:text-[0.8125rem] xl:text-[1rem] xl:font-semibold">
            {item.author.nickname}
          </span>
          <span className="text-[0.625rem] text-[#8c8c8c] min-[46.5rem]:text-xs-regular xl:text-sm-regular">
            {relativeTime}
          </span>
        </div>
        <p className="mt-0.5 text-[0.6875rem] whitespace-pre-wrap text-[#1a1a1a] min-[46.5rem]:mt-1 min-[46.5rem]:text-[0.8125rem] xl:text-[1rem]">
          {item.content}
        </p>
      </div>
    </div>
  );
};

/** 댓글 1건 + 대댓글 목록 */
export const CommunityCommentItem = ({
  comment,
  className = '',
}: CommunityCommentItemProps) => (
  <li className={cn('flex flex-col gap-4 min-[46.5rem]:gap-5', className)}>
    <CommunityCommentRow item={comment} />
    {comment.replies.length > 0 ? (
      <ul className="flex flex-col gap-4 min-[46.5rem]:gap-5">
        {comment.replies.map((reply) => (
          <li key={reply.id}>
            <CommunityCommentRow item={reply} isReply />
          </li>
        ))}
      </ul>
    ) : null}
  </li>
);
