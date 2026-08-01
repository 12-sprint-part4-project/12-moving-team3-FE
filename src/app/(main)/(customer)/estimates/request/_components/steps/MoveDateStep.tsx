'use client';

import { useEffect, useState } from 'react';

import { EstimateRequestChatBubbleGroup } from '../EstimateRequestChatBubbleGroup';
import { EstimateRequestChatPanel } from '../EstimateRequestChatPanel';
import { MoveTypeOptionField } from '../MoveTypeOptionField';
import { Button } from '@/components/Button/Button';
import { Calendar } from '@/components/ui/Calendar/Calendar';
import {
  formatDateOnly,
  parseDateOnly,
} from '@/components/ui/Calendar/Calendar.utils';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import { useCustomerEstimateRequest } from '@/hooks/useCustomerEstimateRequest';
import { ApiError } from '@/lib/apiClient';
import type { ApiMoveType } from '@/types/estimateRequest';

/** Step1과 동일 옵션 — 답변 라벨·수정 패널 공용 */
const MOVE_TYPE_OPTIONS: ReadonlyArray<{
  value: ApiMoveType;
  label: string;
}> = [
  { value: 'SMALL', label: '소형이사 (원룸, 투룸, 20평대 미만)' },
  { value: 'HOME', label: '가정이사 (쓰리룸, 20평대 이상)' },
  { value: 'OFFICE', label: '사무실이사 (사무실, 상업공간)' },
];

const INTRO_MESSAGE =
  '몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)';
const MOVE_TYPE_PROMPT_MOBILE = '이사 종류를 알려주세요.';
const MOVE_TYPE_PROMPT_DESKTOP = '이사 종류를 선택해 주세요.';
const MOVE_DATE_PROMPT = '이사 예정일을 선택해주세요.';

/**
 * 스텝2 — 이사 예정일 선택.
 * 선택완료: 최초 saveStep(step:2) / 재수정 reviseField(moveDate).
 * 이사종류 수정하기: reviseField(moveType) 후 Calendar 복귀 (visualStep 유지).
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
  const moveTypeLabel =
    MOVE_TYPE_OPTIONS.find((option) => option.value === moveType)?.label ??
    null;

  const [draftDate, setDraftDate] = useState<Date | undefined>(() =>
    detail?.moveDate ? parseDateOnly(detail.moveDate) : undefined
  );
  const [isRevisingMoveType, setIsRevisingMoveType] = useState(false);
  const [draftMoveType, setDraftMoveType] = useState<ApiMoveType | null>(
    moveType
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // SSR/클라이언트 시각·시간대 불일치 방지 — 마운트 후 로컬 "오늘"을 minDate로 사용
  const [minMoveDate, setMinMoveDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setMinMoveDate(new Date());
  }, []);

  const isSubmitting = isSavingStep || isRevisingField;
  const canConfirmMoveType =
    draftMoveType != null && !isSubmitting && detail != null;

  const handleStartReviseMoveType = () => {
    setErrorMessage(null);
    setDraftMoveType(moveType);
    setIsRevisingMoveType(true);
  };

  const handleConfirmMoveType = async () => {
    if (!detail || !draftMoveType) {
      return;
    }

    setErrorMessage(null);

    try {
      await reviseField({
        estimateRequestId: detail.id,
        body: { field: 'moveType', value: draftMoveType },
      });
      // syncDetail 후에도 currentStep 유지 → visualStep=2, Calendar 복귀
      setIsRevisingMoveType(false);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '이사 종류 수정 중 오류가 발생했습니다.';
      setErrorMessage(message);
    }
  };

  const handleConfirmDate = async (date: Date) => {
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

      {/* 유저: Step1 답변 + 수정하기 (수정 모드 중에는 숨김) */}
      {moveTypeLabel && !isRevisingMoveType ? (
        <EstimateRequestChatBubbleGroup align="end">
          <TextFieldChat color="mePrimary">{moveTypeLabel}</TextFieldChat>
          <button
            type="button"
            className="pr-2 text-xs-medium text-gray-500 underline md:text-lg-medium"
            disabled={isSubmitting}
            onClick={handleStartReviseMoveType}
          >
            수정하기
          </button>
        </EstimateRequestChatBubbleGroup>
      ) : null}

      {isRevisingMoveType ? (
        /* 이사종류 재선택 — Calendar 자리에 Step1 옵션 UI 재사용 */
        <EstimateRequestChatPanel>
          <div
            role="radiogroup"
            aria-label="이사 종류"
            className="flex w-full flex-col gap-2 md:gap-4"
          >
            {MOVE_TYPE_OPTIONS.map((option) => (
              <MoveTypeOptionField
                key={option.value}
                name="moveTypeRevise"
                value={option.value}
                label={option.label}
                selected={draftMoveType === option.value}
                disabled={isSubmitting}
                onSelect={setDraftMoveType}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="solid"
            size="sm"
            className="md:h-16 md:text-xl-semibold"
            disabled={!canConfirmMoveType}
            aria-busy={isRevisingField}
            onClick={() => {
              void handleConfirmMoveType();
            }}
          >
            {isRevisingField ? '저장 중…' : '선택완료'}
          </Button>

          {errorMessage ? (
            <p className="text-md-medium text-red-200" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </EstimateRequestChatPanel>
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
                void handleConfirmDate(date);
              }}
            />
            {errorMessage ? (
              <p className="text-md-medium text-red-200" role="alert">
                {errorMessage}
              </p>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
};
