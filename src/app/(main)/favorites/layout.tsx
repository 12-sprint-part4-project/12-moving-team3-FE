import { getServerTranslation } from '@/i18n/getServerTranslation';
import { cn } from '@/lib/utils';

import { FavoritesAuthGuard } from './_components/FavoritesAuthGuard';
import { FAVORITES_PAGE_X_PADDING } from './_components/favoritesLayout';

interface FavoritesLayoutProps {
  children: React.ReactNode;
}

/** `/favorites` 레이아웃. 타이틀 셸 + 인증 준비 가드. */
const FavoritesLayout = async ({ children }: FavoritesLayoutProps) => {
  const { t } = await getServerTranslation();

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
      <div
        className={cn(
          'shrink-0 border-b border-line-100 bg-white py-4 shadow-page-title tablet:py-6 xl:py-8',
          FAVORITES_PAGE_X_PADDING
        )}
      >
        <h1 className="text-2lg-semibold text-black-400 xl:text-2xl-semibold">
          {t('nav.profile.favorites')}
        </h1>
      </div>
      <FavoritesAuthGuard>{children}</FavoritesAuthGuard>
    </div>
  );
};

export default FavoritesLayout;
