import { cn } from '@/lib/utils';

import { COMMUNITY_POST_AUTHOR_BADGE_CLASS } from './communityDetailStyles';

interface CommunityPostAuthorBadgeProps {
  className?: string;
}

/** 게시글 작성자 댓글 표시 */
export const CommunityPostAuthorBadge = ({
  className = '',
}: CommunityPostAuthorBadgeProps) => (
  <span className={cn(COMMUNITY_POST_AUTHOR_BADGE_CLASS, className)}>작성자</span>
);
