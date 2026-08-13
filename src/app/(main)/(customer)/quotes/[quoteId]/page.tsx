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

/** 고객 견적 상세 페이지 */
const CustomerQuoteDetailPage = async ({
  params,
}: CustomerQuoteDetailPageProps) => {
  const { quoteId } = await params;

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
