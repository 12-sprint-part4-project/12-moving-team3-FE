'use client';

import { Button } from '@/components/Button/Button';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import type { AddressDraft } from './EstimateRequestAddressModal';

interface AddressSideFieldProps {
  label: string;
  emptyLabel: string;
  draft: AddressDraft | null | undefined;
  disabled?: boolean;
  onSelect?: () => void;
  onRevise?: () => void;
  className?: string;
}

/** 한쪽(출발/도착) 라벨 + outlined CTA + 수정하기 */
export const AddressSideField = ({
  label,
  emptyLabel,
  draft,
  disabled = false,
  onSelect,
  onRevise,
  className,
}: AddressSideFieldProps) => {
  const { t } = useTranslation();
  const isFilled = Boolean(draft?.address);

  return (
    <div
      className={cn(
        'flex w-full flex-col',
        isFilled ? 'gap-2' : 'gap-2 md:gap-4',
        className
      )}
    >
      <div className="flex w-full flex-col gap-2 md:gap-4">
        <p className="text-md-medium text-black-400 md:text-2lg-medium">
          {label}
        </p>
        <Button
          type="button"
          variant="outlined"
          size="sm"
          className="justify-start md:!h-16 md:text-xl-semibold"
          disabled={disabled}
          onClick={isFilled ? onRevise : onSelect}
        >
          <span className="truncate text-left">
            {draft?.address ? draft.address : emptyLabel}
          </span>
        </Button>
      </div>

      {isFilled ? (
        <div className="flex w-full justify-end pr-2">
          <button
            type="button"
            className="text-xs-medium text-black-400 underline md:text-lg-medium"
            disabled={disabled}
            onClick={onRevise}
          >
            {t('estimateRequest.revise')}
          </button>
        </div>
      ) : null}
    </div>
  );
};
