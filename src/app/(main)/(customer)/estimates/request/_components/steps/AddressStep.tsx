'use client';

import { useEffect, useState } from 'react';

import { AddressSelectCard } from '../AddressSelectCard';
import {
  EstimateRequestAddressModal,
  type AddressDraft,
  type AddressSide,
} from '../EstimateRequestAddressModal';
import { EstimateRequestChatBubbleGroup } from '../EstimateRequestChatBubbleGroup';
import { EstimateRequestChatPanel } from '../EstimateRequestChatPanel';
import { InlineErrorMessage } from '../InlineErrorMessage';
import { MoveTypeRevisePanel } from '../MoveTypeRevisePanel';
import { Calendar } from '@/components/ui/Calendar/Calendar';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import { useMoveInfoRevise } from '@/hooks/useMoveInfoRevise';
import { ApiError } from '@/lib/apiClient';
import { saveEstimateRequestStepBodySchema } from '@/lib/customerEstimateRequestSchema';
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

const INTRO_MESSAGE =
  '몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)';
const MOVE_TYPE_PROMPT_MOBILE = '이사 종류를 알려주세요.';
const MOVE_TYPE_PROMPT_DESKTOP = '이사 종류를 선택해 주세요.';
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
 * CTA: zod 검증 후 saveStep(3) → Step4.
 * Progress: 한쪽 draft=3/4, 둘 다=full. 이사종류/일자 수정은 useMoveInfoRevise.
 */
export const AddressStep = ({ onProgressFillChange }: AddressStepProps) => {
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
    isSavingStep,
    isRevisingField,
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
      // 성공 시 syncDetail → visualStep=4 → SubmitStep
      await saveStep({
        estimateRequestId: detail.id,
        body: parsed.data,
      });
    } catch (error) {
      // BE REQUIRED_FIELD_MISSING 등 ApiError.message 그대로 노출
      const message =
        error instanceof ApiError
          ? error.message
          : '주소 저장 중 오류가 발생했습니다.';
      setErrorMessage(message);
    }
  };

  return (
    <section
      aria-label="출발지 도착지 입력"
      className="page-content flex flex-col gap-2 md:gap-6"
    >
      {/* 시스템: 안내 + 이사종류 질문 */}
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat>{INTRO_MESSAGE}</TextFieldChat>
        <TextFieldChat desktopChildren={MOVE_TYPE_PROMPT_DESKTOP}>
          {MOVE_TYPE_PROMPT_MOBILE}
        </TextFieldChat>
      </EstimateRequestChatBubbleGroup>

      {/* 유저: 이사종류 답변 + 수정하기 (수정 모드 중에는 숨김) */}
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
                confirmDisabled={isSubmitting || detail == null}
                confirmLabel={isSubmitting ? '저장 중…' : '선택완료'}
                onConfirm={(date) => {
                  void confirmMoveDateRevise(date);
                }}
              />
              <InlineErrorMessage message={errorMessage} />
            </div>
          ) : (
            <>
              {/* 시스템: 지역 선택 프롬프트 */}
              <EstimateRequestChatBubbleGroup>
                <TextFieldChat>{ADDRESS_PROMPT}</TextFieldChat>
              </EstimateRequestChatBubbleGroup>

              {/* 출발/도착 선택 카드 + step3 저장 CTA */}
              <EstimateRequestChatPanel>
                <AddressSelectCard
                  departure={departure}
                  arrival={arrival}
                  selectDisabled={isSubmitting}
                  confirmDisabled={!canConfirmAddress}
                  confirmBusy={isSavingStep}
                  confirmLabel={isSavingStep ? '저장 중…' : '견적 확정하기'}
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
    </section>
  );
};
