import {
  QuotesTabsShell,
  type QuotesTabItem,
} from '@/components/quotes/QuotesTabsShell';

export type CustomerQuotesTabId = 'pending' | 'received';

const TABS: QuotesTabItem<CustomerQuotesTabId>[] = [
  { id: 'pending', label: '대기 중인 견적', href: '/quotes' },
  { id: 'received', label: '받았던 견적', href: '/quotes?tab=received' },
];

export const CUSTOMER_QUOTES_PAGE_X_PADDING =
  'px-6 md:px-18 lg:px-10 xl:px-16 min-[90rem]:px-65';

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
    idPrefix="customer-quotes"
  />
);
