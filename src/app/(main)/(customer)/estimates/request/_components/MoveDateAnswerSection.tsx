
import { Calendar } from '@/components/ui/Calendar/Calendar';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';

import { EstimateRequestChatBubbleGroup } from './EstimateRequestChatBubbleGroup';
import { InlineErrorMessage } from './InlineErrorMessage';

import type { ReactNode } from 'react';

const MOVE_DATE_PROMPT = '이사 예정일을 선택해주세요.';

interface MoveDateAnswerSectionProps {
  moveDateLabel: string | null;
  isRevisingMoveDate: boolean;
  isSubmitting: boolean;
  startReviseMoveDate: () => void;
  draftDate: Date | undefined;
  setDraftDate: (date: Date | undefined) => void;
  minMoveDate: Date | undefined;
  dateConfirmDisabled: boolean;
  errorMessage: string | null;
  confirmMoveDateRevise: (date: Date) => Promise<void>;
  /** 날짜 수정 모드가 아닐 때 이 자리에 이어서 렌더할 다음 질문 블록 */
  children: ReactNode;
}

/** AddressStep 전용 — 이사일자 답변 + 수정하기 + 수정용 Calendar */
export const MoveDateAnswerSection = ({
  moveDateLabel,
  isRevisingMoveDate,
  isSubmitting,
  startReviseMoveDate,
  draftDate,
  setDraftDate,
  minMoveDate,
  dateConfirmDisabled,
  errorMessage,
  confirmMoveDateRevise,
  children,
}: MoveDateAnswerSectionProps) => {
  return (
    <>
      {/* 시스템: 날짜 프롬프트 */}
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat>{MOVE_DATE_PROMPT}</TextFieldChat>
      </EstimateRequestChatBubbleGroup>

      {/* 유저: 날짜 답변 + 수정하기 (날짜 수정 모드 중에는 숨김) */}
      {moveDateLabel && !isRevisingMoveDate ? (
        <EstimateRequestChatBubbleGroup align="end">
          <TextFieldChat color="mePrimary">{moveDateLabel}</TextFieldChat>
          <button
            type="button"
            className="pr-2 text-xs-medium text-gray-500 underline md:text-lg-medium"
            disabled={isSubmitting}
            onClick={startReviseMoveDate}
          >
            수정하기
          </button>
        </EstimateRequestChatBubbleGroup>
      ) : null}

      {isRevisingMoveDate ? (
        <div className="flex w-full flex-col gap-2 md:items-end">
          <Calendar
            className="max-w-[20.4375rem] md:max-w-[40rem]"
            value={draftDate}
            onValueChange={setDraftDate}
            minDate={minMoveDate}
            confirmDisabled={dateConfirmDisabled}
            confirmLabel={isSubmitting ? '저장 중…' : '선택완료'}
            onConfirm={(date) => {
              void confirmMoveDateRevise(date);
            }}
          />
          <InlineErrorMessage message={errorMessage} />
        </div>
      ) : (
        children
      )}
    </>
  );
};
