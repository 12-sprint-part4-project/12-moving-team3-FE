import {
  QuotesTabsShell,
  type QuotesTabItem,
} from '@/components/quotes/QuotesTabsShell';

import { MOVER_QUOTES_PAGE_X_PADDING } from './moverQuotesStyles';

export type MoverQuotesTabId = 'sent' | 'rejected';

/** 보낸 견적 / 반려 요청 탭 정의 */
const TABS: QuotesTabItem<MoverQuotesTabId>[] = [
  { id: 'sent', label: '보낸 견적 조회', href: '/mover/quotes' },
  { id: 'rejected', label: '반려 요청', href: '/mover/quotes?tab=rejected' },
];

/** URL `tab` 쿼리 → 탭 id (`rejected`만 특수, 기본 sent) */
export const parseMoverQuotesTabId = (
  value: string | null | undefined
): MoverQuotesTabId => (value === 'rejected' ? 'rejected' : 'sent');

export interface MoverQuotesTabsProps {
  activeTab: MoverQuotesTabId;
}

/** `/mover/quotes` 상단 탭바. - 보낸 견적 / 반려 요청. */
export const MoverQuotesTabs = ({ activeTab }: MoverQuotesTabsProps) => (
  <QuotesTabsShell
    tabs={TABS}
    activeTab={activeTab}
    className={MOVER_QUOTES_PAGE_X_PADDING}
  />
);
