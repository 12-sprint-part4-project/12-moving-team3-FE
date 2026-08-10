import Link from 'next/link';

import { cn } from '@/lib/utils';

export interface QuotesTabItem<T extends string = string> {
  id: T;
  label: string;
  href: string;
}

export interface QuotesTabsShellProps<T extends string> {
  tabs: QuotesTabItem<T>[];
  activeTab: T;
  className?: string;
  idPrefix: string;
  ariaLabel?: string;
}

/** searchParams.tab 단일 문자열로 정규화 */
export const resolveQuotesTabParam = (
  tab: string | string[] | undefined
): string | null => {
  if (Array.isArray(tab)) {
    return tab[0] ?? null;
  }
  return tab ?? null;
};

/**
 * 내 견적 관리 공통 탭 셸
 */
export const QuotesTabsShell = <T extends string>({
  tabs,
  activeTab,
  className = '',
  idPrefix,
  ariaLabel = '내 견적 관리 탭',
}: QuotesTabsShellProps<T>) => (
  <div
    className={cn(
      'shrink-0 border-b border-line-100 bg-white pt-4 shadow-page-title',
      className
    )}
  >
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex items-start gap-6 lg:gap-8"
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            scroll={false}
            role="tab"
            aria-selected={active}
            id={`${idPrefix}-tab-${tab.id}`}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            className={cn(
              'flex cursor-pointer items-center justify-center self-stretch py-4 text-xl-semibold whitespace-nowrap',
              active
                ? 'border-b-2 border-black-400 text-black-400'
                : 'text-gray-400'
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  </div>
);
