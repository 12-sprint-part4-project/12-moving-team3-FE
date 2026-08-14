'use client';

import { Calendar } from '@/components/ui/Calendar/Calendar';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import { useMoveInfoRevise } from '@/hooks/useMoveInfoRevise';

import { EstimateRequestChatBubbleGroup } from '../EstimateRequestChatBubbleGroup';
import { InlineErrorMessage } from '../InlineErrorMessage';
import { MoveTypeAnswerSection } from '../MoveTypeAnswerSection';

const MOVE_DATE_PROMPT = '이사 예정일을 선택해주세요.';

/**
 * 스텝2 — 이사 예정일 선택.
 * 선택완료: 최초 saveStep(step:2) / 재수정 reviseField(moveDate).
 * 이사종류 수정하기: useMoveInfoRevise → Calendar 복귀 (visualStep 유지).
 */
export const MoveDateStep = () => {
  const {
    detail,
    moveTypeLabel,
    moveTypeOptions,
    draftMoveType,
    setDraftMoveType,
    isRevisingMoveType,
    draftDate,
    setDraftDate,
    minMoveDate,
    errorMessage,
    isSubmitting,
    isRevisingField,
    canConfirmMoveType,
    startReviseMoveType,
    confirmMoveType,
    confirmMoveDate,
  } = useMoveInfoRevise();

  return (
    <section
      aria-label="이사 일자 선택"
      className="page-content flex flex-col gap-2 md:gap-6"
    >
      <MoveTypeAnswerSection
        moveTypeLabel={moveTypeLabel}
        isRevisingMoveType={isRevisingMoveType}
        isSubmitting={isSubmitting}
        startReviseMoveType={startReviseMoveType}
        moveTypeOptions={moveTypeOptions}
        draftMoveType={draftMoveType}
        setDraftMoveType={setDraftMoveType}
        isRevisingField={isRevisingField}
        canConfirmMoveType={canConfirmMoveType}
        errorMessage={errorMessage}
        confirmMoveType={confirmMoveType}
      >
        {/* 시스템: 날짜 선택 프롬프트 */}
        <EstimateRequestChatBubbleGroup>
          <TextFieldChat>{MOVE_DATE_PROMPT}</TextFieldChat>
        </EstimateRequestChatBubbleGroup>

        {/* Calendar 자체 카드 — ChatPanel로 감싸지 않음, md+ 우측 정렬 */}
        <div className="flex w-full flex-col gap-2 md:items-end">
          <Calendar
            className="max-w-[20.4375rem] md:max-w-[40rem]"
            value={draftDate}
            onValueChange={setDraftDate}
            minDate={minMoveDate}
            confirmDisabled={isSubmitting || detail == null}
            confirmLabel={isSubmitting ? '저장 중…' : '선택완료'}
            onConfirm={(date) => {
              void confirmMoveDate(date);
            }}
          />
          <InlineErrorMessage message={errorMessage} />
        </div>
      </MoveTypeAnswerSection>
    </section>
  );
};
