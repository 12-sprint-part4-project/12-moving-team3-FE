'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import ProfileIcon from '@/assets/icons/profile.svg';
import StarIcon from '@/assets/icons/star.svg';
import { FavoriteButton } from '@/components/Favorite';
import { ReportAction } from '@/components/reports';
import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { useTranslation } from '@/i18n/useTranslation';
import { cardHover, fadeUp, listStagger, tapScale } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';
import { API_MOVE_TYPE_TO_UI } from '@/types/estimateRequest';

import type { ApiMoveType, MoverCardModel } from '@/types/mover';
import type { MouseEvent } from 'react';

export type MoverCardSize = 'lg' | 'sm';
export type MoverCardVariant = 'default' | 'favorite';

export interface MoverCardProps {
  mover: MoverCardModel;
  size?: MoverCardSize;
  /** favorite: 한 줄 소개 숨김 + 경력/확정 항상 표시 (Figma Card-list/찜한 기사님) */
  variant?: MoverCardVariant;
  onFavoriteClick?: (moverId: string, nextFavorited: boolean) => void;
  /** 찜 요청 진행 중 — 시각적 busy 표시 (클릭은 허용) */
  isFavoritePending?: boolean;
  /** true면 상세 이동 비활성 (이미 상세 페이지일 때) */
  disableNavigation?: boolean;
  className?: string;
}

/**
 * 기사님 목록 카드 (Figma Card-list/기사님 찾기 · 찜한 기사님).
 * 닉네임 링크(+ 카드 오버레이)로 `/movers/:id` 이동 (disableNavigation 제외).
 */
export const MoverCard = ({
  mover,
  size = 'lg',
  variant = 'default',
  onFavoriteClick,
  isFavoritePending = false,
  disableNavigation = false,
  className = '',
}: MoverCardProps) => {
  const { t } = useTranslation();
  const isCompact = size === 'sm';
  const isFavoriteVariant = variant === 'favorite';
  const showDescription = !isCompact && !isFavoriteVariant;
  const showCareerAndConfirmed = !isCompact || isFavoriteVariant;
  const ratingLabel =
    mover.averageRating === null ? '-' : mover.averageRating.toFixed(1);
  const careerLabel =
    mover.career === null ? '-' : t('movers.careerYears', { count: mover.career });
  const confirmedLabel =
    mover.confirmedCount === null
      ? '-'
      : t('movers.confirmedCount', { count: mover.confirmedCount });
  const description =
    mover.shortDescription?.trim() || t('movers.noShortDescription');
  const nameClassName = cn(
    'text-black-300',
    isCompact ? 'text-lg-semibold' : 'text-2lg-semibold'
  );
  const profileAlt = t('movers.profileAlt', { name: mover.name });

  const handleFavoriteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    onFavoriteClick?.(mover.moverId, !mover.isFavorited);
  };

  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      layout
      {...(shouldReduceMotion || disableNavigation ? {} : cardHover)}
      className={cn(
        'relative flex w-full flex-col border border-line-100 bg-white shadow-request-card transition-colors',
        !disableNavigation && 'cursor-pointer hover:border-blue-200',
        isCompact ? 'rounded-2xl px-4 py-4' : 'rounded-2xl px-6 py-5',
        className
      )}
    >
      <motion.div
        variants={listStagger}
        initial="hidden"
        animate="show"
        className={cn('flex w-full flex-col', isCompact ? 'gap-3' : 'gap-4')}
      >
        <motion.div variants={fadeUp} className="flex justify-between">
          <div className="flex flex-wrap items-center gap-2 tablet:gap-3">
            {mover.services.length > 0 ? (
              mover.services.map((service: ApiMoveType) => (
                <MoveTypeChip
                  key={service}
                  type={API_MOVE_TYPE_TO_UI[service]}
                  size="sm"
                />
              ))
            ) : (
              <span className="text-md-medium text-gray-300">
                서비스 미등록
              </span>
            )}
            {mover.isDesignated ? (
              <motion.div
                animate={
                  shouldReduceMotion ? undefined : { scale: [1, 1.04, 1] }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { duration: 2, repeat: 3, ease: 'easeInOut' }
                }
              >
                <MoveTypeChip type="designated" size="sm" />
              </motion.div>
            ) : null}
          </div>
          {!isCompact ? (
            <ReportAction
              target="USER"
              targetId={mover.moverId}
              className="relative z-10"
            />
          ) : null}
        </motion.div>

        {showDescription ? (
          <motion.p
            variants={fadeUp}
            className="text-xl-semibold text-black-300 tablet:text-2xl-semibold"
          >
            {description}
          </motion.p>
        ) : null}

        <motion.div
          variants={fadeUp}
          className={cn(
            'flex w-full items-start border border-line-100 bg-white shadow-[0.25rem_0.25rem_0.5rem] shadow-shadow-gray-200/10',
            isCompact
              ? 'gap-3 rounded-md px-3 py-3'
              : 'gap-4 rounded-md px-[1.125rem] py-4'
          )}
        >
          <div
            className={cn(
              'relative shrink-0 overflow-hidden rounded-full',
              isCompact ? 'size-10' : 'size-14'
            )}
          >
            {mover.profileImageUrl ? (
              <Image
                src={mover.profileImageUrl}
                alt={profileAlt}
                fill
                sizes={isCompact ? '40px' : '56px'}
                className="object-cover"
              />
            ) : (
              <ProfileIcon className="size-full" aria-hidden />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1.5 tablet:gap-2">
            {disableNavigation ? (
              <p className={nameClassName}>
                {mover.name} {t('gnb.role.mover')}
              </p>
            ) : (
              <Link href={`/movers/${mover.moverId}`} className={nameClassName}>
                <span className="absolute inset-0 z-0" aria-hidden />
                {mover.name} {t('gnb.role.mover')}
              </Link>
            )}
            <div
              className={cn(
                'flex flex-wrap items-center gap-x-3 gap-y-1 tablet:gap-x-4',
                isCompact ? 'text-md-medium' : 'text-lg-medium'
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <StarIcon
                  className={cn(
                    'shrink-0 text-yellow-100',
                    isCompact ? 'size-5' : 'size-6'
                  )}
                  aria-hidden
                />
                <span className="text-black-300">{ratingLabel}</span>
                <span className="text-gray-300">
                  ({mover.reviewCount.toLocaleString('ko-KR')})
                </span>
              </span>
              {showCareerAndConfirmed ? (
                <>
                  <span
                    aria-hidden
                    className="hidden h-3.5 w-px bg-line-200 tablet:block"
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-gray-300">{t('profile.career')}</span>
                    <span className="text-black-300">{careerLabel}</span>
                  </span>
                  <span
                    aria-hidden
                    className="hidden h-3.5 w-px bg-line-200 tablet:block"
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-black-300">{confirmedLabel}</span>
                    <span className="text-gray-300">{t('profile.confirmed')}</span>
                  </span>
                </>
              ) : null}
            </div>
          </div>

          <motion.div
            className="relative z-10"
            {...(shouldReduceMotion ? {} : tapScale)}
          >
            <FavoriteButton
              variant="count"
              isFavorited={mover.isFavorited}
              favoritedCount={mover.favoritedCount}
              isPending={isFavoritePending}
              onClick={handleFavoriteClick}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.article>
  );
};
