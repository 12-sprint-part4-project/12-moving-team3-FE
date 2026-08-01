'use client';

import { useState } from 'react';

import { EstimateRequestChatBubbleGroup } from '../EstimateRequestChatBubbleGroup';
import { Calendar } from '@/components/ui/Calendar/Calendar';
import {
  formatDateOnly,
  parseDateOnly,
} from '@/components/ui/Calendar/Calendar.utils';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import { useCustomerEstimateRequest } from '@/hooks/useCustomerEstimateRequest';
import { ApiError } from '@/lib/apiClient';
import type { ApiMoveType } from '@/types/estimateRequest';

/** Step1과 동일 라벨 — 답변 말풍선 표시용 */
const MOVE_TYPE_LABELS: Record<ApiMoveType, string> = {
  SMALL: '소형이사 (원룸, 투룸, 20평대 미만)',
  HOME: '가정이사 (쓰리룸, 20평대 이상)',
  OFFICE: '사무실이사 (사무실, 상업공간)',
};

const INTRO_MESSAGE =
  '몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)';
const MOVE_TYPE_PROMPT_MOBILE = '이사 종류를 알려주세요.';
const MOVE_TYPE_PROMPT_DESKTOP = '이사 종류를 선택해 주세요.';
const MOVE_DATE_PROMPT = '이사 예정일을 선택해주세요.';

/**
 * 스텝2 — 이사 예정일 선택 (Figma 1-4007).
 * 선택완료: 최초 saveStep(step:2) / 재수정 reviseField(moveDate).
 */
export const MoveDateStep = () => {
  const {
    bootstrap,
    saveStep,
    reviseField,
    isSavingStep,
    isRevisingField,
  } = useCustomerEstimateRequest();
  const detail = bootstrap.detail;
  const moveType = detail?.moveType ?? null;
  const moveTypeLabel = moveType ? MOVE_TYPE_LABELS[moveType] : null;

  const [draftDate, setDraftDate] = useState<Date | undefined>(() =>
    detail?.moveDate ? parseDateOnly(detail.moveDate) : undefined
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSubmitting = isSavingStep || isRevisingField;

  const handleConfirm = async (date: Date) => {
    if (!detail) {
      return;
    }

    setDraftDate(date);
    setErrorMessage(null);
    const moveDate = formatDateOnly(date);

    try {
      // 이미 저장된 날짜면 field 재수정, 아니면 step 전진
      if (detail.moveDate != null) {
        await reviseField({
          estimateRequestId: detail.id,
          body: { field: 'moveDate', value: moveDate },
        });
      } else {
        await saveStep({
          estimateRequestId: detail.id,
          body: { step: 2, data: { moveDate } },
        });
      }
      // 성공 시 syncDetail → visualStep=3 → AddressStep
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '이사 예정일 저장 중 오류가 발생했습니다.';
      setErrorMessage(message);
    }
  };

  return (
    <section
      aria-label="이사 일자 선택"
      className="mx-auto flex w-full max-w-[375px] flex-col gap-2 px-6 md:max-w-[1448px] md:gap-6"
    >
      {/* 시스템: 안내 + 이사종류 질문 */}
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat>{INTRO_MESSAGE}</TextFieldChat>
        <TextFieldChat desktopChildren={MOVE_TYPE_PROMPT_DESKTOP}>
          {MOVE_TYPE_PROMPT_MOBILE}
        </TextFieldChat>
      </EstimateRequestChatBubbleGroup>

      {/* 유저: Step1 답변 + 수정하기 (동선은 스프린트 D) */}
      {moveTypeLabel ? (
        <EstimateRequestChatBubbleGroup align="end">
          <TextFieldChat color="mePrimary">{moveTypeLabel}</TextFieldChat>
          <button
            type="button"
            className="pr-2 text-xs-medium text-gray-500 underline md:text-lg-medium"
            // 스프린트 D에서 reviseField(moveType) 연동
            onClick={() => {}}
          >
            수정하기
          </button>
        </EstimateRequestChatBubbleGroup>
      ) : null}

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
          minDate={new Date()}
          confirmDisabled={isSubmitting || detail == null}
          confirmLabel={isSubmitting ? '저장 중…' : '선택완료'}
          onConfirm={(date) => {
            void handleConfirm(date);
          }}
        />
        {errorMessage ? (
          <p className="text-md-medium text-red-200" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </section>
  );
};
