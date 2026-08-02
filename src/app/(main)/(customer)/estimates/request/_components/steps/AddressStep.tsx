'use client';

import { useState } from 'react';

import { AddressSelectCard } from '../AddressSelectCard';
import {
  EstimateRequestAddressModal,
  type AddressDraft,
  type AddressSide,
} from '../EstimateRequestAddressModal';
import { EstimateRequestChatBubbleGroup } from '../EstimateRequestChatBubbleGroup';
import { EstimateRequestChatPanel } from '../EstimateRequestChatPanel';
import { InlineErrorMessage } from '../InlineErrorMessage';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import { useCustomerEstimateRequest } from '@/hooks/useCustomerEstimateRequest';
import { ApiError } from '@/lib/apiClient';
import { saveEstimateRequestStepBodySchema } from '@/lib/customerEstimateRequestSchema';
import type { ApiMoveType } from '@/types/estimateRequest';

/** Step1·2와 동일 옵션 — 답변 라벨 표시용 */
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
 * CTA: zod 검증 후 saveStep(3) → syncDetail → visualStep=4.
 */
export const AddressStep = () => {
  const { bootstrap, saveStep, isSavingStep } = useCustomerEstimateRequest();
  const detail = bootstrap.detail;
  const moveTypeLabel =
    MOVE_TYPE_OPTIONS.find((option) => option.value === detail?.moveType)
      ?.label ?? null;
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

  const canConfirm =
    departure != null && arrival != null && !isSavingStep && detail != null;

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

      {/* 유저: 이사종류 답변 + 수정하기 (UI만 — 주소 CTA 우선) */}
      {moveTypeLabel ? (
        <EstimateRequestChatBubbleGroup align="end">
          <TextFieldChat color="mePrimary">{moveTypeLabel}</TextFieldChat>
          <button
            type="button"
            className="pr-2 text-xs-medium text-gray-500 underline md:text-lg-medium"
            disabled={isSavingStep}
          >
            수정하기
          </button>
        </EstimateRequestChatBubbleGroup>
      ) : null}

      {/* 시스템: 날짜 프롬프트 */}
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat>{MOVE_DATE_PROMPT}</TextFieldChat>
      </EstimateRequestChatBubbleGroup>

      {/* 유저: 날짜 답변 + 수정하기 (UI만) */}
      {moveDateLabel ? (
        <EstimateRequestChatBubbleGroup align="end">
          <TextFieldChat color="mePrimary">{moveDateLabel}</TextFieldChat>
          <button
            type="button"
            className="pr-2 text-xs-medium text-gray-500 underline md:text-lg-medium"
            disabled={isSavingStep}
          >
            수정하기
          </button>
        </EstimateRequestChatBubbleGroup>
      ) : null}

      {/* 시스템: 지역 선택 프롬프트 */}
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat>{ADDRESS_PROMPT}</TextFieldChat>
      </EstimateRequestChatBubbleGroup>

      {/* 출발/도착 선택 카드 + step3 저장 CTA */}
      <EstimateRequestChatPanel>
        <AddressSelectCard
          departure={departure}
          arrival={arrival}
          selectDisabled={isSavingStep}
          confirmDisabled={!canConfirm}
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

      {activeSide && !isSavingStep ? (
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
