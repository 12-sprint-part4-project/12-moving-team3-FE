'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { RegionChip } from '@/components/ui/Chip/RegionChip';
import { ServiceChip } from '@/components/ui/Chip/ServiceChip';
import { fadeUp, getMotionTransition, listStagger } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';
import {
  REGION_LABELS,
  SERVICE_LABELS,
  type ApiMoveType,
  type ApiRegion,
  type MoverCardModel,
} from '@/types/mover';

export interface MoverDetailSectionsProps {
  mover: MoverCardModel;
  className?: string;
}

/** 상세설명 · 제공 서비스 · 서비스 가능 지역 */
export const MoverDetailSections = ({
  mover,
  className = '',
}: MoverDetailSectionsProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const description =
    mover.description?.trim() || '등록된 상세설명이 없습니다.';

  return (
    <div className={cn('flex w-full flex-col', className)}>
      <section className="flex flex-col gap-4 border-b border-line-100 py-6 xl:gap-8 xl:py-10">
        <h2 className="text-lg-semibold text-black-400 xl:text-2xl-semibold">
          상세설명
        </h2>
        <p className="text-md-medium whitespace-pre-wrap text-black-300 xl:text-2lg-medium">
          {description}
        </p>
      </section>

      <section className="flex flex-col gap-4 border-b border-line-100 py-6 xl:gap-8 xl:py-10">
        <h2 className="text-lg-semibold text-black-400 xl:text-2xl-semibold">
          제공 서비스
        </h2>
        {mover.services.length > 0 ? (
          <motion.div
            variants={listStagger}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-2 xl:gap-3"
          >
            {mover.services.map((service: ApiMoveType, index) => (
              <motion.div
                key={service}
                variants={fadeUp}
                transition={{
                  ...motionTransition,
                  delay: shouldReduceMotion ? 0 : index * 0.04,
                }}
              >
                <ServiceChip variant="textOnly">
                  {SERVICE_LABELS[service]}
                </ServiceChip>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-md-medium text-gray-300 xl:text-2lg-medium">
            서비스 미등록
          </p>
        )}
      </section>

      <section className="flex flex-col gap-4 border-b border-line-100 py-6 xl:gap-8 xl:py-10">
        <h2 className="text-lg-semibold text-black-400 xl:text-2xl-semibold">
          서비스 가능 지역
        </h2>
        {mover.regions.length > 0 ? (
          <motion.div
            variants={listStagger}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-2 xl:gap-3"
          >
            {mover.regions.map((region: ApiRegion, index) => (
              <motion.div
                key={region}
                variants={fadeUp}
                transition={{
                  ...motionTransition,
                  delay: shouldReduceMotion ? 0 : index * 0.04,
                }}
              >
                <RegionChip variant="textOnly">
                  {REGION_LABELS[region]}
                </RegionChip>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-md-medium text-gray-300 xl:text-2lg-medium">
            지역 미등록
          </p>
        )}
      </section>
    </div>
  );
};
