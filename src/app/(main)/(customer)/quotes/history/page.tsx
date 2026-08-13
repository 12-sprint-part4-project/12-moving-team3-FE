import { Suspense } from 'react';

import { QuotesHistoryPageSkeleton } from '@/components/ui/Skeleton';

import { CustomerQuotesTitleHeader } from '../_components/CustomerQuotesTitleHeader';
import {
  CUSTOMER_QUOTES_PAGE_SHELL_CLASS,
  CUSTOMER_QUOTES_PAGE_X_PADDING,
} from '../_components/customerQuotesLayout';
import CustomerQuoteHistoryPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용 내역',
};

/** 고객 이용 내역 페이지 (확정한 견적) */
const CustomerQuoteHistoryPage = () => {
  return (
    <div className={CUSTOMER_QUOTES_PAGE_SHELL_CLASS}>
      <CustomerQuotesTitleHeader
        title="이용 내역"
        paddingClassName={CUSTOMER_QUOTES_PAGE_X_PADDING}
        className="shrink-0"
      />

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
