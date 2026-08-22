'use client';

import { ServiceChip } from '@/components/ui/Chip';
import { RequiredLabel } from '@/components/ui/RequiredLabel/RequiredLabel';
import {
  SERVICE_CHIP_OPTIONS,
  type ServiceChipValue,
} from '@/constants/commonOptions';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

interface ProfileServiceFieldProps {
  selectedServices: ServiceChipValue[];
  onToggle: (value: ServiceChipValue) => void;
  label: string;
  helperText?: string;
  className?: string;
}

/** 서비스 칩 다중 선택 필드 */
export const ProfileServiceField = ({
  selectedServices,
  onToggle,
  label,
  helperText,
  className = '',
}: ProfileServiceFieldProps) => {
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
        <div className="flex flex-col items-start gap-2">
          <RequiredLabel>{label}</RequiredLabel>
          <p className="text-xs-regular text-gray-400 lg:text-lg-regular">
            {helperText}
          </p>
        </div>
      ) : (
        <RequiredLabel>{label}</RequiredLabel>
      )}
      <div className="flex flex-wrap gap-1.5 lg:gap-3">
        {SERVICE_CHIP_OPTIONS.map((option) => (
          <ServiceChip
            key={option.value}
            variant="button"
            isSelected={selectedServices.includes(option.value)}
            onClick={() => onToggle(option.value)}
            className="px-3 py-1.5 text-md-medium lg:px-5 lg:py-2.5 lg:text-2lg-medium"
          >
            {t(`moveType.${option.value}`)}
          </ServiceChip>
        ))}
      </div>
    </section>
  );
};
