'use client';

import { useState } from 'react';

import {
  formatDateOnly,
  parseDateOnly,
} from '@/components/ui/Calendar/Calendar.utils';
import { useCustomerEstimateRequest } from '@/hooks/useCustomerEstimateRequest';
import { useLocalToday } from '@/hooks/useLocalToday';
import { ApiError } from '@/lib/apiClient';
import type { ApiMoveType } from '@/types/estimateRequest';

/** Step1~3 공용 — 답변 라벨·수정 패널 옵션 */
export const MOVE_TYPE_OPTIONS: ReadonlyArray<{
  value: ApiMoveType;
  label: string;
}> = [
  { value: 'SMALL', label: '소형이사 (원룸, 투룸, 20평대 미만)' },
  { value: 'HOME', label: '가정이사 (쓰리룸, 20평대 이상)' },
  { value: 'OFFICE', label: '사무실이사 (사무실, 상업공간)' },
];

/** YYYY-MM-DD → 채팅 버블용 「YYYY년 M월 D일」 */
const formatChatMoveDate = (moveDate: string): string => {
  const [year, month, day] = moveDate.slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) {
    return moveDate;
  }
  return `${year}년 ${month}월 ${day}일`;
};

export interface UseMoveInfoReviseOptions {
  /** 수정 모드 진입 직전 추가 정리 (예: 주소 모달 닫기) */
  onBeforeStartRevise?: () => void;
}

/**
 * Step2·3 공용 — 이사종류/예정일 수정 상태·저장.
 * AddressStep은 주소 draft만, MoveDateStep은 일자 최초 저장까지 이 훅에 맡긴다.
 */
export const useMoveInfoRevise = (options: UseMoveInfoReviseOptions = {}) => {
  const { onBeforeStartRevise } = options;
  const {
    bootstrap,
    saveStep,
    reviseField,
    submit,
    isSavingStep,
    isRevisingField,
    isSubmitting: isSubmittingRequest,
  } = useCustomerEstimateRequest();

  const detail = bootstrap.detail;
  const moveType = detail?.moveType ?? null;
  const moveTypeLabel =
    MOVE_TYPE_OPTIONS.find((option) => option.value === moveType)?.label ??
    null;
  const moveDateLabel = detail?.moveDate
    ? formatChatMoveDate(detail.moveDate)
    : null;

  const [isRevisingMoveType, setIsRevisingMoveType] = useState(false);
  const [draftMoveType, setDraftMoveType] = useState<ApiMoveType | null>(
    moveType
  );
  const [isRevisingMoveDate, setIsRevisingMoveDate] = useState(false);
  const [draftDate, setDraftDate] = useState<Date | undefined>(() =>
    detail?.moveDate ? parseDateOnly(detail.moveDate) : undefined
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const minMoveDate = useLocalToday();

  // 저장·수정·제출 중 공통 busy (버튼/수정하기 잠금)
  const isSubmitting =
    isSavingStep || isRevisingField || isSubmittingRequest;
  const isInReviseMode = isRevisingMoveType || isRevisingMoveDate;
  const canConfirmMoveType =
    draftMoveType != null && !isSubmitting && detail != null;

  const startReviseMoveType = () => {
    setErrorMessage(null);
    onBeforeStartRevise?.();
    setIsRevisingMoveDate(false);
    setDraftMoveType(moveType);
    setIsRevisingMoveType(true);
  };

  const confirmMoveType = async () => {
    if (!detail || !draftMoveType) {
      return;
    }

    setErrorMessage(null);

    try {
      await reviseField({
        estimateRequestId: detail.id,
        body: { field: 'moveType', value: draftMoveType },
      });
      // syncDetail 후에도 visualStep 유지 → 수정 UI 닫고 본 스텝 복귀
      setIsRevisingMoveType(false);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '이사 종류 수정 중 오류가 발생했습니다.';
      setErrorMessage(message);
    }
  };

  /** Step3 — 이미 저장된 일자만 reviseField */
  const startReviseMoveDate = () => {
    setErrorMessage(null);
    onBeforeStartRevise?.();
    setIsRevisingMoveType(false);
    setDraftDate(detail?.moveDate ? parseDateOnly(detail.moveDate) : undefined);
    setIsRevisingMoveDate(true);
  };

  const confirmMoveDateRevise = async (date: Date) => {
    if (!detail) {
      return;
    }

    setDraftDate(date);
    setErrorMessage(null);
    const moveDate = formatDateOnly(date);

    try {
      await reviseField({
        estimateRequestId: detail.id,
        body: { field: 'moveDate', value: moveDate },
      });
      setIsRevisingMoveDate(false);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '이사 예정일 수정 중 오류가 발생했습니다.';
      setErrorMessage(message);
    }
  };

  /** Step2 — 미저장이면 saveStep(2), 있으면 reviseField */
  const confirmMoveDate = async (date: Date) => {
    if (!detail) {
      return;
    }

    setDraftDate(date);
    setErrorMessage(null);
    const moveDate = formatDateOnly(date);

    try {
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
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '이사 예정일 저장 중 오류가 발생했습니다.';
      setErrorMessage(message);
    }
  };

  return {
    detail,
    moveTypeLabel,
    moveDateLabel,
    moveTypeOptions: MOVE_TYPE_OPTIONS,
    draftMoveType,
    setDraftMoveType,
    isRevisingMoveType,
    draftDate,
    setDraftDate,
    isRevisingMoveDate,
    minMoveDate,
    errorMessage,
    setErrorMessage,
    saveStep,
    submit,
    isSavingStep,
    isRevisingField,
    isSubmittingRequest,
    isSubmitting,
    isInReviseMode,
    canConfirmMoveType,
    startReviseMoveType,
    confirmMoveType,
    startReviseMoveDate,
    confirmMoveDateRevise,
    confirmMoveDate,
  };
};
