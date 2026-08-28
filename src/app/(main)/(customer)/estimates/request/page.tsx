import { createPageMetadata } from '@/i18n/createPageMetadata';

import { EstimateRequestPageClient } from './page.client';

export const generateMetadata = createPageMetadata('estimateRequest.title');

/**
 * 고객 견적요청 페이지.
 * URL: /estimates/request (GNB 고객 메뉴와 동일)
 */
const EstimateRequestPage = () => {
  return <EstimateRequestPageClient />;
};

export default EstimateRequestPage;
