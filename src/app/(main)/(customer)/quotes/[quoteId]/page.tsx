import CustomerQuoteDetailPageClient from './page.client';
import { CUSTOMER_QUOTES_PAGE_X_PADDING } from '../_components/customerQuotesStyles';
import { CustomerQuotesTitleHeader } from '../_components/CustomerQuotesTitleHeader';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '견적 상세',
};

export interface CustomerQuoteDetailPageProps {
  params: Promise<{ quoteId: string }>;
}

/** `/quotes/[quoteId]` 서버 페이지. - 견적 상세. */
const CustomerQuoteDetailPage = async ({
  params,
}: CustomerQuoteDetailPageProps) => {
  const { quoteId } = await params;

  // 타이틀 + 상세 본문
  return (
    <div className="flex min-h-full w-full flex-col overflow-x-hidden bg-white">
      <CustomerQuotesTitleHeader
        title="견적 상세"
        paddingClassName={CUSTOMER_QUOTES_PAGE_X_PADDING}
      />
      <CustomerQuoteDetailPageClient quoteId={quoteId} />
    </div>
  );
};

export default CustomerQuoteDetailPage;
