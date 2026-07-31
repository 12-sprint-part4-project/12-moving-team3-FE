'use client';

import { useId, useState } from 'react';

import { FilterCheckBox } from '@/components/ui/Filter/FilterCheckBox';
import { ModalCtaButton } from '@/components/ui/Modal/ModalCtaButton';
import { ModalHeader } from '@/components/ui/Modal/ModalHeader';
import {
  MODAL_PANEL_BOTTOM_SHEET_CLASS,
  MODAL_PANEL_CLASS,
} from '@/components/ui/Modal/modalPanel';

import { cn } from '@/lib/utils';

import type {
  MoveTypeFilterCounts,
  MoveTypeOption,
  RequestScopeFilterCounts,
  RequestScopeOption,
  RequestsFilterState,
} from '@/types/estimateRequest';

import {
  MOVE_TYPE_LABELS,
  MOVE_TYPE_OPTIONS,
  SCOPE_LABELS,
  SCOPE_OPTIONS,
  formatFilterLabel,
} from '../_lib/filterOptions';

export type RequestsMobileFilterTab = 'moveType' | 'scope';

export interface RequestsMobileFilterModalProps {
  onClose: () => void;
  onSubmit: (next: RequestsFilterState) => void;
  defaultMoveTypes?: MoveTypeOption[];
  defaultScopes?: RequestScopeOption[];
  moveTypeCounts?: MoveTypeFilterCounts;
  scopeCounts?: RequestScopeFilterCounts;
  className?: string;
}

/** 모바일·태블릿 필터 모달 — 탭별 필터 선택 후 조회 */
export const RequestsMobileFilterModal = ({
  onClose,
  onSubmit,
  defaultMoveTypes = [...MOVE_TYPE_OPTIONS],
  defaultScopes = [...SCOPE_OPTIONS],
  moveTypeCounts,
  scopeCounts,
  className = '',
}: RequestsMobileFilterModalProps) => {
  const titleId = useId();
  const [activeTab, setActiveTab] =
    useState<RequestsMobileFilterTab>('moveType');
  const [selectedMoveTypes, setSelectedMoveTypes] = useState<
    Set<MoveTypeOption>
  >(() => new Set(defaultMoveTypes));
  const [selectedScopes, setSelectedScopes] = useState<Set<RequestScopeOption>>(
    () => new Set(defaultScopes)
  );

  /** 이사 유형 전체선택 여부 판별 */
  const isAllMoveTypesSelected = MOVE_TYPE_OPTIONS.every((type) =>
    selectedMoveTypes.has(type)
  );
  /** 요청 범위 전체선택 여부 판별 */
  const isAllScopesSelected = SCOPE_OPTIONS.every((scope) =>
    selectedScopes.has(scope)
  );

  /** 이사 유형 건수 합산 */
  const moveTypeTotal =
    (moveTypeCounts?.small ?? 0) +
    (moveTypeCounts?.home ?? 0) +
    (moveTypeCounts?.office ?? 0);
  /** 요청 범위 건수 합산 */
  const scopeTotal =
    (scopeCounts?.serviceArea ?? 0) + (scopeCounts?.designated ?? 0);

  /** 이사 유형 전체선택 토글 */
  const handleMoveTypeSelectAll = (checked: boolean) => {
    setSelectedMoveTypes(checked ? new Set(MOVE_TYPE_OPTIONS) : new Set());
  };

  /** 요청 범위 전체선택 토글 */
  const handleScopeSelectAll = (checked: boolean) => {
    setSelectedScopes(checked ? new Set(SCOPE_OPTIONS) : new Set());
  };

  /** 이사 유형 개별 선택 변경 */
  const handleMoveTypeToggle = (type: MoveTypeOption, checked: boolean) => {
    setSelectedMoveTypes((prev) => {
      const next = new Set(prev);
      if (checked) next.add(type);
      else next.delete(type);
      return next;
    });
  };

  /** 요청 범위 개별 선택 변경 */
  const handleScopeToggle = (scope: RequestScopeOption, checked: boolean) => {
    setSelectedScopes((prev) => {
      const next = new Set(prev);
      if (checked) next.add(scope);
      else next.delete(scope);
      return next;
    });
  };

  /** 선택한 필터를 부모로 전달 */
  const handleSubmit = () => {
    onSubmit({
      moveTypes: MOVE_TYPE_OPTIONS.filter((type) =>
        selectedMoveTypes.has(type)
      ),
      scopes: SCOPE_OPTIONS.filter((scope) => selectedScopes.has(scope)),
    });
  };

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={cn(
        MODAL_PANEL_CLASS,
        MODAL_PANEL_BOTTOM_SHEET_CLASS,
        'gap-6 pt-4 pb-8',
        className
      )}
    >
      <div className="flex w-full flex-col gap-3">
        {/* 탭 헤더 렌더 */}
        <ModalHeader
          title={
            <span className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('moveType')}
                className={cn(
                  'cursor-pointer text-2lg-semibold',
                  activeTab === 'moveType' ? 'text-black-400' : 'text-gray-300'
                )}
                aria-pressed={activeTab === 'moveType'}
              >
                이사 유형
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('scope')}
                className={cn(
                  'cursor-pointer text-2lg-semibold',
                  activeTab === 'scope' ? 'text-black-400' : 'text-gray-300'
                )}
                aria-pressed={activeTab === 'scope'}
              >
                필터
              </button>
            </span>
          }
          titleClassName="text-inherit sm:text-inherit"
          onClose={onClose}
          titleId={titleId}
        />

        {/* 활성 탭 필터 목록 렌더 */}
        {activeTab === 'moveType' ? (
          <div className="flex w-full flex-col gap-2">
            <FilterCheckBox
              label={formatFilterLabel('전체선택', moveTypeTotal || undefined)}
              checked={isAllMoveTypesSelected}
              onCheckedChange={handleMoveTypeSelectAll}
              labelClassName="text-gray-300"
              className="px-2.5 py-2"
            />
            <div className="flex w-full flex-col">
              {MOVE_TYPE_OPTIONS.map((type) => (
                <FilterCheckBox
                  key={type}
                  label={formatFilterLabel(
                    MOVE_TYPE_LABELS[type],
                    moveTypeCounts?.[type]
                  )}
                  checked={selectedMoveTypes.has(type)}
                  onCheckedChange={(checked) =>
                    handleMoveTypeToggle(type, checked)
                  }
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-2">
            <FilterCheckBox
              label={formatFilterLabel(
                '전체선택',
                scopeCounts ? scopeTotal : undefined
              )}
              checked={isAllScopesSelected}
              onCheckedChange={handleScopeSelectAll}
              labelClassName="text-gray-300"
              className="px-2.5 py-2"
            />
            <div className="flex w-full flex-col">
              {SCOPE_OPTIONS.map((scope) => (
                <FilterCheckBox
                  key={scope}
                  label={formatFilterLabel(
                    SCOPE_LABELS[scope],
                    scopeCounts?.[scope]
                  )}
                  checked={selectedScopes.has(scope)}
                  onCheckedChange={(checked) =>
                    handleScopeToggle(scope, checked)
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 필터 조회 버튼 렌더 */}
      <ModalCtaButton onClick={handleSubmit} className="cursor-pointer">
        조회하기
      </ModalCtaButton>
    </section>
  );
};
