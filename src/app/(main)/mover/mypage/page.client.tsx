'use client';

import { useState } from 'react';

import { MoverReviews } from '@/components/movers/MoverReviews';
import type { ReviewListItemData } from '@/components/movers/ReviewListItem';
import type { ReviewStats } from '@/types/mover';

import { MoverMyProfileCard } from './_components/MoverMyProfileCard';

/** Figma 내 프로필 Desktop(1:8536) 목업 — API 연동 전 UI 확인용 */
const MOCK_PROFILE = {
  nickname: '김코드',
  shortDescription: '고객님의 물품을 소중하고 안전하게 운송하여 드립니다.',
  profileImageUrl: null as string | null,
  averageRating: 5.0,
  reviewCount: 178,
  career: 7,
  confirmedCount: 334,
  servicesLabel: '소형이사, 가정이사',
  regionsLabel: '서울, 경기',
};

const MOCK_REVIEW_STATS: ReviewStats = {
  averageRating: 5.0,
  totalCount: 178,
  ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 8, 5: 170 },
};

const MOCK_REVIEWS: ReviewListItemData[] = [
  {
    id: '1',
    reviewerName: 'kim****',
    createdAt: '2024-07-01',
    rating: 5,
    content:
      '듣던대로 정말 친절하시고 물건도 잘 옮겨주셨어요~~\n나중에 또 짐 옮길 일 있으면 김코드 기사님께 부탁드릴 예정입니다!!\n비 오는데 꼼꼼히 잘 해주셔서 감사드립니다 :)',
  },
  {
    id: '2',
    reviewerName: 'kim****',
    createdAt: '2024-07-01',
    rating: 5,
    content:
      '듣던대로 정말 친절하시고 물건도 잘 옮겨주셨어요~~\n나중에 또 짐 옮길 일 있으면 김코드 기사님께 부탁드릴 예정입니다!!\n비 오는데 꼼꼼히 잘 해주셔서 감사드립니다 :)',
  },
  {
    id: '3',
    reviewerName: 'kim****',
    createdAt: '2024-07-01',
    rating: 5,
    content:
      '듣던대로 정말 친절하시고 물건도 잘 옮겨주셨어요~~\n나중에 또 짐 옮길 일 있으면 김코드 기사님께 부탁드릴 예정입니다!!\n비 오는데 꼼꼼히 잘 해주셔서 감사드립니다 :)',
  },
  {
    id: '4',
    reviewerName: 'kim****',
    createdAt: '2024-07-01',
    rating: 5,
    content:
      '듣던대로 정말 친절하시고 물건도 잘 옮겨주셨어요~~\n나중에 또 짐 옮길 일 있으면 김코드 기사님께 부탁드릴 예정입니다!!\n비 오는데 꼼꼼히 잘 해주셔서 감사드립니다 :)',
  },
  {
    id: '5',
    reviewerName: 'kim****',
    createdAt: '2024-07-01',
    rating: 5,
    content:
      '듣던대로 정말 친절하시고 물건도 잘 옮겨주셨어요~~\n나중에 또 짐 옮길 일 있으면 김코드 기사님께 부탁드릴 예정입니다!!\n비 오는데 꼼꼼히 잘 해주셔서 감사드립니다 :)',
  },
];

const MOCK_TOTAL_PAGES = 9;

/**
 * 기사님 마이페이지 클라이언트.
 * Figma 내 프로필/Desktop(1:8536) — UI 목업 (API 미연동).
 */
const MoverMyPageClient = () => {
  const [page, setPage] = useState(1);

  const pageXPadding =
    'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

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
        <MoverMyProfileCard profile={MOCK_PROFILE} />

        <div className="border-t border-line-100" />

        <MoverReviews
          moverId="mock-mover"
          reviewStats={MOCK_REVIEW_STATS}
          reviews={MOCK_REVIEWS}
          page={page}
          totalPages={MOCK_TOTAL_PAGES}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default MoverMyPageClient;
