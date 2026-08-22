'use client';

import {
  QuotesTabsShell,
  type QuotesTabItem,
} from '@/components/quotes/QuotesTabsShell';
import { useTranslation } from '@/i18n/useTranslation';

import { MOVER_QUOTES_PAGE_X_PADDING } from './moverQuotesStyles';

import type { MoverQuotesTabId } from '../_lib/parseMoverQuotesTabId';

export type { MoverQuotesTabId } from '../_lib/parseMoverQuotesTabId';

/** 보낸 견적 / 반려 요청 탭 정의 */
const TABS: QuotesTabItem<MoverQuotesTabId>[] = [
  { id: 'sent', label: '보낸 견적 조회', href: '/mover/quotes' },
  { id: 'rejected', label: '반려 요청', href: '/mover/quotes?tab=rejected' },
];

export interface MoverQuotesTabsProps {
  activeTab: MoverQuotesTabId;
}

/** `/mover/quotes` 상단 탭바. - 보낸 견적 / 반려 요청. */
export const MoverQuotesTabs = ({ activeTab }: MoverQuotesTabsProps) => {
  const { t } = useTranslation();

  return (
    <QuotesTabsShell
      tabs={TABS.map((tab) => ({
        ...tab,
        label: t(`quotes.tab.${tab.id}`),
      }))}
      activeTab={activeTab}
      className={MOVER_QUOTES_PAGE_X_PADDING}
      ariaLabel={t('quotes.tabsAria')}
    />
  );
};
