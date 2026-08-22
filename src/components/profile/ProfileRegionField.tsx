'use client';

import { RegionChip } from '@/components/ui/Chip';
import { RequiredLabel } from '@/components/ui/RequiredLabel/RequiredLabel';
import {
  REGION_CHIP_OPTIONS,
  type RegionChipValue,
} from '@/constants/commonOptions';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

interface ProfileRegionFieldProps {
  selectedRegions: RegionChipValue[];
  onSelect: (value: RegionChipValue) => void;
  label: string;
  helperText?: string;
  className?: string;
}

/** 지역 칩 선택 필드. 단일/다중 선택은 부모가 결정한다. */
export const ProfileRegionField = ({
  selectedRegions,
  onSelect,
  label,
  helperText,
  className = '',
}: ProfileRegionFieldProps) => {
  const { t } = useTranslation();

  return (
    <section
      className={cn(
        'flex w-full flex-col items-start gap-4',
        helperText ? 'gap-6 lg:gap-8' : '',
        className
      )}
    >
      {helperText ? (
        <div className="flex w-full flex-col items-start gap-2">
          <RequiredLabel>{label}</RequiredLabel>
          <p className="text-xs-regular text-gray-400 lg:text-lg-regular">
            {helperText}
          </p>
        </div>
      ) : (
        <RequiredLabel>{label}</RequiredLabel>
      )}
      <div className="flex flex-wrap gap-x-2 gap-y-3 lg:gap-x-3.5 lg:gap-y-[1.125rem]">
        {REGION_CHIP_OPTIONS.map((option) => (
          <RegionChip
            key={option.value}
            variant="button"
            isSelected={selectedRegions.includes(option.value)}
            onClick={() => onSelect(option.value)}
            className="px-3 py-1.5 text-md-medium lg:px-5 lg:py-2.5 lg:text-2lg-medium"
          >
            {t(`region.${option.value}`)}
          </RegionChip>
        ))}
      </div>
    </section>
  );
};
