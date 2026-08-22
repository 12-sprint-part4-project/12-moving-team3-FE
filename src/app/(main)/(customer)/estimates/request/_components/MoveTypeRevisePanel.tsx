'use client';

import { Button } from '@/components/Button/Button';
import { useTranslation } from '@/i18n/useTranslation';

import { EstimateRequestChatPanel } from './EstimateRequestChatPanel';
import { InlineErrorMessage } from './InlineErrorMessage';
import { MoveTypeOptionField } from './MoveTypeOptionField';

import type { MoveTypeSelectOption } from '@/constants/estimateRequestOptions';
import type { ApiMoveType } from '@/types/estimateRequest';

interface MoveTypeRevisePanelProps {
  options: ReadonlyArray<MoveTypeSelectOption>;
  draftMoveType: ApiMoveType | null;
  onSelect: (value: ApiMoveType) => void;
  isSubmitting: boolean;
  isRevisingField: boolean;
  canConfirm: boolean;
  errorMessage: string | null;
  onConfirm: () => void;
}

/**
 * 이사종류 「수정하기」 시 노출되는 재선택 패널.
 * Step2·Step3에서 Calendar/주소 카드 자리에 Step1 옵션 UI를 재사용한다.
 */
export const MoveTypeRevisePanel = ({
  options,
  draftMoveType,
  onSelect,
  isSubmitting,
  isRevisingField,
  canConfirm,
  errorMessage,
  onConfirm,
}: MoveTypeRevisePanelProps) => {
  const { t } = useTranslation();

  return (
    <EstimateRequestChatPanel>
      <div
        role="radiogroup"
        aria-label={t('estimateRequest.moveTypeAria')}
        className="flex w-full flex-col gap-2 md:gap-4"
      >
        {options.map((option) => (
          <MoveTypeOptionField
            key={option.value}
            name="moveTypeRevise"
            value={option.value}
            label={`${t(`moveType.${option.value}`)} ${t(`moveType.detail.${option.value}`)}`}
            selected={draftMoveType === option.value}
            disabled={isSubmitting}
            onSelect={onSelect}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="solid"
        size="sm"
        className="md:h-16 md:text-xl-semibold"
        disabled={!canConfirm}
        aria-busy={isRevisingField}
        onClick={onConfirm}
      >
        {isRevisingField
          ? t('estimateRequest.saving')
          : t('estimateRequest.selectComplete')}
      </Button>

      <InlineErrorMessage message={errorMessage} />
    </EstimateRequestChatPanel>
  );
};
