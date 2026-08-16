'use client';

import Link from 'next/link';

/** 찜한 기사님 빈 목록 안내 */
export const FavoritesEmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-16">
    <p className="text-xl-regular text-gray-400">찜한 기사님이 없어요</p>
    <Link
      href="/movers"
      className="cursor-pointer text-lg-semibold text-blue-300 hover:underline"
    >
      기사님 찾아보기
    </Link>
  </div>
);
