import { Suspense } from 'react';

import { QuotesHistoryPageSkeleton } from '@/components/quotes/QuotesPageSkeleton';
import { cn } from '@/lib/utils';

import { CUSTOMER_QUOTES_PAGE_X_PADDING } from '../_components/CustomerQuotesTabs';
import CustomerQuoteHistoryPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용 내역',
};

/**
 * 고객 이용 내역 페이지 (확정한 견적)
 */
const CustomerQuoteHistoryPage = () => {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
      <div
        className={cn(
          'shrink-0 border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8',
          CUSTOMER_QUOTES_PAGE_X_PADDING
        )}
      >
        <h1 className="text-2lg-semibold text-black-400 lg:text-2xl-semibold">
          이용 내역
        </h1>
      </div>

      <Suspense
        fallback={
          <QuotesHistoryPageSkeleton
            pageXPadding={CUSTOMER_QUOTES_PAGE_X_PADDING}
          />
        }
      >
        <CustomerQuoteHistoryPageClient />
      </Suspense>
    </div>
  );
};

export default CustomerQuoteHistoryPage;
