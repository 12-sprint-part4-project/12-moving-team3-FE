'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { MoverReviewSection } from '@/components/reviews/MoverReviewSection';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useMoverProfile } from '@/hooks/useMoverProfile';
import { useMoverReceivedReviews } from '@/hooks/useMoverReceivedReviews';
import { ApiError } from '@/lib/apiClient';
import { getReviewStatsTotalCount } from '@/lib/reviewDisplay';

import { MoverMyProfileCard } from './_components/MoverMyProfileCard';
import { toMoverMyProfileCardData } from './_lib/toMoverMyProfileCardData';

/**
 * 기사님 마이페이지 클라이언트.
 * Figma 내 프로필 Mobile(1:8552) · Tablet(1:8521) · Desktop(1:8536)
 * — GET /api/users/movers/profile · GET /api/review/mover
 */
const MoverMyPageClient = () => {
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
    isError: isReviewsError,
    refetch: refetchReviews,
  } = useMoverReceivedReviews({ enabled: Boolean(profile) });

  const pageXPadding =
    'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

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

  const profileErrorMessage =
    profileError instanceof ApiError
      ? profileError.message
      : '프로필을 불러오지 못했습니다.';

  const reviewCount =
    pagination?.totalCount ??
    (ratingStatistics ? getReviewStatsTotalCount(ratingStatistics) : 0);
  const averageRating =
    reviewCount > 0 && ratingStatistics
      ? ratingStatistics.average
      : null;

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-white">
      <div
        className={`border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8 ${pageXPadding}`}
      >
        <h1 className="text-md-semibold text-black-400 md:text-2lg-semibold lg:text-2xl-semibold">
          마이페이지
        </h1>
      </div>

      <div
        className={`mx-auto flex w-full max-w-[1920px] flex-col gap-6 py-6 md:gap-10 md:py-8 lg:py-10 ${pageXPadding}`}
      >
        {isProfilePending ? (
          <Spinner message="프로필을 불러오는 중..." />
        ) : isProfileError ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <p className="text-lg-medium text-gray-400">{profileErrorMessage}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="cursor-pointer rounded-lg bg-blue-300 px-4 py-2 text-lg-semibold text-white"
            >
              다시 시도
            </button>
          </div>
        ) : profile === null ? (
          <div className="flex flex-col items-center gap-4 py-16">
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
        ) : (
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
              isError={isReviewsError}
              onRetry={() => {
                void refetchReviews();
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MoverMyPageClient;
