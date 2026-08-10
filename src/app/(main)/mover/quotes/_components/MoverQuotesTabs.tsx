import {
  QuotesTabsShell,
  type QuotesTabItem,
} from '@/components/quotes/QuotesTabsShell';

export type MoverQuotesTabId = 'sent' | 'rejected';

const TABS: QuotesTabItem<MoverQuotesTabId>[] = [
  { id: 'sent', label: '보낸 견적 조회', href: '/mover/quotes' },
  { id: 'rejected', label: '반려 요청', href: '/mover/quotes?tab=rejected' },
];

export const MOVER_QUOTES_PAGE_X_PADDING =
  'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

/** URL tab 쿼리 → 탭 id */
export const parseMoverQuotesTabId = (
  value: string | null | undefined
): MoverQuotesTabId => (value === 'rejected' ? 'rejected' : 'sent');

export interface MoverQuotesTabsProps {
  activeTab: MoverQuotesTabId;
}

/** 기사 내 견적 관리 탭 */
export const MoverQuotesTabs = ({ activeTab }: MoverQuotesTabsProps) => (
  <QuotesTabsShell
    tabs={TABS}
    activeTab={activeTab}
    className={MOVER_QUOTES_PAGE_X_PADDING}
  />
);
