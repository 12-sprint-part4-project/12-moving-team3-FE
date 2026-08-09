import MoverMyPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '마이페이지',
};

/**
 * 기사님 마이페이지 (내 프로필).
 * Figma 내 프로필 Mobile(1:8552) · Tablet(1:8521) · Desktop(1:8536).
 * GET /api/users/movers/profile · GET /api/review/mover
 */
const MoverMyPage = () => {
  return <MoverMyPageClient />;
};

export default MoverMyPage;
