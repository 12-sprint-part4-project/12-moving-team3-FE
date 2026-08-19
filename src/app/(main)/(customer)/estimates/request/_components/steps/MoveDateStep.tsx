'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { Calendar } from '@/components/ui/Calendar/Calendar';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import { useMoveInfoRevise } from '@/hooks/useMoveInfoRevise';
import { fadeUp, getMotionTransition } from '@/lib/motionVariants';

import { useScrollToActiveSection } from '../../_lib/useScrollToActiveSection';
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
  const { detail, errorMessage, isSubmitting, isRevisingField, moveType, moveDate } =
    useMoveInfoRevise();
  const shouldReduceMotion = useReducedMotion();
  // 스텝 진입·"수정하기" 토글로 활성 섹션이 바뀔 때마다 그 위치로 스크롤
  const bottomRef = useScrollToActiveSection(
    String(moveType.isRevising),
    shouldReduceMotion
  );

  return (
    <section
      aria-label="이사 일자 선택"
      className="page-content flex flex-col gap-2 md:gap-6"
    >
      <MoveTypeAnswerSection
        moveType={moveType}
        isSubmitting={isSubmitting}
        isRevisingField={isRevisingField}
        errorMessage={errorMessage}
      />

      {!moveType.isRevising && (
        <>
          {/* 시스템: 날짜 선택 프롬프트 */}
          <EstimateRequestChatBubbleGroup>
            <TextFieldChat>{MOVE_DATE_PROMPT}</TextFieldChat>
          </EstimateRequestChatBubbleGroup>

          {/* Calendar 자체 카드 — ChatPanel로 감싸지 않음, md+ 우측 정렬 */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={getMotionTransition(shouldReduceMotion)}
            className="flex w-full flex-col gap-2 md:items-end"
          >
            <Calendar
              className="max-w-[20.4375rem] md:max-w-[40rem]"
              value={moveDate.draft}
              onValueChange={moveDate.setDraft}
              minDate={moveDate.min}
              maxDate={moveDate.max}
              confirmDisabled={isSubmitting || detail == null}
              confirmLabel={isSubmitting ? '저장 중…' : '선택완료'}
              onConfirm={(date) => {
                void moveDate.confirmSave(date);
              }}
            />
            <InlineErrorMessage message={errorMessage} />
          </motion.div>
        </>
      )}

      <div ref={bottomRef} aria-hidden />
    </section>
  );
};
