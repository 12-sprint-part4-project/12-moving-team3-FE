import { Suspense } from 'react';

import { QuotesPageContentSkeleton } from '@/components/quotes/QuotesPageSkeleton';

import CustomerQuotesPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '내 견적 관리',
};

const PAGE_X_PADDING = 'px-6 md:px-18 lg:px-10 xl:px-16 min-[90rem]:px-65';

/**
 * 고객 내 견적 관리 페이지 (대기 중인 견적)
 */
const CustomerQuotesPage = () => {
  return (
    <Suspense
      fallback={<QuotesPageContentSkeleton className={PAGE_X_PADDING} />}
    >
      <CustomerQuotesPageClient />
    </Suspense>
  );
};

export default CustomerQuotesPage;
