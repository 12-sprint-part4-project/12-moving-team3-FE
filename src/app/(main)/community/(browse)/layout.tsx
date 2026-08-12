import { CommunityLayoutClient } from '../_components/CommunityLayoutClient';

interface CommunityBrowseLayoutProps {
  children: React.ReactNode;
}

/** 목록·상세 — 탭바 포함 (작성 페이지는 이 layout 미적용) */
const CommunityBrowseLayout = ({ children }: CommunityBrowseLayoutProps) => (
  <CommunityLayoutClient>{children}</CommunityLayoutClient>
);

export default CommunityBrowseLayout;
