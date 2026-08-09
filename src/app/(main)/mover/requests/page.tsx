import MoverRequestsPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '받은 요청',
};

/**
 * 기사님 받은 요청 페이지.
 */
const MoverRequestsPage = () => {
  return <MoverRequestsPageClient />;
};

export default MoverRequestsPage;
