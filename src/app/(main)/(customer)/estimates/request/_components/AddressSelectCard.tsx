import { Button } from '@/components/Button/Button';
import { cn } from '@/lib/utils';

import { AddressSideField } from './AddressSideField';

import type { AddressDraft } from './EstimateRequestAddressModal';

export interface AddressSelectCardProps {
  departure?: AddressDraft | null;
  arrival?: AddressDraft | null;
  /** 출발지 선택/수정 */
  onSelectDeparture?: () => void;
  /** 도착지 선택/수정 */
  onSelectArrival?: () => void;
  /**
   * 양쪽 채워진 뒤 CTA — 라벨 시안 「견적 확정하기」.
   * AddressStep에서 saveStep(3) + submit 연동.
   */
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  confirmBusy?: boolean;
  confirmLabel?: string;
  /** 저장 중 출발/도착 선택·수정 잠금 */
  selectDisabled?: boolean;
  className?: string;
}

/**
 * Step3 출발/도착 선택 카드 — empty / filled.
 */
export const AddressSelectCard = ({
  departure = null,
  arrival = null,
  onSelectDeparture,
  onSelectArrival,
  onConfirm,
  confirmDisabled = false,
  confirmBusy = false,
  confirmLabel = '견적 확정하기',
  selectDisabled = false,
  className = '',
}: AddressSelectCardProps) => {
  const hasDeparture = Boolean(departure?.address);
  const hasArrival = Boolean(arrival?.address);
  const showConfirm = hasDeparture && hasArrival;

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-6 md:gap-5',
        className
      )}
    >
      {/* 출발지 */}
      <AddressSideField
        label="출발지"
        emptyLabel="출발지 선택하기"
        draft={departure}
        disabled={selectDisabled}
        onSelect={onSelectDeparture}
        onRevise={onSelectDeparture}
      />

      {/* 도착지 */}
      <AddressSideField
        label="도착지"
        emptyLabel="도착지 선택하기"
        draft={arrival}
        disabled={selectDisabled}
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
          aria-busy={confirmBusy}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      ) : null}
    </div>
  );
};
