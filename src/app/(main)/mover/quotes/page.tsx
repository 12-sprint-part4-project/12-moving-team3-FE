import MoverQuotesPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '내 견적 관리',
};

/**
 * 기사님 내 견적 관리 페이지
 */
const MoverQuotesPage = () => {
  return <MoverQuotesPageClient />;
};

export default MoverQuotesPage;
