'use client';

import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';

import type { ReactNode } from 'react';

interface FavoritesAuthGuardProps {
  children: ReactNode;
}

/**
 * `/favorites` 페이지 가드.
 * 루트 AuthRouteGuard와 별개 — 인증 준비 전에 목록 Query가 돌지 않게 한다.
 * 타이틀은 layout에 두고, 스피너는 본문 영역만 가린다.
 */
export const FavoritesAuthGuard = ({ children }: FavoritesAuthGuardProps) => {
  const { t } = useTranslation();
  const { user, isReady } = useAuth();

  if (!isReady || !user) {
    return (
      <div className="flex min-h-0 w-full flex-1 items-center justify-center bg-background-200">
        <Spinner message={t('common.loading')} />
      </div>
    );
  }

  return children;
};
