'use client';

import Link from 'next/link';

import { Button, getButtonClassName } from '@/components/Button/Button';
import { QuoteListCard } from '@/components/quotes/QuoteListCard';
import { getClosedQuoteOverlayMessage } from '@/components/quotes/closedQuoteOverlay';
import { useStartEstimateChat } from '@/hooks/useStartEstimateChat';
import { isEstimateRequestClosedForChat } from '@/lib/startEstimateChat';
import { cn } from '@/lib/utils';
import type { HistoryQuoteCardModel } from '@/types/customerQuote';

export interface HistoryQuoteCardProps {
  quote: HistoryQuoteCardModel;
  className?: string;
}

const CTA_CLASS =
  'h-12 w-full rounded-lg text-lg-semibold md:flex-1 lg:h-14 lg:rounded-2xl lg:text-xl-semibold';

/**
 * `/quotes/history` 이용 내역(확정 기사) 카드.
 * 열린 카드: 하단 CTA [상세보기][채팅하기]. 닫힌(EXPIRED/CANCELED/COMPLETED)은 오버레이만.
 */
export const HistoryQuoteCard = ({
  quote,
  className = '',
}: HistoryQuoteCardProps) => {
  const detailHref = `/quotes/${quote.quoteId}`;
  const isClosedCard = quote.isMoveCompleted;
  const { startEstimateChat, isChatPending } = useStartEstimateChat();
  const canStartChat =
    !isEstimateRequestClosedForChat(quote.estimateRequestStatus) &&
    (!quote.isDesignated || quote.designatedMoverId != null);

  /** 확정 기사와 1:1 방 열고 채팅 화면으로 이동 */
  const handleChatClick = () => {
    startEstimateChat({
      moverId: quote.moverId,
      isDesignated: quote.isDesignated,
      estimateRequestId: quote.estimateRequestId,
      designatedMoverId: quote.designatedMoverId,
      quoteId: quote.quoteId,
    });
  };

  return (
    <QuoteListCard
      className={className}
      displayName={quote.moverName}
      nameSuffix="기사님"
      moveType={quote.moveType}
      isConfirmed={quote.isConfirmed}
      isDesignated={quote.isDesignated}
      moveDate={quote.moveDate}
      departure={quote.departure}
      arrival={quote.arrival}
      priceLabel={quote.priceLabel}
      relativeTimeLabel={quote.relativeTimeLabel}
      detailHref={detailHref}
      detailAriaLabel={`${quote.moverName} 기사님 견적 상세보기`}
      isClosed={isClosedCard}
      overlayMessage={
        isClosedCard
          ? getClosedQuoteOverlayMessage(quote.estimateRequestStatus)
          : undefined
      }
      footerActions={
        isClosedCard ? undefined : (
          <>
            <Link
              href={detailHref}
              className={getButtonClassName({
                size: 'md',
                variant: 'outlined',
                className: cn(
                  CTA_CLASS,
                  'focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none'
                ),
              })}
              aria-label={`${quote.moverName} 기사님 견적 상세보기`}
            >
              상세보기
            </Link>
            {canStartChat ? (
              <Button
                size="md"
                variant="solid"
                className={CTA_CLASS}
                disabled={isChatPending}
                onClick={handleChatClick}
                aria-label={`${quote.moverName} 기사님과 채팅하기`}
              >
                {isChatPending ? '연결 중...' : '채팅하기'}
              </Button>
            ) : null}
          </>
        )
      }
    />
  );
};
