'use client';

import { useId, useState } from 'react';

import { FilterCheckBox } from '@/components/ui/Filter/FilterCheckBox';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import { ModalCtaButton } from './ModalCtaButton';
import { ModalHeader } from './ModalHeader';
import {
  MODAL_PANEL_BOTTOM_SHEET_CLASS,
  MODAL_PANEL_CLASS,
} from './modalPanel';

export type MoveTypeFilterOption = 'small' | 'home' | 'office';

const MOVE_TYPE_OPTIONS: readonly MoveTypeFilterOption[] = [
  'small',
  'home',
  'office',
] as const;

const MOVE_TYPE_I18N_KEY: Record<
  MoveTypeFilterOption,
  'SMALL' | 'HOME' | 'OFFICE'
> = {
  small: 'SMALL',
  home: 'HOME',
  office: 'OFFICE',
};

export interface MoveTypeFilterCounts {
  /** 전체선택 행에 표시할 건수 (유형 합과 다를 수 있음) */
  all?: number;
  small?: number;
  home?: number;
  office?: number;
}

export interface MoveTypeFilterModalProps {
  onClose: () => void;
  /** 조회하기 클릭 시 선택된 이사 유형을 전달 */
  onSubmit: (selected: MoveTypeFilterOption[]) => void;
  /** 초기 선택 값. 미지정 시 전체 선택 */
  defaultSelected?: MoveTypeFilterOption[];
  /** 옵션별 건수. 있으면 `라벨 (N)` 형태로 표시 */
  counts?: MoveTypeFilterCounts;
  className?: string;
}

/** 라벨 뒤에 건수가 있으면 `(N)`을 붙인다. */
const formatFilterLabel = (label: string, count?: number) =>
  count === undefined ? label : `${label} (${count})`;

/**
 * 이사 유형 필터 모달 콘텐츠 (Figma: Modal/filte-이사유형).
 * Modal 셸에 대한 의존 없이 패널 UI만 렌더한다.
 * 사용 시 `<Modal placement="bottom">`과 조합한다 (모바일 하단 시트).
 */
export const MoveTypeFilterModal = ({
  onClose,
  onSubmit,
  defaultSelected = [...MOVE_TYPE_OPTIONS],
  counts,
  className = '',
}: MoveTypeFilterModalProps) => {
  const { t } = useTranslation();
  const titleId = useId();
  const [selected, setSelected] = useState<Set<MoveTypeFilterOption>>(
    () => new Set(defaultSelected)
  );

  const isAllSelected = MOVE_TYPE_OPTIONS.every((type) => selected.has(type));

  // 전체선택 토글: 전부 선택하거나 전부 해제한다.
  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? new Set(MOVE_TYPE_OPTIONS) : new Set());
  };

  const handleToggle = (type: MoveTypeFilterOption, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(type);
      else next.delete(type);
      return next;
    });
  };

  const handleSubmit = () => {
    onSubmit(MOVE_TYPE_OPTIONS.filter((type) => selected.has(type)));
  };

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={cn(
        MODAL_PANEL_CLASS,
        MODAL_PANEL_BOTTOM_SHEET_CLASS,
        'gap-6 pt-4 pb-8 sm:gap-6',
        className
      )}
    >
      <div className="flex w-full flex-col gap-3">
        {/* Figma: '이사 유형'(bold) + '필터'(gray semibold) 혼합 타이포 */}
        <ModalHeader
          title={
            <span className="flex items-center gap-6">
              <span className="text-2lg-bold text-black-400">
                {t('receivedRequests.moveTypeSection')}
              </span>
              <span className="text-2lg-semibold text-gray-300">
                {t('common.filter')}
              </span>
            </span>
          }
          titleClassName="text-inherit sm:text-inherit"
          onClose={onClose}
          titleId={titleId}
        />

        <div className="flex w-full flex-col gap-2">
          <FilterCheckBox
            label={formatFilterLabel(t('common.selectAll'), counts?.all)}
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            labelClassName="text-gray-300"
            className="px-2.5 py-2"
          />

          <div className="flex w-full flex-col">
            {MOVE_TYPE_OPTIONS.map((type) => (
              <FilterCheckBox
                key={type}
                label={formatFilterLabel(
                  t(`moveType.${MOVE_TYPE_I18N_KEY[type]}`),
                  counts?.[type]
                )}
                checked={selected.has(type)}
                onCheckedChange={(checked) => handleToggle(type, checked)}
              />
            ))}
          </div>
        </div>
      </div>

      <ModalCtaButton onClick={handleSubmit}>
        {t('receivedRequests.submitFilter')}
      </ModalCtaButton>
    </section>
  );
};
