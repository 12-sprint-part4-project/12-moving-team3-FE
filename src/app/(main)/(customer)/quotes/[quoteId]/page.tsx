import { CustomerQuotesTitleHeader } from '../_components/CustomerQuotesTitleHeader';
import {
  CUSTOMER_QUOTE_DETAIL_PAGE_SHELL_CLASS,
  CUSTOMER_QUOTE_DETAIL_PAGE_X_PADDING,
} from '../_components/customerQuotesLayout';
import CustomerQuoteDetailPageClient from './page.client';

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
    <div className={CUSTOMER_QUOTE_DETAIL_PAGE_SHELL_CLASS}>
      <CustomerQuotesTitleHeader
        title="견적 상세"
        paddingClassName={CUSTOMER_QUOTE_DETAIL_PAGE_X_PADDING}
      />
      <CustomerQuoteDetailPageClient quoteId={quoteId} />
    </div>
  );
};

export default CustomerQuoteDetailPage;
