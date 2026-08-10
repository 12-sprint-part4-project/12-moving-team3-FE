import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
  COMMUNITY_DESKTOP_X,
  COMMUNITY_HEADER_X,
  COMMUNITY_PAGE_SHELL,
  COMMUNITY_PAGE_TITLE_CLASS,
  COMMUNITY_PAGE_TITLE_HEADER_CLASS,
} from './_components/communityLayout';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '커뮤니티',
};

interface CommunityLayoutProps {
  children: React.ReactNode;
}

/** 커뮤니티 공통 shell + 「커뮤니티」 page-title */
const CommunityLayout = ({ children }: CommunityLayoutProps) => (
  <div className={COMMUNITY_PAGE_SHELL}>
    <header
      className={cn(
        COMMUNITY_PAGE_TITLE_HEADER_CLASS,
        COMMUNITY_HEADER_X,
        COMMUNITY_DESKTOP_X
      )}
    >
      <h1 className={COMMUNITY_PAGE_TITLE_CLASS}>
        <Link href="/community">커뮤니티</Link>
      </h1>
    </header>
    {children}
  </div>
);

export default CommunityLayout;
