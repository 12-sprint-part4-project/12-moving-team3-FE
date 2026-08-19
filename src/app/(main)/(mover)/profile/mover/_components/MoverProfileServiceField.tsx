'use client';

import { ServiceChip } from '@/components/ui/Chip';
import { RequiredLabel } from '@/components/ui/RequiredLabel/RequiredLabel';
import { SERVICE_CHIP_OPTIONS } from '@/constants/commonOptions';
import { cn } from '@/lib/utils';

import type { MoverServiceType } from '@/types/moverProfile';

interface MoverProfileServiceFieldProps {
  selectedServices: MoverServiceType[];
  onToggle: (value: MoverServiceType) => void;
  className?: string;
}

/** 제공 서비스 다중 선택 칩 */
export const MoverProfileServiceField = ({
  selectedServices,
  onToggle,
  className = '',
}: MoverProfileServiceFieldProps) => {
  return (
    <section
      className={cn('flex w-full flex-col items-start gap-4', className)}
    >
      <RequiredLabel>제공 서비스</RequiredLabel>
      <div className="flex flex-wrap gap-1.5 lg:gap-3">
        {SERVICE_CHIP_OPTIONS.map((option) => (
          <ServiceChip
            key={option.value}
            variant="button"
            isSelected={selectedServices.includes(option.value)}
            onClick={() => onToggle(option.value)}
            className="px-3 py-1.5 text-md-medium lg:px-5 lg:py-2.5 lg:text-2lg-medium"
          >
            {option.label}
          </ServiceChip>
        ))}
      </div>
    </section>
  );
};
