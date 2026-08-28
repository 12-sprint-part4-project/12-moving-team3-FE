export type MoverQuotesTabId = 'sent' | 'rejected';

/** URL `tab` 쿼리 → 탭 id (`rejected`만 특수, 기본 sent) */
export const parseMoverQuotesTabId = (
  value: string | null | undefined
): MoverQuotesTabId => (value === 'rejected' ? 'rejected' : 'sent');
