import { COMMUNITY_PAGE_SHELL } from './_components/communityLayout';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '커뮤니티',
};

interface CommunityLayoutProps {
  children: React.ReactNode;
}

/** 커뮤니티 공통 shell */
const CommunityLayout = ({ children }: CommunityLayoutProps) => (
  <div className={COMMUNITY_PAGE_SHELL}>{children}</div>
);

export default CommunityLayout;
