import {
  QuotesTabsShell,
  type QuotesTabItem,
} from '@/components/quotes/QuotesTabsShell';

import { CUSTOMER_QUOTES_PAGE_X_PADDING } from './customerQuotesStyles';

export type CustomerQuotesTabId = 'pending' | 'received';

/** 대기 중 / 받았던 견적 탭 정의 */
const TABS: QuotesTabItem<CustomerQuotesTabId>[] = [
  { id: 'pending', label: '대기 중인 견적', href: '/quotes' },
  { id: 'received', label: '받았던 견적', href: '/quotes?tab=received' },
];

/** URL `tab` 쿼리 → 탭 id (`received`만 특수, 기본 pending) */
export const parseCustomerQuotesTabId = (
  value: string | null | undefined
): CustomerQuotesTabId => (value === 'received' ? 'received' : 'pending');

export interface CustomerQuotesTabsProps {
  activeTab: CustomerQuotesTabId;
}

/** `/quotes` 상단 탭바. - 대기 중 / 받았던 견적. */
export const CustomerQuotesTabs = ({ activeTab }: CustomerQuotesTabsProps) => (
  // 대기 중 / 받았던 견적 탭 셸
  <QuotesTabsShell
    tabs={TABS}
    activeTab={activeTab}
    className={CUSTOMER_QUOTES_PAGE_X_PADDING}
  />
);
