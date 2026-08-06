import { cn } from '@/lib/utils';

import {
  COMMUNITY_DESKTOP_X,
  COMMUNITY_HEADER_X,
  COMMUNITY_PAGE_SHELL,
  COMMUNITY_PAGE_TITLE_CLASS,
  COMMUNITY_PAGE_TITLE_HEADER_CLASS,
} from './_components/communityLayout';

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
      <h1 className={COMMUNITY_PAGE_TITLE_CLASS}>커뮤니티</h1>
    </header>
    {children}
  </div>
);

export default CommunityLayout;
