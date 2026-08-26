'use client';

import { useId, useState } from 'react';

import { ModalBasic } from '@/components/ui/Modal/ModalBasic';
import { ModalCtaButton } from '@/components/ui/Modal/ModalCtaButton';
import { MODAL_PANEL_BOTTOM_SHEET_CLASS } from '@/components/ui/Modal/modalPanel';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';
import { REPORT_CATEGORY_OPTIONS, type ReportCategory } from '@/types/report';

export interface ReportCategoryModalProps {
  onClose: () => void;
  onSubmit: (category: ReportCategory) => void;
  /** 제출 요청 진행 중 */
  isSubmitting?: boolean;
  className?: string;
}

/**
 * 신고 사유 선택 모달.
 * Modal 셸과 조합해 사용한다.
 */
export const ReportCategoryModal = ({
  onClose,
  onSubmit,
  isSubmitting = false,
  className = '',
}: ReportCategoryModalProps) => {
  const { t } = useTranslation();
  const groupId = useId();
  const [category, setCategory] = useState<ReportCategory | null>(null);

  const canSubmit = !isSubmitting && category !== null;

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit || !category) return;
    onSubmit(category);
  };

  return (
    <ModalBasic
      title={t('report.title')}
      onClose={handleClose}
      titleAlign="center"
      titleClassName="text-black-500 tablet:text-2xl-bold"
      className={cn(MODAL_PANEL_BOTTOM_SHEET_CLASS, className)}
      footer={
        <ModalCtaButton disabled={!canSubmit} onClick={handleSubmit}>
          {t('report.title')}
        </ModalCtaButton>
      }
    >
      <fieldset className="flex w-full flex-col gap-3 tablet:gap-4">
        <legend className="mb-1 pb-4 text-lg-semibold text-black-200 tablet:text-2lg-semibold">
          {t('report.selectReason')}
        </legend>
        {REPORT_CATEGORY_OPTIONS.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          const checked = category === option.value;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 transition-colors',
                checked
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-line-100 bg-white hover:bg-background-200'
              )}
            >
              <input
                id={optionId}
                type="radio"
                name={groupId}
                value={option.value}
                checked={checked}
                disabled={isSubmitting}
                onChange={() => setCategory(option.value)}
                className="size-5 accent-blue-300"
              />
              <span className="text-lg-medium text-black-300 tablet:text-2lg-medium">
                {t(`report.category.${option.value}`)}
              </span>
            </label>
          );
        })}
      </fieldset>
    </ModalBasic>
  );
};
