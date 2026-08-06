import { Suspense } from 'react';

import { CommunityLayoutClient } from '../_components/CommunityLayoutClient';
import { CommunityTabBarFallback } from '../_components/CommunityTabBarFallback';

interface CommunityBrowseLayoutProps {
  children: React.ReactNode;
}

/** 목록·상세 — 탭바 포함 (작성 페이지는 이 layout 미적용) */
const CommunityBrowseLayout = ({ children }: CommunityBrowseLayoutProps) => (
  <Suspense fallback={<CommunityTabBarFallback />}>
    <CommunityLayoutClient>{children}</CommunityLayoutClient>
  </Suspense>
);

export default CommunityBrowseLayout;
