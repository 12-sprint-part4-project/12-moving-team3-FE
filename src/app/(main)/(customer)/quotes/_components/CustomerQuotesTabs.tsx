'use client';

import {
  QuotesTabsShell,
  type QuotesTabItem,
} from '@/components/quotes/QuotesTabsShell';
import { useTranslation } from '@/i18n/useTranslation';

import { CUSTOMER_QUOTES_PAGE_X_PADDING } from './customerQuotesStyles';

import type { CustomerQuotesTabId } from '../_lib/parseCustomerQuotesTabId';

export type { CustomerQuotesTabId } from '../_lib/parseCustomerQuotesTabId';

/** 대기 중 / 받았던 견적 탭 정의 */
const TABS: QuotesTabItem<CustomerQuotesTabId>[] = [
  { id: 'pending', label: '대기 중인 견적', href: '/quotes' },
  { id: 'received', label: '받았던 견적', href: '/quotes?tab=received' },
];

export interface CustomerQuotesTabsProps {
  activeTab: CustomerQuotesTabId;
}

/** `/quotes` 상단 탭바. - 대기 중 / 받았던 견적. */
export const CustomerQuotesTabs = ({ activeTab }: CustomerQuotesTabsProps) => {
  const { t } = useTranslation();

  return (
    <QuotesTabsShell
      tabs={TABS.map((tab) => ({
        ...tab,
        label: t(`quotes.tab.${tab.id}`),
      }))}
      activeTab={activeTab}
      className={CUSTOMER_QUOTES_PAGE_X_PADDING}
      ariaLabel={t('quotes.tabsAria')}
    />
  );
};
