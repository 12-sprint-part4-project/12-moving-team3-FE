'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { MoverReviews } from '@/components/movers/MoverReviews';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useMoverProfile } from '@/hooks/useMoverProfile';
import { useMoverReviews } from '@/hooks/useMoverReviews';
import { ApiError } from '@/lib/apiClient';

import { MoverMyProfileCard } from './_components/MoverMyProfileCard';
import { toMoverMyProfileCardData } from './_lib/toMoverMyProfileCardData';

/**
 * 기사님 마이페이지 클라이언트.
 * Figma 내 프로필/Desktop(1:8536)
 * — GET /api/users/movers/profile · GET /api/review/mover
 */
const MoverMyPageClient = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const {
    data: profile,
    isPending: isProfilePending,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
  } = useMoverProfile();

  const {
    reviews,
    reviewStats,
    totalPages,
    currentPage,
    isPending: isReviewsPending,
    isError: isReviewsError,
    error: reviewsError,
    refetch: refetchReviews,
  } = useMoverReviews({ page, enabled: Boolean(profile) });

  /** 총 페이지 감소 시 현재 페이지 보정 */
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pageXPadding =
    'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const handleEditBasicInfo = () => {
    // 기본 정보 수정 화면 미구현 — 프로필 수정과 동일 경로로 이동
    router.push('/profile/mover');
  };

  const handleEditProfile = () => {
    router.push('/profile/mover');
  };

  const handleRetry = () => {
    void refetchProfile();
    void refetchReviews();
  };

  const profileErrorMessage =
    profileError instanceof ApiError
      ? profileError.message
      : '프로필을 불러오지 못했습니다.';
  const reviewsErrorMessage =
    reviewsError instanceof ApiError
      ? reviewsError.message
      : '리뷰를 불러오지 못했습니다.';

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-white">
      <div
        className={`border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8 ${pageXPadding}`}
      >
        <h1 className="text-2lg-semibold text-black-300 lg:text-2xl-semibold">
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
              profile={toMoverMyProfileCardData(profile, reviewStats)}
              onEditBasicInfo={handleEditBasicInfo}
              onEditProfile={handleEditProfile}
            />

            <div className="border-t border-line-100" />

            {isReviewsPending && !reviewStats ? (
              <Spinner message="리뷰를 불러오는 중..." />
            ) : isReviewsError ? (
              <div className="flex flex-col items-center gap-4 py-10">
                <p className="text-lg-medium text-gray-400">
                  {reviewsErrorMessage}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    void refetchReviews();
                  }}
                  className="cursor-pointer rounded-lg bg-blue-300 px-4 py-2 text-lg-semibold text-white"
                >
                  다시 시도
                </button>
              </div>
            ) : (
              <MoverReviews
                moverId={profile.userId}
                reviewStats={reviewStats}
                reviews={reviews}
                page={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MoverMyPageClient;
