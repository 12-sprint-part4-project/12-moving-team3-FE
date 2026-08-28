import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import { COMMUNITY_POST_AUTHOR_BADGE_CLASS } from './communityDetailStyles';

interface CommunityPostAuthorBadgeProps {
  className?: string;
}

/** 게시글 작성자 댓글 표시 */
export const CommunityPostAuthorBadge = ({
  className = '',
}: CommunityPostAuthorBadgeProps) => {
  const { t } = useTranslation();

  return (
    <span className={cn(COMMUNITY_POST_AUTHOR_BADGE_CLASS, className)}>
      {t('community.author')}
    </span>
  );
};
