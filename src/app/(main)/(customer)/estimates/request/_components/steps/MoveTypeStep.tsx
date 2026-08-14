'use client';

import { useState } from 'react';

import { Button } from '@/components/Button/Button';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import {
  ESTIMATE_REQUEST_INTRO_MESSAGE,
  MOVE_TYPE_PROMPT_DESKTOP,
  MOVE_TYPE_PROMPT_MOBILE,
} from '@/constants/estimateRequestMessages';
import { MOVE_TYPE_OPTIONS } from '@/constants/estimateRequestOptions';
import { useCustomerEstimateRequest } from '@/hooks/useCustomerEstimateRequest';
import { resolveApiErrorMessage } from '@/lib/apiClient';

import { EstimateRequestChatBubbleGroup } from '../EstimateRequestChatBubbleGroup';
import { EstimateRequestChatPanel } from '../EstimateRequestChatPanel';
import { MoveTypeOptionField } from '../MoveTypeOptionField';

import type { ApiMoveType } from '@/types/estimateRequest';

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
      setErrorMessage(
        resolveApiErrorMessage(error, '이사 종류 저장 중 오류가 발생했습니다.')
      );
    }
  };

  return (
    <section
      aria-label="이사 종류 선택"
      className="page-content flex flex-col gap-2 md:gap-6"
    >
      {/* 시스템 연속 발화 — 한 턴으로 묶어 좌측 정렬 */}
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat>{ESTIMATE_REQUEST_INTRO_MESSAGE}</TextFieldChat>
        <TextFieldChat desktopChildren={MOVE_TYPE_PROMPT_DESKTOP}>
          {MOVE_TYPE_PROMPT_MOBILE}
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
