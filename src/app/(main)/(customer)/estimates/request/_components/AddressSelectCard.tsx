import { Button } from '@/components/Button/Button';
import { cn } from '@/lib/utils';

import type { AddressDraft } from './EstimateRequestAddressModal';

export interface AddressSelectCardProps {
  departure?: AddressDraft | null;
  arrival?: AddressDraft | null;
  /** 출발지 선택/수정 */
  onSelectDeparture?: () => void;
  /** 도착지 선택/수정 */
  onSelectArrival?: () => void;
  /**
   * 양쪽 채워진 뒤 CTA (스프린트 C: 로컬만 / D에서 saveStep).
   * 라벨은 시안 「견적 확정하기」.
   */
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  confirmLabel?: string;
  className?: string;
}

/**
 * Step3 출발/도착 선택 카드 — empty / filled (Figma input/견적요청_주소).
 */
export const AddressSelectCard = ({
  departure = null,
  arrival = null,
  onSelectDeparture,
  onSelectArrival,
  onConfirm,
  confirmDisabled = false,
  confirmLabel = '견적 확정하기',
  className = '',
}: AddressSelectCardProps) => {
  const hasDeparture = Boolean(departure?.address);
  const hasArrival = Boolean(arrival?.address);
  const showConfirm = hasDeparture && hasArrival;

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-6 md:gap-[1.3125rem]',
        className
      )}
    >
      {/* 출발지 */}
      <AddressSideField
        label="출발지"
        emptyLabel="출발지 선택하기"
        draft={departure}
        onSelect={onSelectDeparture}
        onRevise={onSelectDeparture}
      />

      {/* 도착지 */}
      <AddressSideField
        label="도착지"
        emptyLabel="도착지 선택하기"
        draft={arrival}
        onSelect={onSelectArrival}
        onRevise={onSelectArrival}
      />

      {showConfirm ? (
        <Button
          type="button"
          variant="solid"
          size="sm"
          className="md:!h-16 md:text-xl-semibold"
          disabled={confirmDisabled}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      ) : null}
    </div>
  );
};

interface AddressSideFieldProps {
  label: string;
  emptyLabel: string;
  draft: AddressDraft | null | undefined;
  onSelect?: () => void;
  onRevise?: () => void;
}

/** 한쪽(출발/도착) 라벨 + outlined CTA + 수정하기 */
const AddressSideField = ({
  label,
  emptyLabel,
  draft,
  onSelect,
  onRevise,
}: AddressSideFieldProps) => {
  const isFilled = Boolean(draft?.address);

  return (
    <div
      className={cn(
        'flex w-full flex-col',
        isFilled ? 'gap-2' : 'gap-2 md:gap-4'
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
          onClick={isFilled ? onRevise : onSelect}
        >
          <span className="truncate text-left">
            {isFilled ? draft!.address : emptyLabel}
          </span>
        </Button>
      </div>

      {isFilled ? (
        <div className="flex w-full justify-end pr-2">
          <button
            type="button"
            className="text-xs-medium text-black-400 underline md:text-lg-medium"
            onClick={onRevise}
          >
            수정하기
          </button>
        </div>
      ) : null}
    </div>
  );
};
