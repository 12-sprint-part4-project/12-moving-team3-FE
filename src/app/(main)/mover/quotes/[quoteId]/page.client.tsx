'use client';

import Link from 'next/link';

import { Button } from '@/components/Button/Button';
import { QuoteDetailContentSkeleton } from '@/components/quotes/QuoteDetailPageSkeleton';
import { QuoteShareButtons } from '@/components/QuoteShareButtons/QuoteShareButtons';
import { useAuth } from '@/hooks/useAuth';
import { useMoverQuoteDetail } from '@/hooks/useMoverQuoteDetail';
import { useStartEstimateChat } from '@/hooks/useStartEstimateChat';
import { ApiError } from '@/lib/apiClient';
import { cn } from '@/lib/utils';

import { MoverQuoteDetailActions } from './_components/MoverQuoteDetailActions';
import { QuoteDetailInfoSection } from './_components/QuoteDetailInfoSection';
import { QuoteDetailSummaryCard } from './_components/QuoteDetailSummaryCard';

export interface MoverQuoteDetailPageClientProps {
  quoteId: string;
}

/** 견적 ID 숫자 변환 */
const parseQuoteId = (value: string): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : NaN;
};

/** 기사님 견적 상세 페이지 클라이언트 */
const MoverQuoteDetailPageClient = ({
  quoteId,
}: MoverQuoteDetailPageClientProps) => {
  const { user } = useAuth();
  const numericQuoteId = parseQuoteId(quoteId);
  const { detail, isPending, isError, error, refetch } =
    useMoverQuoteDetail(numericQuoteId);
  /**
   * `/mover/quotes/[quoteId]` — 견적 보냄~확정 공통.
   * 데스크톱: 공유 위 `채팅하기` / 모바일·태블릿: 하단바 (닫힌·반려면 숨김).
   */
  const { startEstimateChat, isChatPending } = useStartEstimateChat();
  /** 페이지 가로 패딩 클래스 정의 */
  const pageXPadding =
    'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

  if (!Number.isInteger(numericQuoteId)) {
    return (
      <div className="flex min-h-full w-full flex-col items-center justify-center gap-4 bg-white py-16">
        <p role="alert" className="text-lg-medium text-red-200">
          유효하지 않은 견적입니다.
        </p>
        <Link
          href="/mover/quotes"
          className="text-lg-semibold text-blue-300 underline-offset-2 hover:underline"
        >
          내 견적 관리로 돌아가기
        </Link>
      </div>
    );
  }

  if (isPending) {
    return <QuoteDetailContentSkeleton aside="share" />;
  }

  if (isError || !detail) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : '견적 상세를 불러오지 못했습니다.';

    return (
      <div className="flex min-h-full w-full flex-col items-center justify-center gap-4 bg-white py-16">
        <p role="alert" className="text-center text-lg-medium text-red-200">
          {errorMessage}
        </p>
        <Button
          size="sm"
          variant="outlined"
          className="max-w-[10rem]"
          onClick={() => {
            void refetch();
          }}
        >
          다시 시도
        </Button>
        <Link
          href="/mover/quotes"
          className="text-lg-semibold text-blue-300 underline-offset-2 hover:underline"
        >
          내 견적 관리로 돌아가기
        </Link>
      </div>
    );
  }

  /** 보낸 견적 상세 → 해당 고객과 방 열고 `/chat/{roomId}` */
  const handleChatClick = () => {
    if (!user?.id) {
      return;
    }

    startEstimateChat({
      moverId: user.id,
      isDesignated: detail.isDesignated,
      estimateRequestId: detail.estimateRequestId,
      designatedMoverId: detail.designatedMoverId,
      quoteId: detail.id,
    });
  };

  const quoteShareProps = {
    sharePath: `/mover/quotes/${quoteId}`,
    shareTitle: `${detail.customerName} 고객님 견적서`,
    shareDescription:
      detail.comment?.trim() || `${detail.serviceLabel} · ${detail.priceLabel}`,
  };

  const showMobileActionBar = detail.canStartChat;

  return (
    <div
      className={cn(
        'flex min-h-0 w-full flex-1 flex-col',
        showMobileActionBar && 'pb-[4.625rem] lg:pb-0'
      )}
    >
      <div
        className={cn(
          'mx-auto grid w-full max-w-[1920px] flex-1 grid-cols-1 gap-6 py-6 md:gap-8 md:py-8 lg:items-start lg:justify-between lg:gap-10 lg:py-10',
          detail.isRejected ? '' : 'lg:grid-cols-[minmax(0,59.6875rem)_auto]',
          pageXPadding
        )}
      >
        {/* 본문 */}
        <div className="col-start-1 flex w-full max-w-[59.6875rem] flex-col gap-6 md:gap-8 lg:gap-10">
          <QuoteDetailSummaryCard detail={detail} />

          <div className="h-px w-full bg-line-100" />

          {/* 보낸 견적: 견적가 + 코멘트 / 반려: 반려 사유 */}
          {detail.isRejected ? (
            detail.rejectReason?.trim() ? (
              <section className="flex w-full flex-col gap-4 lg:gap-8">
                <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
                  반려 사유
                </h2>
                <p className="text-lg-regular whitespace-pre-wrap text-black-400 lg:text-2lg-regular">
                  {detail.rejectReason}
                </p>
              </section>
            ) : null
          ) : (
            <>
              <section className="flex w-full flex-col gap-4 lg:gap-8">
                <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
                  견적가
                </h2>
                <p className="text-2lg-bold text-black-400 lg:text-3xl-bold">
                  {detail.priceLabel}
                </p>
              </section>

              {detail.comment?.trim() ? (
                <>
                  <div className="h-px w-full bg-line-100" />
                  <section className="flex w-full flex-col gap-4 lg:gap-8">
                    <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
                      코멘트
                    </h2>
                    <p className="text-lg-regular whitespace-pre-wrap text-black-400 lg:text-2lg-regular">
                      {detail.comment}
                    </p>
                  </section>
                </>
              ) : null}
            </>
          )}

          {/* 모바일·태블릿: 본문 내 공유 (반려 제외) */}
          {!detail.isRejected ? (
            <div className="flex flex-col gap-6 lg:hidden">
              <div className="h-px w-full bg-line-100" />
              <QuoteShareButtons {...quoteShareProps} />
            </div>
          ) : null}

          <div className="h-px w-full bg-line-100" />

          <QuoteDetailInfoSection detail={detail} />
        </div>

        {/* 데스크톱: 우측 채팅 → 공유 */}
        {!detail.isRejected ? (
          <aside className="col-start-1 hidden w-full flex-col gap-10 lg:col-start-2 lg:row-span-1 lg:row-start-1 lg:flex">
            <MoverQuoteDetailActions
              variant="desktop"
              canStartChat={detail.canStartChat}
              isChatPending={isChatPending}
              onChatClick={handleChatClick}
            />
            {detail.canStartChat ? (
              <div className="h-px w-full bg-line-100" />
            ) : null}
            <QuoteShareButtons {...quoteShareProps} />
          </aside>
        ) : null}
      </div>

      {/* 모바일·태블릿: 하단 고정 채팅하기 */}
      <MoverQuoteDetailActions
        variant="mobile"
        canStartChat={detail.canStartChat}
        isChatPending={isChatPending}
        onChatClick={handleChatClick}
      />
    </div>
  );
};

export default MoverQuoteDetailPageClient;
