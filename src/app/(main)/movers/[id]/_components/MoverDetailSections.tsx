'use client';

import { RegionChip } from '@/components/ui/Chip/RegionChip';
import { ServiceChip } from '@/components/ui/Chip/ServiceChip';
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
  const description =
    mover.description?.trim() || '등록된 상세설명이 없습니다.';

  return (
    <div className={cn('flex w-full flex-col', className)}>
      <section className="flex flex-col gap-4 border-b border-line-100 py-6 lg:gap-8 lg:py-10">
        <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
          상세설명
        </h2>
        <p className="text-md-medium whitespace-pre-wrap text-black-300 lg:text-2lg-medium">
          {description}
        </p>
      </section>

      <section className="flex flex-col gap-4 border-b border-line-100 py-6 lg:gap-8 lg:py-10">
        <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
          제공 서비스
        </h2>
        {mover.services.length > 0 ? (
          <div className="flex flex-wrap gap-2 lg:gap-3">
            {mover.services.map((service: ApiMoveType) => (
              <ServiceChip key={service} variant="textOnly">
                {SERVICE_LABELS[service]}
              </ServiceChip>
            ))}
          </div>
        ) : (
          <p className="text-md-medium text-gray-300 lg:text-2lg-medium">
            서비스 미등록
          </p>
        )}
      </section>

      <section className="flex flex-col gap-4 border-b border-line-100 py-6 lg:gap-8 lg:py-10">
        <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
          서비스 가능 지역
        </h2>
        {mover.regions.length > 0 ? (
          <div className="flex flex-wrap gap-2 lg:gap-3">
            {mover.regions.map((region: ApiRegion) => (
              <RegionChip key={region} variant="textOnly">
                {REGION_LABELS[region]}
              </RegionChip>
            ))}
          </div>
        ) : (
          <p className="text-md-medium text-gray-300 lg:text-2lg-medium">
            지역 미등록
          </p>
        )}
      </section>
    </div>
  );
};
