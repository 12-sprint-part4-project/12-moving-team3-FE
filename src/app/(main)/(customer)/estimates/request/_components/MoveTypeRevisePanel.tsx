import { EstimateRequestChatPanel } from './EstimateRequestChatPanel';
import { InlineErrorMessage } from './InlineErrorMessage';
import { MoveTypeOptionField } from './MoveTypeOptionField';
import { Button } from '@/components/Button/Button';
import type { ApiMoveType } from '@/types/estimateRequest';

interface MoveTypeOption {
  value: ApiMoveType;
  label: string;
}

interface MoveTypeRevisePanelProps {
  options: ReadonlyArray<MoveTypeOption>;
  draftMoveType: ApiMoveType | null;
  onSelect: (value: ApiMoveType) => void;
  isSubmitting: boolean;
  isRevisingField: boolean;
  canConfirm: boolean;
  errorMessage: string | null;
  onConfirm: () => void;
}

/**
 * Step2에서 이사종류 「수정하기」 시 노출되는 재선택 패널.
 * Calendar 자리에 Step1 옵션 UI를 재사용한다.
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
  return (
    <EstimateRequestChatPanel>
      <div
        role="radiogroup"
        aria-label="이사 종류"
        className="flex w-full flex-col gap-2 md:gap-4"
      >
        {options.map((option) => (
          <MoveTypeOptionField
            key={option.value}
            name="moveTypeRevise"
            value={option.value}
            label={option.label}
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
        {isRevisingField ? '저장 중…' : '선택완료'}
      </Button>

      <InlineErrorMessage message={errorMessage} />
    </EstimateRequestChatPanel>
  );
};
