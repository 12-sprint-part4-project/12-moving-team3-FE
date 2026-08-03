'use client';

import { useState } from 'react';

import { EstimateRequestChatBubbleGroup } from '../EstimateRequestChatBubbleGroup';
import { EstimateRequestChatPanel } from '../EstimateRequestChatPanel';
import { MoveTypeOptionField } from '../MoveTypeOptionField';
import { Button } from '@/components/Button/Button';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import { useCustomerEstimateRequest } from '@/hooks/useCustomerEstimateRequest';
import { ApiError } from '@/lib/apiClient';
import type { ApiMoveType } from '@/types/estimateRequest';

/** Step1 옵션 — MoveTypeChip 라벨보다 설명형 문구를 사용 */
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
const PROMPT_MESSAGE_MOBILE = '이사 종류를 알려주세요.';
const PROMPT_MESSAGE_DESKTOP = '이사 종류를 선택해 주세요.';

/**
 * 스텝1 — 이사종류 선택.
 * 선택완료 시 PATCH step:1 → bootstrap visualStep=2 로 Step2 이동.
 */
export const MoveTypeStep = () => {
  const { bootstrap, saveStep, isSavingStep } = useCustomerEstimateRequest();
  const detail = bootstrap.detail;

  const [selectedMoveType, setSelectedMoveType] = useState<ApiMoveType | null>(
    detail?.moveType ?? null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = selectedMoveType != null && !isSavingStep && detail != null;

  const handleSubmit = async () => {
    if (!detail || !selectedMoveType) {
      return;
    }

    setErrorMessage(null);

    try {
      // 성공 시 syncDetail → visualStep=2 → MoveDateStep 렌더
      await saveStep({
        estimateRequestId: detail.id,
        body: {
          step: 1,
          data: { moveType: selectedMoveType },
        },
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '이사 종류 저장 중 오류가 발생했습니다.';
      setErrorMessage(message);
    }
  };

  return (
    <section
      aria-label="이사 종류 선택"
      className="page-content flex flex-col gap-2 md:gap-6"
    >
      {/* 시스템 연속 발화 — 한 턴으로 묶어 좌측 정렬 */}
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat>{INTRO_MESSAGE}</TextFieldChat>
        <TextFieldChat desktopChildren={PROMPT_MESSAGE_DESKTOP}>
          {PROMPT_MESSAGE_MOBILE}
        </TextFieldChat>
      </EstimateRequestChatBubbleGroup>

      {/* 유저 입력 패널 — md+ 우측 정렬 (ChatPanel items-end) */}
      <EstimateRequestChatPanel>
        <div
          role="radiogroup"
          aria-label="이사 종류"
          className="flex w-full flex-col gap-2 md:gap-4"
        >
          {MOVE_TYPE_OPTIONS.map((option) => (
            <MoveTypeOptionField
              key={option.value}
              name="moveType"
              value={option.value}
              label={option.label}
              selected={selectedMoveType === option.value}
              disabled={isSavingStep}
              onSelect={setSelectedMoveType}
            />
          ))}
        </div>

        <Button
          type="button"
          variant="solid"
          size="sm"
          className="md:h-16 md:text-xl-semibold"
          disabled={!canSubmit}
          aria-busy={isSavingStep}
          onClick={() => {
            void handleSubmit();
          }}
        >
          {isSavingStep ? '저장 중…' : '선택완료'}
        </Button>

        {errorMessage ? (
          <p className="text-md-medium text-red-200" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </EstimateRequestChatPanel>
    </section>
  );
};
