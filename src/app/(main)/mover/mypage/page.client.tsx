'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { MoverReviewSection } from '@/components/reviews/MoverReviewSection';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useMoverProfile } from '@/hooks/useMoverProfile';
import { useMoverReceivedReviews } from '@/hooks/useMoverReceivedReviews';
import { ApiError } from '@/lib/apiClient';
import { getReviewStatsTotalCount } from '@/lib/reviewDisplay';
import { cn } from '@/lib/utils';

import { MoverMyProfileCard } from './_components/MoverMyProfileCard';
import { toMoverMyProfileCardData } from './_lib/toMoverMyProfileCardData';

const PAGE_X_PADDING =
  'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

const TITLE_BAR_CLASS =
  'border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8';

const CONTENT_CLASS =
  'mx-auto flex w-full max-w-[1920px] flex-col gap-6 py-6 md:gap-10 md:py-8 lg:py-10';

const STATUS_WRAP_CLASS = 'flex flex-col items-center gap-4 py-16';

/** 기사님 마이페이지. 프로필 카드와 받은 리뷰를 보여 준다. */
export const MoverMyPageClient = () => {
  const router = useRouter();

  const {
    data: profile,
    isPending: isProfilePending,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
  } = useMoverProfile();

  const {
    reviews,
    ratingStatistics,
    pagination,
    page,
    totalPages,
    setPage,
    isPending: isReviewsPending,
    isFetching: isReviewsFetching,
    isError: isReviewsError,
    refetch: refetchReviews,
  } = useMoverReceivedReviews({ enabled: Boolean(profile) });

  const profileErrorMessage =
    profileError instanceof ApiError
      ? profileError.message
      : '프로필을 불러오지 못했습니다.';

  const reviewCount =
    pagination?.totalCount ??
    (ratingStatistics ? getReviewStatsTotalCount(ratingStatistics) : 0);
  const averageRating =
    reviewCount > 0 && ratingStatistics ? ratingStatistics.average : null;

  const showProfileSpinner = isProfilePending;
  const showProfileError = !isProfilePending && isProfileError;
  const showProfileEmpty =
    !isProfilePending && !isProfileError && profile === null;
  const showProfileContent =
    !isProfilePending && !isProfileError && profile !== null;

  const handleEditBasicInfo = () => {
    router.push('/profile/mover/basic');
  };

  const handleEditProfile = () => {
    router.push('/profile/mover/edit');
  };

  const handleRetry = () => {
    void refetchProfile();
    void refetchReviews();
  };

  const handleRetryReviews = () => {
    void refetchReviews();
  };

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-white">
      <div className={cn(TITLE_BAR_CLASS, PAGE_X_PADDING)}>
        <h1 className="text-md-semibold text-black-400 md:text-2lg-semibold lg:text-2xl-semibold">
          마이페이지
        </h1>
      </div>

      <div className={cn(CONTENT_CLASS, PAGE_X_PADDING)}>
        {showProfileSpinner ? (
          <Spinner message="프로필을 불러오는 중..." />
        ) : null}

        {showProfileError ? (
          <div className={STATUS_WRAP_CLASS}>
            <p className="text-lg-medium text-gray-400">
              {profileErrorMessage}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="cursor-pointer rounded-lg bg-blue-300 px-4 py-2 text-lg-semibold text-white"
            >
              다시 시도
            </button>
          </div>
        ) : null}

        {showProfileEmpty ? (
          <div className={STATUS_WRAP_CLASS}>
            <p className="text-lg-medium text-gray-400">
              등록된 프로필이 없어요.
            </p>
            <Link
              href="/profile/mover"
              className="rounded-lg bg-blue-300 px-4 py-2 text-lg-semibold text-white"
            >
              프로필 등록하기
            </Link>
          </div>
        ) : null}

        {showProfileContent && profile !== null ? (
          <>
            <MoverMyProfileCard
              profile={toMoverMyProfileCardData(profile, {
                averageRating,
                reviewCount,
              })}
              onEditBasicInfo={handleEditBasicInfo}
              onEditProfile={handleEditProfile}
            />

            <div className="border-t border-line-100" />

            <MoverReviewSection
              reviews={reviews}
              ratingStatistics={ratingStatistics}
              totalCount={reviewCount}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              isPending={isReviewsPending}
              isFetching={isReviewsFetching}
              isError={isReviewsError}
              onRetry={handleRetryReviews}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};
