'use client';

import { RegionChip } from '@/components/ui/Chip';
import { RequiredLabel } from '@/components/ui/RequiredLabel/RequiredLabel';
import { REGION_CHIP_OPTIONS } from '@/constants/commonOptions';
import { cn } from '@/lib/utils';

import type { MoverRegion } from '@/types/moverProfile';

interface MoverProfileRegionFieldProps {
  selectedRegions: MoverRegion[];
  onToggle: (value: MoverRegion) => void;
  className?: string;
}

/** 서비스 가능 지역 다중 선택 칩 */
export const MoverProfileRegionField = ({
  selectedRegions,
  onToggle,
  className = '',
}: MoverProfileRegionFieldProps) => {
  return (
    <section
      className={cn('flex w-full flex-col items-start gap-4', className)}
    >
      <RequiredLabel>서비스 가능 지역</RequiredLabel>
      <div className="flex flex-wrap gap-x-2 gap-y-3 lg:gap-x-3.5 lg:gap-y-[1.125rem]">
        {REGION_CHIP_OPTIONS.map((option) => (
          <RegionChip
            key={option.value}
            variant="button"
            isSelected={selectedRegions.includes(option.value)}
            onClick={() => onToggle(option.value)}
            className="px-3 py-1.5 text-md-medium lg:px-5 lg:py-2.5 lg:text-2lg-medium"
          >
            {option.label}
          </RegionChip>
        ))}
      </div>
    </section>
  );
};
