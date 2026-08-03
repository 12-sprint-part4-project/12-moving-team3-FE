'use client';

import Link from 'next/link';

import { MoverCard } from '@/components/movers/MoverCard';
import { cn } from '@/lib/utils';
import type { MoverCardModel } from '@/types/mover';
import {
  REGION_FILTER_OPTIONS,
  SERVICE_FILTER_OPTIONS,
} from '@/types/mover';

import { MoversSelectDropdown } from './MoversSelectDropdown';

export interface MoversSidebarProps {
  regionValue: string;
  serviceValue: string;
  onRegionChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onResetFilters: () => void;
  isLoggedIn: boolean;
  favoriteMovers: MoverCardModel[];
  onFavoriteClick: (moverId: string, nextFavorited: boolean) => void;
  /** 찜 mutation 진행 중인 기사님 id — 해당 카드만 pending */
  favoritePendingMoverId?: string | null;
  className?: string;
}

/** Desktop 좌측 사이드바 — 필터 + 찜한 기사님(최대 3) */
export const MoversSidebar = ({
  regionValue,
  serviceValue,
  onRegionChange,
  onServiceChange,
  onResetFilters,
  isLoggedIn,
  favoriteMovers,
  onFavoriteClick,
  favoritePendingMoverId = null,
  className = '',
}: MoversSidebarProps) => {
  return (
    <aside className={cn('flex w-full max-w-[20.5rem] flex-col gap-10', className)}>
      <section className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between px-3.5 py-4">
          <h2 className="text-2xl-semibold text-black-400">필터</h2>
          <button
            type="button"
            onClick={onResetFilters}
            className="cursor-pointer text-2lg-medium text-gray-300 hover:text-gray-400"
          >
            초기화
          </button>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-2lg-semibold text-black-400">
              지역을 선택해주세요
            </p>
            <MoversSelectDropdown
              label="지역"
              placeholder="지역"
              options={REGION_FILTER_OPTIONS}
              value={regionValue}
              onValueChange={onRegionChange}
              fullWidth
              columns={2}
            />
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-2lg-semibold text-black-400">
              어떤 서비스가 필요하세요?
            </p>
            <MoversSelectDropdown
              label="서비스"
              placeholder="서비스"
              options={SERVICE_FILTER_OPTIONS}
              value={serviceValue}
              onValueChange={onServiceChange}
              fullWidth
            />
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col gap-4">
        <h2 className="text-2xl-semibold text-black-400">
          <Link
            href="/favorites"
            className="cursor-pointer hover:text-blue-300"
          >
            찜한 기사님
          </Link>
        </h2>
        {!isLoggedIn ? (
          <p className="rounded-2xl border border-line-100 bg-background-200 px-4 py-8 text-center text-lg-medium text-gray-400">
            로그인이 필요한 기능입니다
          </p>
        ) : favoriteMovers.length === 0 ? (
          <p className="rounded-2xl border border-line-100 bg-background-200 px-4 py-8 text-center text-lg-medium text-gray-400">
            찜한 기사님이 없어요
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {favoriteMovers.map((mover) => (
              <li key={mover.moverId}>
                <MoverCard
                  mover={mover}
                  size="sm"
                  onFavoriteClick={onFavoriteClick}
                  isFavoritePending={favoritePendingMoverId === mover.moverId}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
};
