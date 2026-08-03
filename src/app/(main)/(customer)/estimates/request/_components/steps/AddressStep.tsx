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
import {
  formatDateOnly,
  parseDateOnly,
} from '@/components/ui/Calendar/Calendar.utils';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import { useCustomerEstimateRequest } from '@/hooks/useCustomerEstimateRequest';
import { useLocalToday } from '@/hooks/useLocalToday';
import { ApiError } from '@/lib/apiClient';
import { saveEstimateRequestStepBodySchema } from '@/lib/customerEstimateRequestSchema';
import type { EstimateRequestVisualStep } from '@/types/customerEstimateRequest';
import type { ApiMoveType } from '@/types/estimateRequest';

/** 출발/도착 draft → Progress 채움 (미선택 2 → 출발 3 → 둘 다 4) */
const toAddressProgressFill = (
  departure: AddressDraft | null,
  arrival: AddressDraft | null
): EstimateRequestVisualStep => {
  if (departure && arrival) {
    return 4;
  }
  if (departure) {
    return 3;
  }
  return 2;
};

interface AddressStepProps {
  onProgressFillChange?: (fill: EstimateRequestVisualStep) => void;
}

/** Step1·2와 동일 옵션 — 답변 라벨·수정 패널 공용 */
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
const ADDRESS_PROMPT = '이사 지역을 선택해주세요.';

/** YYYY-MM-DD → 채팅 버블용 「YYYY년 M월 D일」 (시안 표기) */
const formatChatMoveDate = (moveDate: string): string => {
  const [year, month, day] = moveDate.slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) {
    return moveDate;
  }
  return `${year}년 ${month}월 ${day}일`;
};

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
 * Progress: 출발 draft=3/4, 도착까지=full. 이사종류/일자 수정은 reviseField.
 */
export const AddressStep = ({ onProgressFillChange }: AddressStepProps) => {
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
  const moveDateLabel = detail?.moveDate
    ? formatChatMoveDate(detail.moveDate)
    : null;

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
  const [activeSide, setActiveSide] = useState<AddressSide | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isRevisingMoveType, setIsRevisingMoveType] = useState(false);
  const [draftMoveType, setDraftMoveType] = useState<ApiMoveType | null>(
    moveType
  );
  const [isRevisingMoveDate, setIsRevisingMoveDate] = useState(false);
  const [draftDate, setDraftDate] = useState<Date | undefined>(() =>
    detail?.moveDate ? parseDateOnly(detail.moveDate) : undefined
  );
  // SSR/클라이언트 시각·시간대 불일치 방지 — 하이드레이션 후 로컬 "오늘"
  const minMoveDate = useLocalToday();

  // 로컬 draft 기준으로 Progress 채움 동기화
  useEffect(() => {
    onProgressFillChange?.(toAddressProgressFill(departure, arrival));
  }, [departure, arrival, onProgressFillChange]);

  const isSubmitting = isSavingStep || isRevisingField;
  const isInReviseMode = isRevisingMoveType || isRevisingMoveDate;
  const canConfirmAddress =
    departure != null &&
    arrival != null &&
    !isSubmitting &&
    !isInReviseMode &&
    detail != null;
  const canConfirmMoveType =
    draftMoveType != null && !isSubmitting && detail != null;

  const handleStartReviseMoveType = () => {
    setErrorMessage(null);
    setActiveSide(null);
    setIsRevisingMoveDate(false);
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
      // syncDetail 후에도 주소 미완 → visualStep=3, 주소 UI 복귀
      setIsRevisingMoveType(false);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '이사 종류 수정 중 오류가 발생했습니다.';
      setErrorMessage(message);
    }
  };

  const handleStartReviseMoveDate = () => {
    setErrorMessage(null);
    setActiveSide(null);
    setIsRevisingMoveType(false);
    setDraftDate(detail?.moveDate ? parseDateOnly(detail.moveDate) : undefined);
    setIsRevisingMoveDate(true);
  };

  const handleConfirmMoveDate = async (date: Date) => {
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
      // syncDetail 후에도 주소 미완 → visualStep=3, 주소 UI 복귀
      setIsRevisingMoveDate(false);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '이사 예정일 수정 중 오류가 발생했습니다.';
      setErrorMessage(message);
    }
  };

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
      className="mx-auto flex w-full max-w-[375px] flex-col gap-2 px-6 md:max-w-[1448px] md:gap-6"
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
            onClick={handleStartReviseMoveType}
          >
            수정하기
          </button>
        </EstimateRequestChatBubbleGroup>
      ) : null}

      {isRevisingMoveType ? (
        <MoveTypeRevisePanel
          options={MOVE_TYPE_OPTIONS}
          draftMoveType={draftMoveType}
          onSelect={setDraftMoveType}
          isSubmitting={isSubmitting}
          isRevisingField={isRevisingField}
          canConfirm={canConfirmMoveType}
          errorMessage={errorMessage}
          onConfirm={() => {
            void handleConfirmMoveType();
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
                onClick={handleStartReviseMoveDate}
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
                  void handleConfirmMoveDate(date);
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
