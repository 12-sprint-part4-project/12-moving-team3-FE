import { resolveTabSearchParam } from '@/lib/resolveTabSearchParam';

import { CUSTOMER_QUOTES_PAGE_SHELL_CLASS } from './_components/customerQuotesLayout';
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

/** `/quotes` 서버 페이지. - 고객 내 견적 관리 페이지. */
const CustomerQuotesPage = async ({
  searchParams,
}: CustomerQuotesPageProps) => {
  const params = await searchParams;
  const activeTab = parseCustomerQuotesTabId(resolveTabSearchParam(params.tab));

  // 탭 바 + 활성 탭 패널
  return (
    <div className={CUSTOMER_QUOTES_PAGE_SHELL_CLASS}>
      {/* 대기 중 / 받았던 견적 탭 */}
      <CustomerQuotesTabs activeTab={activeTab} />
      {/* 활성 탭 패널 */}
      <CustomerQuotesPageClient activeTab={activeTab} />
    </div>
  );
};

export default CustomerQuotesPage;
