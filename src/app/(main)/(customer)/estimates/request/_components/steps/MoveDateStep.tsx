'use client';

import { Calendar } from '@/components/ui/Calendar/Calendar';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import { useMoveInfoRevise } from '@/hooks/useMoveInfoRevise';

import { EstimateRequestChatBubbleGroup } from '../EstimateRequestChatBubbleGroup';
import { InlineErrorMessage } from '../InlineErrorMessage';
import { MoveTypeRevisePanel } from '../MoveTypeRevisePanel';

const INTRO_MESSAGE =
  '몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)';
const MOVE_TYPE_PROMPT_MOBILE = '이사 종류를 알려주세요.';
const MOVE_TYPE_PROMPT_DESKTOP = '이사 종류를 선택해 주세요.';
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
      {/* 시스템: 안내 + 이사종류 질문 */}
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat>{INTRO_MESSAGE}</TextFieldChat>
        <TextFieldChat desktopChildren={MOVE_TYPE_PROMPT_DESKTOP}>
          {MOVE_TYPE_PROMPT_MOBILE}
        </TextFieldChat>
      </EstimateRequestChatBubbleGroup>

      {/* 유저: Step1 답변 + 수정하기 (수정 모드 중에는 숨김) */}
      {moveTypeLabel && !isRevisingMoveType ? (
        <EstimateRequestChatBubbleGroup align="end">
          <TextFieldChat color="mePrimary">{moveTypeLabel}</TextFieldChat>
          <button
            type="button"
            className="pr-2 text-xs-medium text-gray-500 underline md:text-lg-medium"
            disabled={isSubmitting}
            onClick={startReviseMoveType}
          >
            수정하기
          </button>
        </EstimateRequestChatBubbleGroup>
      ) : null}

      {isRevisingMoveType ? (
        <MoveTypeRevisePanel
          options={moveTypeOptions}
          draftMoveType={draftMoveType}
          onSelect={setDraftMoveType}
          isSubmitting={isSubmitting}
          isRevisingField={isRevisingField}
          canConfirm={canConfirmMoveType}
          errorMessage={errorMessage}
          onConfirm={() => {
            void confirmMoveType();
          }}
        />
      ) : (
        <>
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
        </>
      )}
    </section>
  );
};
