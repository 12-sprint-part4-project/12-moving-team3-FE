import type {
  CustomerPastQuoteFilter,
  ReceivedQuoteCardModel,
} from '@/types/customerQuote';

/** `/quotes?tab=received` 그룹 내 상태 필터. - CONFIRMED면 확정만, ALL이면 전체. */
export const filterReceivedQuotesByStatus = (
  quotes: ReceivedQuoteCardModel[],
  filter: CustomerPastQuoteFilter
): ReceivedQuoteCardModel[] =>
  filter === 'CONFIRMED' ? quotes.filter((quote) => quote.isConfirmed) : quotes;
