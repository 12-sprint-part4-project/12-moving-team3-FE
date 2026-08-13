import {
  QuotesTabsShell,
  type QuotesTabItem,
} from '@/components/quotes/QuotesTabsShell';

import { CUSTOMER_QUOTES_PAGE_X_PADDING } from './customerQuotesLayout';

export type CustomerQuotesTabId = 'pending' | 'received';

const TABS: QuotesTabItem<CustomerQuotesTabId>[] = [
  { id: 'pending', label: '대기 중인 견적', href: '/quotes' },
  { id: 'received', label: '받았던 견적', href: '/quotes?tab=received' },
];

/** URL tab 쿼리 → 탭 id */
export const parseCustomerQuotesTabId = (
  value: string | null | undefined
): CustomerQuotesTabId => (value === 'received' ? 'received' : 'pending');

export interface CustomerQuotesTabsProps {
  activeTab: CustomerQuotesTabId;
}

/** 고객 내 견적 관리 탭 */
export const CustomerQuotesTabs = ({ activeTab }: CustomerQuotesTabsProps) => (
  <QuotesTabsShell
    tabs={TABS}
    activeTab={activeTab}
    className={CUSTOMER_QUOTES_PAGE_X_PADDING}
  />
);
