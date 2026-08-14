'use client';

import { useAuth } from '@/hooks/useAuth';
import { useStartEstimateChat } from '@/hooks/useStartEstimateChat';
import { toStartEstimateChatParams } from '@/lib/startEstimateChat';

import { HistoryQuotesPanel } from './_components/HistoryQuotesPanel';

import type { HistoryQuoteCardModel } from '@/types/customerQuote';

/** `/quotes/history` 클라이언트. - 이용 내역 본문 */
const CustomerQuoteHistoryPageClient = () => {
  const { user, isReady } = useAuth();
  const isCustomerReady = isReady && user?.userType === 'CUSTOMER';
  const { startEstimateChat, pendingChatTargetId } = useStartEstimateChat();

  /** 확정 기사와 1:1 채팅방 생성 후 이동 */
  const handleChatClick = (quote: HistoryQuoteCardModel) => {
    startEstimateChat(
      toStartEstimateChatParams(quote, quote.moverId),
      quote.quoteId
    );
  };

  // 이용 내역 패널
  return (
    <HistoryQuotesPanel
      enabled={isCustomerReady}
      pendingChatQuoteId={pendingChatTargetId}
      onChatClick={handleChatClick}
    />
  );
};

export default CustomerQuoteHistoryPageClient;
