'use client';

import { RegionChip } from '@/components/ui/Chip';
import { RequiredLabel } from '@/components/ui/RequiredLabel/RequiredLabel';
import { REGION_CHIP_OPTIONS } from '@/constants/commonOptions';
import { cn } from '@/lib/utils';

import type { CustomerRegion } from '@/types/customerProfile';

interface CustomerProfileRegionFieldProps {
  selectedRegion: CustomerRegion | null;
  helperText: string;
  onSelect: (value: CustomerRegion) => void;
  className?: string;
}

/** 거주 지역 단일 선택 칩. 같은 칩을 다시 누르면 해제한다. */
export const CustomerProfileRegionField = ({
  selectedRegion,
  helperText,
  onSelect,
  className = '',
}: CustomerProfileRegionFieldProps) => {
  return (
    <section
      className={cn(
        'flex w-full flex-col items-start gap-6 lg:gap-8',
        className
      )}
    >
      <div className="flex w-full flex-col items-start gap-2">
        <RequiredLabel>내가 사는 지역</RequiredLabel>
        <p className="text-xs-regular text-gray-400 lg:text-lg-regular">
          {helperText}
        </p>
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-3 lg:gap-x-3.5 lg:gap-y-[1.125rem]">
        {REGION_CHIP_OPTIONS.map((option) => (
          <RegionChip
            key={option.value}
            variant="button"
            isSelected={selectedRegion === option.value}
            onClick={() => onSelect(option.value)}
            className="px-3 py-1.5 text-md-medium lg:px-5 lg:py-2.5 lg:text-2lg-medium"
          >
            {option.label}
          </RegionChip>
        ))}
      </div>
    </section>
  );
};
