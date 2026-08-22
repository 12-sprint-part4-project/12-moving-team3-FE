import { createPageMetadata } from '@/i18n/createPageMetadata';

import { COMMUNITY_PAGE_SHELL } from './_components/communityLayout';

export const generateMetadata = createPageMetadata('nav.community');

interface CommunityLayoutProps {
  children: React.ReactNode;
}

/** 커뮤니티 공통 shell */
const CommunityLayout = ({ children }: CommunityLayoutProps) => (
  <div className={COMMUNITY_PAGE_SHELL}>{children}</div>
);

export default CommunityLayout;
