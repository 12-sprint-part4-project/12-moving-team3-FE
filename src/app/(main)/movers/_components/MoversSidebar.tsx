'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { MoverCard } from '@/components/movers/MoverCard';
import {
  fadeIn,
  fadeUp,
  getMotionTransition,
  listStagger,
  tapScale,
} from '@/lib/motionVariants';
import { cn } from '@/lib/utils';
import { REGION_FILTER_OPTIONS, SERVICE_FILTER_OPTIONS } from '@/types/mover';

import { MoversSelectDropdown } from './MoversSelectDropdown';

import type { MoversFilterActions, MoversFilters } from '../_lib/moversFilters';
import type { MoverCardModel } from '@/types/mover';

export interface MoversSidebarProps {
  filters: MoversFilters;
  filterActions: MoversFilterActions;
  isLoggedIn: boolean;
  favoriteMovers: MoverCardModel[];
  onFavoriteClick: (moverId: string, nextFavorited: boolean) => void;
  isMoverPending?: (moverId: string) => boolean;
  className?: string;
}

/** Desktop 좌측 사이드바 — 필터 + 찜한 기사님(최대 3) */
export const MoversSidebar = ({
  filters,
  filterActions,
  isLoggedIn,
  favoriteMovers,
  onFavoriteClick,
  isMoverPending,
  className = '',
}: MoversSidebarProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const { regionValue, serviceValue } = filters;
  const { onRegionChange, onServiceChange, onResetFilters } = filterActions;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={motionTransition}
      className={cn('flex w-full max-w-[20.5rem] flex-col gap-10', className)}
    >
      <section className="flex w-full flex-col">
        <div className="flex items-center justify-between px-3.5 py-4">
          <h2 className="text-2xl-semibold text-black-400">필터</h2>
          <motion.button
            type="button"
            onClick={onResetFilters}
            {...(shouldReduceMotion ? {} : tapScale)}
            className="cursor-pointer text-2lg-medium text-gray-300 hover:text-gray-400"
          >
            초기화
          </motion.button>
        </div>

        <div className="flex flex-col gap-8 border-t border-line-100 pt-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={motionTransition}
            className="flex flex-col gap-4"
          >
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
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{
              ...motionTransition,
              delay: shouldReduceMotion ? 0 : 0.04,
            }}
            className="flex flex-col gap-4"
          >
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
          </motion.div>
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
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={motionTransition}
            className="rounded-2xl border border-line-100 bg-background-200 px-4 py-8 text-center text-lg-medium text-gray-400"
          >
            로그인이 필요한 기능입니다
          </motion.p>
        ) : favoriteMovers.length === 0 ? (
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={motionTransition}
            className="rounded-2xl border border-line-100 bg-background-200 px-4 py-8 text-center text-lg-medium text-gray-400"
          >
            찜한 기사님이 없어요
          </motion.p>
        ) : (
          <motion.ul
            variants={listStagger}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-4"
          >
            {favoriteMovers.map((mover) => (
              <motion.li key={mover.moverId} variants={fadeUp}>
                <MoverCard
                  mover={mover}
                  size="sm"
                  onFavoriteClick={onFavoriteClick}
                  isFavoritePending={isMoverPending?.(mover.moverId)}
                />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </section>
    </motion.aside>
  );
};
