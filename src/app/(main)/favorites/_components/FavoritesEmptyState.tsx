'use client';

import Link from 'next/link';

import { useTranslation } from '@/i18n/useTranslation';

/** 찜한 기사님 빈 목록 안내 */
export const FavoritesEmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <p className="text-xl-regular text-gray-400">
        {t('movers.favoritesEmpty')}
      </p>
      <Link
        href="/movers"
        className="cursor-pointer text-lg-semibold text-blue-300 hover:underline"
      >
        {t('movers.browseMovers')}
      </Link>
    </div>
  );
};
