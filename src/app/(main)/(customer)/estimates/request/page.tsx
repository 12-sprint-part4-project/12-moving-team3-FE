import { EstimateRequestPageClient } from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '견적요청',
};

/**
 * 고객 견적요청 페이지.
 * URL: /estimates/request (GNB 고객 메뉴와 동일)
 */
const EstimateRequestPage = () => {
  return <EstimateRequestPageClient />;
};

export default EstimateRequestPage;
