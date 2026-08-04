'use client';

import Link from 'next/link';

import { Button } from '@/components/Button/Button';
import { QuoteShareButtons } from '@/components/QuoteShareButtons/QuoteShareButtons';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useMoverQuoteDetail } from '@/hooks/useMoverQuoteDetail';
import { ApiError } from '@/lib/apiClient';
import { cn } from '@/lib/utils';

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
  const numericQuoteId = parseQuoteId(quoteId);
  const { detail, isPending, isError, error, refetch } =
    useMoverQuoteDetail(numericQuoteId);
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
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-white">
        <Spinner message="견적 상세 불러오는 중..." />
      </div>
    );
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

  return (
    <div className="flex min-h-full w-full flex-col overflow-x-hidden bg-white">
      {/* 페이지 타이틀 렌더 */}
      <div
        className={`border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8 ${pageXPadding}`}
      >
        <h1 className="text-2lg-semibold text-black-400 lg:text-2xl-semibold">
          견적 상세
        </h1>
      </div>

      {/* 본문 — 보낸 견적: 모바일 요약→공유→본문 / 데스크톱 좌측 본문·우측 공유 */}
      <div
        className={cn(
          'mx-auto grid w-full max-w-[1920px] flex-1 grid-cols-1 gap-6 py-6 md:gap-8 md:py-8 lg:items-start lg:justify-between lg:gap-10 lg:py-10',
          detail.isRejected ? '' : 'lg:grid-cols-[minmax(0,59.6875rem)_auto]',
          pageXPadding
        )}
      >
        <QuoteDetailSummaryCard detail={detail} className="col-start-1" />

        {!detail.isRejected ? (
          <aside className="col-start-1 lg:col-start-2 lg:row-span-3 lg:row-start-1">
            <QuoteShareButtons sharePath={`/mover/quotes/${quoteId}`} />
          </aside>
        ) : null}

        <div className="col-start-1 flex w-full max-w-[59.6875rem] flex-col gap-6 md:gap-8 lg:gap-10">
          <div className="h-px w-full bg-line-100" />

          {/* 견적가 또는 반려 사유 */}
          {detail.isRejected ? (
            <section className="flex w-full flex-col gap-4 lg:gap-8">
              <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
                반려 사유
              </h2>
              <p className="text-2lg-regular text-black-400 lg:text-2xl-regular">
                {detail.rejectReason ?? '-'}
              </p>
            </section>
          ) : (
            <section className="flex w-full flex-col gap-4 lg:gap-8">
              <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
                견적가
              </h2>
              <p className="text-2lg-bold text-black-400 lg:text-3xl-bold">
                {detail.priceLabel}
              </p>
            </section>
          )}

          <div className="h-px w-full bg-line-100" />

          <QuoteDetailInfoSection detail={detail} />
        </div>
      </div>
    </div>
  );
};

export default MoverQuoteDetailPageClient;
