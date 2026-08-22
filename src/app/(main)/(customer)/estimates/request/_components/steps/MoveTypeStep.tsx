'use client';

import { useState } from 'react';

import { Button } from '@/components/Button/Button';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import { MOVE_TYPE_OPTIONS } from '@/constants/estimateRequestOptions';
import { useCustomerEstimateRequest } from '@/hooks/useCustomerEstimateRequest';
import { useTranslation } from '@/i18n/useTranslation';
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
  const { t } = useTranslation();
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
        resolveApiErrorMessage(error, t('estimateRequest.saveMoveTypeError'))
      );
    }
  };

  return (
    <section
      aria-label={t('estimateRequest.selectMoveTypeAria')}
      className="page-content flex flex-col gap-2 md:gap-6"
    >
      {/* 시스템 연속 발화 — 한 턴으로 묶어 좌측 정렬 */}
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat>{t('estimateRequest.intro')}</TextFieldChat>
        <TextFieldChat
          desktopChildren={t('estimateRequest.moveTypePromptDesktop')}
        >
          {t('estimateRequest.moveTypePromptMobile')}
        </TextFieldChat>
      </EstimateRequestChatBubbleGroup>

      {/* 유저 입력 패널 — md+ 우측 정렬 (ChatPanel items-end) */}
      <EstimateRequestChatPanel>
        <div
          role="radiogroup"
          aria-label={t('estimateRequest.moveTypeAria')}
          className="flex w-full flex-col gap-2 md:gap-4"
        >
          {MOVE_TYPE_OPTIONS.map((option) => (
            <MoveTypeOptionField
              key={option.value}
              name="moveType"
              value={option.value}
              label={`${t(`moveType.${option.value}`)} ${t(`moveType.detail.${option.value}`)}`}
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
          {isSavingStep
            ? t('estimateRequest.saving')
            : t('estimateRequest.selectComplete')}
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
