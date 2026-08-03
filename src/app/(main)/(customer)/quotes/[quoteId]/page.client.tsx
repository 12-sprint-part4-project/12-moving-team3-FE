'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/Button/Button';
import { QuoteShareButtons } from '@/components/QuoteShareButtons/QuoteShareButtons';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useConfirmQuoteModal } from '@/hooks/useConfirmQuoteModal';
import { useCustomerQuoteDetail } from '@/hooks/useCustomerQuoteDetail';
import { ApiError } from '@/lib/apiClient';
import type { CustomerQuoteMoverViewModel } from '@/types/customerQuote';

import { ConfirmQuoteModal } from '../_components/ConfirmQuoteModal';
import { CustomerQuoteDetailActions } from './_components/CustomerQuoteDetailActions';
import { CustomerQuoteDetailInfoSection } from './_components/CustomerQuoteDetailInfoSection';
import { CustomerQuoteDetailSummaryCard } from './_components/CustomerQuoteDetailSummaryCard';

export interface CustomerQuoteDetailPageClientProps {
  quoteId: string;
}

const PAGE_X_PADDING =
  'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

/** 견적 ID 숫자 변환 */
const parseQuoteId = (value: string): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : NaN;
};

/** 로컬 찜 오버라이드 (API 연동 전 UI 전용) */
interface FavoriteDraft {
  quoteId: number;
  isFavorited: boolean;
  favoriteCount: number;
}

/** 고객 견적 상세 페이지 클라이언트 */
const CustomerQuoteDetailPageClient = ({
  quoteId,
}: CustomerQuoteDetailPageClientProps) => {
  const router = useRouter();
  const numericQuoteId = parseQuoteId(quoteId);
  const { detail, isPending, isError, error, refetch } =
    useCustomerQuoteDetail(numericQuoteId);

  const [favoriteDraft, setFavoriteDraft] = useState<FavoriteDraft | null>(
    null
  );

  const {
    isConfirmModalOpen,
    isConfirming,
    openConfirmModal,
    closeConfirmModal,
    submitConfirm,
  } = useConfirmQuoteModal(() => {
    router.replace('/quotes?tab=received');
  });

  if (!Number.isInteger(numericQuoteId)) {
    return (
      <div className="flex min-h-full w-full flex-col items-center justify-center gap-4 bg-white py-16">
        <p role="alert" className="text-lg-medium text-red-200">
          유효하지 않은 견적입니다.
        </p>
        <Link
          href="/quotes"
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
          href="/quotes"
          className="text-lg-semibold text-blue-300 underline-offset-2 hover:underline"
        >
          내 견적 관리로 돌아가기
        </Link>
      </div>
    );
  }

  const isFavorited =
    favoriteDraft?.quoteId === detail.quoteId
      ? favoriteDraft.isFavorited
      : detail.mover.isFavorited;
  const favoriteCount =
    favoriteDraft?.quoteId === detail.quoteId
      ? favoriteDraft.favoriteCount
      : detail.mover.favoriteCount;

  /** 로컬 찜 토글 (API 미연결) */
  const handleToggleFavorite = () => {
    setFavoriteDraft({
      quoteId: detail.quoteId,
      isFavorited: !isFavorited,
      favoriteCount: Math.max(0, favoriteCount + (isFavorited ? -1 : 1)),
    });
  };

  const moverView: CustomerQuoteMoverViewModel = {
    ...detail.mover,
    isFavorited,
    favoriteCount,
    favoriteCountLabel: favoriteCount.toLocaleString('ko-KR'),
  };

  const showMobileActionBar = detail.isPending;

  return (
    <div
      className={`flex min-h-full w-full flex-col overflow-x-hidden bg-white lg:pb-0 ${
        showMobileActionBar ? 'pb-[4.625rem]' : ''
      }`}
    >
      <div
        className={`border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8 ${PAGE_X_PADDING}`}
      >
        <h1 className="text-2lg-semibold text-black-400 lg:text-2xl-semibold">
          견적 상세
        </h1>
      </div>

      <div
        className={`mx-auto grid w-full max-w-[1920px] flex-1 grid-cols-1 gap-6 py-6 md:gap-8 md:py-8 lg:grid-cols-[minmax(0,59.6875rem)_20.5rem] lg:items-start lg:justify-between lg:gap-10 lg:py-10 ${PAGE_X_PADDING}`}
      >
        {/* 본문: 카드 → 견적가 → (모바일 공유) → 견적 정보 */}
        <div className="col-start-1 flex w-full max-w-[59.6875rem] flex-col gap-6 md:gap-8 lg:gap-10">
          <CustomerQuoteDetailSummaryCard detail={detail} mover={moverView} />

          <div className="h-px w-full bg-line-100" />

          <section className="flex w-full flex-col gap-4 lg:gap-8">
            <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
              견적가
            </h2>
            <p className="text-2lg-bold text-black-400 lg:text-3xl-bold">
              {detail.priceLabel}
            </p>
          </section>

          {/* 모바일·태블릿: 본문 내 공유 */}
          <div className="flex flex-col gap-6 lg:hidden">
            <div className="h-px w-full bg-line-100" />
            <QuoteShareButtons sharePath={`/quotes/${quoteId}`} />
          </div>

          <div className="h-px w-full bg-line-100" />

          <CustomerQuoteDetailInfoSection detail={detail} />
        </div>

        {/* 데스크톱: 우측 확정 CTA + 공유 */}
        <aside className="col-start-1 hidden w-full flex-col gap-10 lg:col-start-2 lg:row-span-1 lg:row-start-1 lg:flex lg:w-[20.5rem]">
          <CustomerQuoteDetailActions
            variant="desktop"
            isPending={detail.isPending}
            isConfirming={isConfirming}
            isFavorited={isFavorited}
            onConfirm={() => openConfirmModal(detail.quoteId)}
            onToggleFavorite={handleToggleFavorite}
          />
          {detail.isPending ? (
            <div className="h-px w-full bg-line-100" />
          ) : null}
          <QuoteShareButtons sharePath={`/quotes/${quoteId}`} />
        </aside>
      </div>

      {/* 모바일·태블릿: 하단 고정 찜 + 확정 (대기 중일 때만) */}
      <CustomerQuoteDetailActions
        variant="mobile"
        isPending={detail.isPending}
        isConfirming={isConfirming}
        isFavorited={isFavorited}
        onConfirm={() => openConfirmModal(detail.quoteId)}
        onToggleFavorite={handleToggleFavorite}
      />

      <ConfirmQuoteModal
        open={isConfirmModalOpen}
        isConfirming={isConfirming}
        onClose={closeConfirmModal}
        onConfirm={submitConfirm}
      />
    </div>
  );
};

export default CustomerQuoteDetailPageClient;
