'use client';

import Link from 'next/link';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
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
  'mt-1 w-full min-w-0 truncate text-lg-semibold text-black-400 tablet:text-lg-semibold xl:text-2lg-semibold';

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
      className={cn(
        'flex w-full min-w-0 flex-col transition-opacity hover:opacity-80',
        isPrev ? 'items-start text-left' : 'items-end text-right',
        'min-[46.5rem]:items-start min-[46.5rem]:text-left'
      )}
    >
      <span className={cn(NAV_LABEL_CLASS, 'inline-flex items-center gap-0.5')}>
        {isPrev ? (
          <ChevronLeftIcon
            className="size-3.5 shrink-0 min-[46.5rem]:hidden"
            aria-hidden
          />
        ) : null}
        {label}
        {!isPrev ? (
          <ChevronRightIcon
            className="size-3.5 shrink-0 min-[46.5rem]:hidden"
            aria-hidden
          />
        ) : null}
      </span>
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
          'pt-6',
          'max-[46.4375rem]:grid max-[46.4375rem]:grid-cols-2 max-[46.4375rem]:gap-4',
          'min-[46.5rem]:flex min-[46.5rem]:flex-col min-[46.5rem]:justify-start min-[46.5rem]:gap-5 min-[46.5rem]:pt-6',
          'xl:gap-6 xl:pt-7'
        )}
      >
        {prev ? (
          <div className="min-w-0 w-full px-1.5">
            <NavItem direction="prev" neighbor={prev} listContext={listContext} />
          </div>
        ) : null}
        {hasBoth ? (
          <div
            className={cn(
              COMMUNITY_DETAIL_DIVIDER,
              'hidden min-[46.5rem]:block'
            )}
            aria-hidden
          />
        ) : null}
        {next ? (
          <div
            className={cn(
              'min-w-0 w-full px-1.5',
              !prev && 'max-[46.4375rem]:col-start-2'
            )}
          >
            <NavItem direction="next" neighbor={next} listContext={listContext} />
          </div>
        ) : null}
      </div>
    </nav>
  );
};
