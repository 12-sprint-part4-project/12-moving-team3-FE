'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { API_ERROR_CODE } from '@/constants/errorCode';
import { useMoveInfoRevise } from '@/hooks/useMoveInfoRevise';
import { ApiError } from '@/lib/apiClient';
import { saveEstimateRequestStepBodySchema } from '@/lib/customerEstimateRequestSchema';

import { AddressSelectSection } from '../AddressSelectSection';
import {
  EstimateRequestAddressModal,
  type AddressDraft,
  type AddressSide,
} from '../EstimateRequestAddressModal';
import { MoveDateAnswerSection } from '../MoveDateAnswerSection';
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

  const {
    detail,
    moveTypeLabel,
    moveDateLabel,
    moveTypeOptions,
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
  } = useMoveInfoRevise({
    onBeforeStartRevise: () => setActiveSide(null),
  });

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
      const message =
        error instanceof ApiError
          ? error.message
          : '견적 요청 제출 중 오류가 발생했습니다.';
      setErrorMessage(message);
    }
  };

  return (
    <section
      aria-label="출발지 도착지 입력"
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
        <MoveDateAnswerSection
          moveDateLabel={moveDateLabel}
          isRevisingMoveDate={isRevisingMoveDate}
          isSubmitting={isSubmitting}
          startReviseMoveDate={startReviseMoveDate}
          draftDate={draftDate}
          setDraftDate={setDraftDate}
          minMoveDate={minMoveDate}
          dateConfirmDisabled={isSubmitting || detail == null}
          errorMessage={errorMessage}
          confirmMoveDateRevise={confirmMoveDateRevise}
        >
          <AddressSelectSection
            departure={departure}
            arrival={arrival}
            selectDisabled={isSubmitting}
            confirmDisabled={!canConfirmAddress || isConfirmBusy}
            confirmBusy={isConfirmBusy}
            confirmLabel={confirmLabel}
            errorMessage={errorMessage}
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
        </MoveDateAnswerSection>
      </MoveTypeAnswerSection>

      {activeSide && !isSubmitting && !isInReviseMode ? (
        <EstimateRequestAddressModal
          side={activeSide}
          initialDraft={activeSide === 'departure' ? departure : arrival}
          onClose={() => setActiveSide(null)}
          onConfirm={handleConfirmDraft}
        />
      ) : null}
    </section>
  );
};
