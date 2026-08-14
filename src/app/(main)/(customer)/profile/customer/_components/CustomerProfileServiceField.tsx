'use client';

import { ServiceChip } from '@/components/ui/Chip';
import { RequiredLabel } from '@/components/ui/RequiredLabel/RequiredLabel';
import { SERVICE_CHIP_OPTIONS } from '@/constants/commonOptions';
import { cn } from '@/lib/utils';

import type { CustomerServiceType } from '@/types/customerProfile';

interface CustomerProfileServiceFieldProps {
  selectedServices: CustomerServiceType[];
  helperText: string;
  onToggle: (value: CustomerServiceType) => void;
  className?: string;
}

/** 이용 서비스 다중 선택 칩 */
export const CustomerProfileServiceField = ({
  selectedServices,
  helperText,
  onToggle,
  className = '',
}: CustomerProfileServiceFieldProps) => {
  return (
    <section
      className={cn(
        'flex w-full flex-col items-start gap-6 lg:gap-8',
        className
      )}
    >
      <div className="flex flex-col items-start gap-2">
        <RequiredLabel>이용 서비스</RequiredLabel>
        <p className="text-xs-regular text-gray-400 lg:text-lg-regular">
          {helperText}
        </p>
      </div>
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
