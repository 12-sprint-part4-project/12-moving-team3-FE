'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Calendar } from '@/components/ui/Calendar/Calendar';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import { API_ERROR_CODE } from '@/constants/errorCode';
import { useMoveInfoRevise } from '@/hooks/useMoveInfoRevise';
import { ApiError, resolveApiErrorMessage } from '@/lib/apiClient';
import { saveEstimateRequestStepBodySchema } from '@/lib/customerEstimateRequestSchema';
import { fadeUp, getMotionTransition } from '@/lib/motionVariants';

import { useScrollToActiveSection } from '../../_lib/useScrollToActiveSection';
import { AddressSelectCard } from '../AddressSelectCard';
import {
  EstimateRequestAddressModal,
  type AddressDraft,
  type AddressSide,
} from '../EstimateRequestAddressModal';
import { EstimateRequestChatBubbleGroup } from '../EstimateRequestChatBubbleGroup';
import { EstimateRequestChatPanel } from '../EstimateRequestChatPanel';
import { InlineErrorMessage } from '../InlineErrorMessage';
import { MoveTypeAnswerSection } from '../MoveTypeAnswerSection';

import type { EstimateRequestVisualStep } from '@/types/customerEstimateRequest';

/** 출발/도착 draft → Progress 채움 (미선택 2 → 한쪽만 3 → 둘 다 4, 선택 순서 무관) */
const toAddressProgressFill = (
  departure: AddressDraft | null,
  arrival: AddressDraft | null
): EstimateRequestVisualStep => {
  if (departure && arrival) {
    return 4;
  }
  if (departure || arrival) {
    return 3;
  }
  return 2;
};

interface AddressStepProps {
  onProgressFillChange?: (fill: EstimateRequestVisualStep) => void;
}

const MOVE_DATE_PROMPT = '이사 예정일을 선택해주세요.';
const ADDRESS_PROMPT = '이사 지역을 선택해주세요.';

/** detail에 저장된 주소가 있으면 draft로 복원 */
const toDraftFromDetail = (
  zipCode: string | null | undefined,
  address: string | null | undefined,
  detailAddress: string | null | undefined
): AddressDraft | null => {
  if (!zipCode || !address || !detailAddress) {
    return null;
  }
  return { zipCode, address, detailAddress };
};

/**
 * 스텝3 — 출발지/도착지.
 * CTA: zod 검증 후 saveStep(3) → submit → blocked(1-11375).
 * Progress: 한쪽 draft=3/4, 둘 다=full. 이사종류/일자 수정은 useMoveInfoRevise.
 */
