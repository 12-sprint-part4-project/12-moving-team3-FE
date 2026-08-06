'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import InfoIcon from '@/assets/icons/info.svg';
import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { Button } from '@/components/Button/Button';
import { QuoteShareButtons } from '@/components/QuoteShareButtons/QuoteShareButtons';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { Toast } from '@/components/ui/Toast/Toast';
import { useConfirmQuoteModal } from '@/hooks/useConfirmQuoteModal';
import { useCustomerQuoteDetail } from '@/hooks/useCustomerQuoteDetail';
import { useFavoriteAction } from '@/hooks/useFavoriteAction';
import { ApiError } from '@/lib/apiClient';

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

/** 고객 견적 상세 페이지 클라이언트 */
const CustomerQuoteDetailPageClient = ({
  quoteId,
}: CustomerQuoteDetailPageClientProps) => {
  const router = useRouter();
  const numericQuoteId = parseQuoteId(quoteId);
  const {
    handleFavoriteClick,
    isMoverPending,
    isLoginModalOpen,
    closeLoginModal,
  } = useFavoriteAction();

  const { detail, isPending, isError, error, refetch } =
    useCustomerQuoteDetail(numericQuoteId);

  const {
    isConfirmModalOpen,
    isConfirming,
    openConfirmModal,
    closeConfirmModal,
    submitConfirm,
  } = useConfirmQuoteModal(() => {
    router.replace('/quotes/history');
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

  const showMobileActionBar = detail.canConfirm;
  const quoteShareProps = {
    sharePath: `/quotes/${quoteId}`,
    shareTitle: `${detail.mover.nickname} 기사님 견적서`,
    shareDescription:
      detail.comment?.trim() ||
      detail.mover.shortDescription ||
      `${detail.serviceLabel} · ${detail.priceLabel}`,
    shareImageUrl: detail.mover.profileImageUrl,
  };

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
        {/* 본문: 카드 → 견적가 → (모바일 공유) → 견적 정보 → 미확정 배너 */}
        <div className="col-start-1 flex w-full max-w-[59.6875rem] flex-col gap-6 md:gap-8 lg:gap-10">
          <CustomerQuoteDetailSummaryCard
            detail={detail}
            mover={detail.mover}
            onFavoriteClick={handleFavoriteClick}
            isFavoritePending={isMoverPending(detail.mover.moverId)}
          />

          <div className="h-px w-full bg-line-100" />

          <section className="flex w-full flex-col gap-4 lg:gap-8">
            <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
              견적가
            </h2>
            <p className="text-2lg-bold text-black-400 lg:text-3xl-bold">
              {detail.priceLabel}
            </p>
          </section>

          {detail.comment ? (
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

          {/* 모바일·태블릿: 본문 내 공유 */}
          <div className="flex flex-col gap-6 lg:hidden">
            <div className="h-px w-full bg-line-100" />
            <QuoteShareButtons {...quoteShareProps} />
          </div>

          <div className="h-px w-full bg-line-100" />

          <CustomerQuoteDetailInfoSection detail={detail} />

          {detail.showUnconfirmedBanner ? (
            <Toast
              icon={InfoIcon}
              content="확정하지 않은 견적이에요!"
              className="w-full justify-center"
            />
          ) : null}
        </div>

        {/* 데스크톱: 우측 확정 CTA + 공유 */}
        <aside className="col-start-1 hidden w-full flex-col gap-10 lg:col-start-2 lg:row-span-1 lg:row-start-1 lg:flex lg:w-[20.5rem]">
          <CustomerQuoteDetailActions
            variant="desktop"
            canConfirm={detail.canConfirm}
            isConfirming={isConfirming}
            isFavorited={detail.mover.isFavorited}
            isFavoritePending={isMoverPending(detail.mover.moverId)}
            onConfirm={() => openConfirmModal(detail.quoteId)}
            onToggleFavorite={() =>
              handleFavoriteClick(
                detail.mover.moverId,
                !detail.mover.isFavorited
              )
            }
          />
          {detail.canConfirm ? (
            <div className="h-px w-full bg-line-100" />
          ) : null}
          <QuoteShareButtons {...quoteShareProps} />
        </aside>
      </div>

      {/* 모바일·태블릿: 하단 고정 찜 + 확정 (확정 가능할 때만) */}
      <CustomerQuoteDetailActions
        variant="mobile"
        canConfirm={detail.canConfirm}
        isConfirming={isConfirming}
        isFavorited={detail.mover.isFavorited}
        isFavoritePending={isMoverPending(detail.mover.moverId)}
        onConfirm={() => openConfirmModal(detail.quoteId)}
        onToggleFavorite={() =>
          handleFavoriteClick(detail.mover.moverId, !detail.mover.isFavorited)
        }
      />

      <ConfirmQuoteModal
        open={isConfirmModalOpen}
        isConfirming={isConfirming}
        onClose={closeConfirmModal}
        onConfirm={submitConfirm}
      />

      <LoginRequiredModal open={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
};

export default CustomerQuoteDetailPageClient;
