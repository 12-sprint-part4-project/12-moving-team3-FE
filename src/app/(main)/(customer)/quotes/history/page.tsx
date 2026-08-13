import { Suspense } from 'react';

import { QuotesHistoryPageSkeleton } from '@/components/quotes/QuotesPageSkeleton';
import { cn } from '@/lib/utils';

import CustomerQuoteHistoryPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용 내역',
};

const HISTORY_PAGE_X_PADDING =
  'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

/**
 * 고객 이용 내역 페이지 (확정한 견적)
 */
const CustomerQuoteHistoryPage = () => {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
      <div
        className={cn(
          'shrink-0 border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8',
          HISTORY_PAGE_X_PADDING
        )}
      >
        <h1 className="text-2lg-semibold text-black-400 lg:text-2xl-semibold">
          이용 내역
        </h1>
      </div>

      <Suspense
        fallback={
          <QuotesHistoryPageSkeleton pageXPadding={HISTORY_PAGE_X_PADDING} />
        }
      >
        <CustomerQuoteHistoryPageClient />
      </Suspense>
    </div>
  );
};

export default CustomerQuoteHistoryPage;
