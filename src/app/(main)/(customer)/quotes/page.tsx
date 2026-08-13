import { Suspense } from 'react';

import { QuotesPageContentSkeleton } from '@/components/ui/Skeleton';
import { resolveTabSearchParam } from '@/lib/resolveTabSearchParam';

import {
  CUSTOMER_QUOTES_PAGE_SHELL_CLASS,
  CUSTOMER_QUOTES_PAGE_X_PADDING,
} from './_components/customerQuotesLayout';
import {
  CustomerQuotesTabs,
  parseCustomerQuotesTabId,
} from './_components/CustomerQuotesTabs';
import CustomerQuotesPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '내 견적 관리',
};

export interface CustomerQuotesPageProps {
  searchParams: Promise<{ tab?: string | string[] }>;
}

/** 고객 내 견적 관리 페이지 */
const CustomerQuotesPage = async ({
  searchParams,
}: CustomerQuotesPageProps) => {
  const params = await searchParams;
  const activeTab = parseCustomerQuotesTabId(resolveTabSearchParam(params.tab));

  return (
    <div className={CUSTOMER_QUOTES_PAGE_SHELL_CLASS}>
      <CustomerQuotesTabs activeTab={activeTab} />
      <Suspense
        fallback={
          <QuotesPageContentSkeleton
            className={CUSTOMER_QUOTES_PAGE_X_PADDING}
            withTabs={false}
            withSubHeader={activeTab === 'pending'}
          />
        }
      >
        <CustomerQuotesPageClient />
      </Suspense>
    </div>
  );
};

export default CustomerQuotesPage;
