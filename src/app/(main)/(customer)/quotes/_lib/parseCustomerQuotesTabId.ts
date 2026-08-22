export type CustomerQuotesTabId = 'pending' | 'received';

/** URL `tab` 쿼리 → 탭 id (`received`만 특수, 기본 pending) */
export const parseCustomerQuotesTabId = (
  value: string | null | undefined
): CustomerQuotesTabId => (value === 'received' ? 'received' : 'pending');
