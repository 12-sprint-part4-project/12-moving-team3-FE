'use client';

import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { useTranslation } from '@/i18n/useTranslation';

import type { MoveTypeOption } from '@/types/estimateRequest';

export type QuoteChipStatus = 'pending' | 'confirmed' | 'rejected';

export interface QuoteStatusChipsProps {
  status?: QuoteChipStatus | null;
  moveType?: MoveTypeOption | null;
  isDesignated?: boolean;
  size: 'sm' | 'md';
  useShortMoveTypeLabel?: boolean;
  /** 상태 칩 라벨. 없으면 status 기본값 */
  statusLabel?: string;
  /** 지정 견적 칩 라벨. 없으면 칩 기본값 */
  designatedLabel?: string;
}

/** 견적 상태·이사유형·지정 견적 칩 */
export const QuoteStatusChips = ({
  status = null,
  moveType = null,
  isDesignated = false,
  size,
  useShortMoveTypeLabel = false,
  statusLabel,
  designatedLabel,
}: QuoteStatusChipsProps) => {
  const { t } = useTranslation();
  const STATUS_CHIP = {
    pending: { type: 'quotePending' as const, label: t('quoteStatus.pending') },
    confirmed: {
      type: 'quoteConfirmed' as const,
      label: t('quoteStatus.confirmedQuote'),
    },
    rejected: {
      type: 'quoteRejected' as const,
      label: t('quoteStatus.rejected'),
    },
  };
  const MOVE_TYPE_SHORT_LABEL: Record<MoveTypeOption, string> = {
    small: t('moveType.smallShort'),
    home: t('moveType.homeShort'),
    office: t('moveType.officeShort'),
  };
  const statusChip = status ? STATUS_CHIP[status] : null;

  return (
    <>
      {statusChip ? (
        <MoveTypeChip type={statusChip.type} size={size}>
          {statusLabel ?? statusChip.label}
        </MoveTypeChip>
      ) : null}
      {moveType ? (
        <MoveTypeChip type={moveType} size={size}>
          {useShortMoveTypeLabel ? MOVE_TYPE_SHORT_LABEL[moveType] : null}
        </MoveTypeChip>
      ) : null}
      {isDesignated ? (
        <MoveTypeChip type="designated" size={size}>
          {designatedLabel}
        </MoveTypeChip>
      ) : null}
    </>
  );
};

export interface QuoteStatusChipRowProps {
  status?: QuoteChipStatus | null;
  moveType?: MoveTypeOption | null;
  isDesignated?: boolean;
  statusLabel?: string;
  /** 모바일 지정 견적 짧은 라벨. 데스크톱은 칩 기본값 */
  shortDesignatedLabel?: string;
}

/** 모바일 sm·짧은 라벨 / 데스크톱 md·기본 라벨 */
export const QuoteStatusChipRow = ({
  status = null,
  moveType = null,
  isDesignated = false,
  statusLabel,
  shortDesignatedLabel,
}: QuoteStatusChipRowProps) => (
  <>
    <div className="flex w-full flex-wrap items-center gap-2 lg:hidden">
      <QuoteStatusChips
        status={status}
        moveType={moveType}
        isDesignated={isDesignated}
        size="sm"
        useShortMoveTypeLabel
        statusLabel={statusLabel}
        designatedLabel={shortDesignatedLabel}
      />
    </div>
    <div className="hidden w-full flex-wrap items-center gap-3 lg:flex">
      <QuoteStatusChips
        status={status}
        moveType={moveType}
        isDesignated={isDesignated}
        size="md"
        statusLabel={statusLabel}
      />
    </div>
  </>
);
