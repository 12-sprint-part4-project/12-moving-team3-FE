'use client';

import Link from 'next/link';

import {
  buildCommunityPostDetailHref,
  type PostListContext,
} from '@/lib/communityListContext';
import { cn } from '@/lib/utils';
import type { PostNeighborSummary } from '@/types/community';

import { COMMUNITY_DETAIL_DIVIDER } from './communityDetailStyles';

interface CommunityPostNavigationProps {
  prev: PostNeighborSummary | null;
  next: PostNeighborSummary | null;
  listContext: PostListContext;
  className?: string;
}

const NAV_LABEL_CLASS =
  'text-md-medium text-gray-400 xl:text-lg-medium';

const NAV_TITLE_CLASS =
  'mt-1 w-full min-w-0 truncate text-md-semibold text-black-400 min-[46.5rem]:text-lg-semibold xl:text-2lg-semibold';

interface NavItemProps {
  direction: 'prev' | 'next';
  neighbor: PostNeighborSummary;
  listContext: PostListContext;
}

const NavItem = ({ direction, neighbor, listContext }: NavItemProps) => {
  const isPrev = direction === 'prev';
  const label = isPrev ? '이전글' : '다음글';

  return (
    <Link
      href={buildCommunityPostDetailHref(neighbor.id, listContext)}
      className="flex w-full min-w-0 flex-col items-start rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-background-200"
    >
      <span className={NAV_LABEL_CLASS}>{label}</span>
      <span className={NAV_TITLE_CLASS}>{neighbor.title}</span>
    </Link>
  );
};

/** 게시글 이전/다음글 네비게이션 */
export const CommunityPostNavigation = ({
  prev,
  next,
  listContext,
  className = '',
}: CommunityPostNavigationProps) => {
  if (!prev && !next) {
    return null;
  }

  const hasBoth = prev !== null && next !== null;

  return (
    <nav
      aria-label="게시글 이전·다음"
      className={cn('mt-8 min-[46.5rem]:mt-8 xl:mt-10', className)}
    >
      <div className={COMMUNITY_DETAIL_DIVIDER} />
      <div
        className={cn(
          'flex flex-col justify-start gap-1 pt-2 min-[46.5rem]:gap-5 min-[46.5rem]:pt-5',
          'xl:gap-6 xl:pt-7'
        )}
      >
        {prev ? (
          <div className="w-full min-w-0 px-1.5">
            <NavItem direction="prev" neighbor={prev} listContext={listContext} />
          </div>
        ) : null}
        {hasBoth ? (
          <div className={COMMUNITY_DETAIL_DIVIDER} aria-hidden />
        ) : null}
        {next ? (
          <div className="w-full min-w-0 px-1.5">
            <NavItem direction="next" neighbor={next} listContext={listContext} />
          </div>
        ) : null}
      </div>
    </nav>
  );
};
