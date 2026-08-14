import CustomerQuoteHistoryPageClient from './page.client';
import {
  CUSTOMER_QUOTES_PAGE_SHELL_CLASS,
  CUSTOMER_QUOTES_PAGE_X_PADDING,
} from '../_components/customerQuotesLayout';
import { CustomerQuotesTitleHeader } from '../_components/CustomerQuotesTitleHeader';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용 내역',
};

/** `/quotes/history` 서버 페이지. - 이용 내역(확정 견적). */
const CustomerQuoteHistoryPage = () => {
  // 타이틀 + 이용 내역 목록
  return (
    <div className={CUSTOMER_QUOTES_PAGE_SHELL_CLASS}>
      <CustomerQuotesTitleHeader
        title="이용 내역"
        paddingClassName={CUSTOMER_QUOTES_PAGE_X_PADDING}
        className="shrink-0"
      />
      {/* 확정 견적 카드 목록 (로딩 스켈레톤은 client isPending에서 처리) */}
      <CustomerQuoteHistoryPageClient />
    </div>
  );
};

export default CustomerQuoteHistoryPage;