export const AddressStep = ({ onProgressFillChange }: AddressStepProps) => {
  const router = useRouter();
  const [activeSide, setActiveSide] = useState<AddressSide | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const {
    detail,
    errorMessage,
    setErrorMessage,
    saveStep,
    submit,
    isSavingStep,
    isRevisingField,
    isSubmittingRequest,
    isSubmitting,
    isInReviseMode,
    moveType,
    moveDate,
  } = useMoveInfoRevise({
    onBeforeStartRevise: () => setActiveSide(null),
  });

  // 스텝 진입·"수정하기" 토글로 활성 섹션이 바뀔 때마다 그 위치로 스크롤
  const bottomRef = useScrollToActiveSection(
    `${moveType.isRevising}:${moveDate.isRevising}`,
    shouldReduceMotion
  );

  // 주소 저장·제출 중 CTA busy — 라벨은 단계별로 구분
  const isConfirmBusy = isSavingStep || isSubmittingRequest;
  const confirmLabel = isSubmittingRequest
    ? '제출 중…'
    : isSavingStep
      ? '저장 중…'
      : '견적 확정하기';

  const [departure, setDeparture] = useState<AddressDraft | null>(() =>
    toDraftFromDetail(
      detail?.departureZipCode,
      detail?.departureAddress,
      detail?.departureDetailAddress
    )
  );
  const [arrival, setArrival] = useState<AddressDraft | null>(() =>
    toDraftFromDetail(
      detail?.arrivalZipCode,
      detail?.arrivalAddress,
      detail?.arrivalDetailAddress
    )
  );

  // 로컬 draft 기준으로 Progress 채움 동기화
  useEffect(() => {
    onProgressFillChange?.(toAddressProgressFill(departure, arrival));
  }, [departure, arrival, onProgressFillChange]);

  const canConfirmAddress =
    departure != null &&
    arrival != null &&
    !isSubmitting &&
    !isInReviseMode &&
    detail != null;

  const handleConfirmDraft = (draft: AddressDraft) => {
    if (activeSide === 'departure') {
      setDeparture(draft);
    } else if (activeSide === 'arrival') {
      setArrival(draft);
    }
    setActiveSide(null);
    setErrorMessage(null);
  };

  const handleConfirmBoth = async () => {
    if (!detail) {
      return;
    }

    // 출발·도착 draft 모두 있어야 step3 body 구성 가능
    if (!departure || !arrival) {
      setErrorMessage('출발지와 도착지를 모두 입력해 주세요.');
      return;
    }

    const parsed = saveEstimateRequestStepBodySchema.safeParse({
      step: 3,
      data: {
        departureZipCode: departure.zipCode,
        departureAddress: departure.address,
        departureDetailAddress: departure.detailAddress,
        arrivalZipCode: arrival.zipCode,
        arrivalAddress: arrival.address,
        arrivalDetailAddress: arrival.detailAddress,
      },
    });

    if (!parsed.success) {
      setErrorMessage(
        parsed.error.issues[0]?.message ?? '주소를 입력해 주세요.'
      );
      return;
    }

    setErrorMessage(null);

    try {
      // step3 저장 후 바로 제출 — 성공 시 대기 견적(/quotes)으로 이동 (재진입 blocked는 유지)
      await saveStep({
        estimateRequestId: detail.id,
        body: parsed.data,
      });
      await submit(detail.id);
      router.push('/quotes');
    } catch (error) {
      // 이미 제출된 요청이면 대기 견적으로 보내 UX를 맞춤
      if (
        error instanceof ApiError &&
        error.code === API_ERROR_CODE.REQUEST_ALREADY_SUBMITTED
      ) {
        router.push('/quotes');
        return;
      }

      // REQUIRED_FIELD_MISSING 등 ApiError.message 그대로 노출
      setErrorMessage(
        resolveApiErrorMessage(error, '견적 요청 제출 중 오류가 발생했습니다.')
      );
    }
  };

  return (
    <section
      aria-label="출발지 도착지 입력"
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
          {/* 시스템: 날짜 프롬프트 */}
          <EstimateRequestChatBubbleGroup>
            <TextFieldChat>{MOVE_DATE_PROMPT}</TextFieldChat>
          </EstimateRequestChatBubbleGroup>

          {/* 유저: 날짜 답변 + 수정하기 (날짜 수정 모드 중에는 숨김) */}
          {moveDate.label && !moveDate.isRevising ? (
            <EstimateRequestChatBubbleGroup align="end">
              <TextFieldChat color="mePrimary">{moveDate.label}</TextFieldChat>
              <button
                type="button"
                className="pr-2 text-xs-medium text-gray-500 underline md:text-lg-medium"
                disabled={isSubmitting}
                onClick={moveDate.start}
              >
                수정하기
              </button>
            </EstimateRequestChatBubbleGroup>
          ) : null}

          {moveDate.isRevising ? (
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
                confirmDisabled={isSubmitting || detail == null}
                confirmLabel={isSubmitting ? '저장 중…' : '선택완료'}
                onConfirm={(date) => {
                  void moveDate.confirmRevise(date);
                }}
              />
              <InlineErrorMessage message={errorMessage} />
            </motion.div>
          ) : null}
        </>
      )}

      {!moveType.isRevising && !moveDate.isRevising && (
        <>
          {/* 시스템: 지역 선택 프롬프트 */}
          <EstimateRequestChatBubbleGroup>
            <TextFieldChat>{ADDRESS_PROMPT}</TextFieldChat>
          </EstimateRequestChatBubbleGroup>

          {/* 출발/도착 선택 카드 + 견적 확정(저장·제출) CTA */}
          <EstimateRequestChatPanel>
            <AddressSelectCard
              departure={departure}
              arrival={arrival}
              selectDisabled={isSubmitting}
              confirmDisabled={!canConfirmAddress || isConfirmBusy}
              confirmBusy={isConfirmBusy}
              confirmLabel={confirmLabel}
              onSelectDeparture={() => {
                setErrorMessage(null);
                setActiveSide('departure');
              }}
              onSelectArrival={() => {
                setErrorMessage(null);
                setActiveSide('arrival');
              }}
              onConfirm={() => {
                void handleConfirmBoth();
              }}
            />
            <InlineErrorMessage message={errorMessage} />
          </EstimateRequestChatPanel>
        </>
      )}

      {activeSide && !isSubmitting && !isInReviseMode ? (
        <EstimateRequestAddressModal
          side={activeSide}
          initialDraft={activeSide === 'departure' ? departure : arrival}
          onClose={() => setActiveSide(null)}
          onConfirm={handleConfirmDraft}
        />
      ) : null}

      <div ref={bottomRef} aria-hidden />
    </section>
  );
};
