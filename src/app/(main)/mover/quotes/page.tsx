import { Suspense } from 'react';

import { QuotesPageContentSkeleton } from '@/components/quotes/QuotesPageSkeleton';

import MoverQuotesPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '내 견적 관리',
};

const PAGE_X_PADDING =
  'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

/**
 * 기사님 내 견적 관리 페이지
 */
const MoverQuotesPage = () => {
  return (
    <Suspense
      fallback={<QuotesPageContentSkeleton className={PAGE_X_PADDING} />}
    >
      <MoverQuotesPageClient />
    </Suspense>
  );
};

export default MoverQuotesPage;
