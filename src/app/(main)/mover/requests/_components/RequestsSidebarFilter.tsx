'use client';

import { CheckBox } from '@/components/ui/CheckBox/CheckBox';
import { FilterCheckBox } from '@/components/ui/Filter/FilterCheckBox';

import { cn } from '@/lib/utils';

import type {
  MoveTypeFilterCounts,
  MoveTypeOption,
  RequestScopeFilterCounts,
  RequestScopeOption,
} from '@/types/estimateRequest';

import {
  MOVE_TYPE_LABELS,
  MOVE_TYPE_OPTIONS,
  SCOPE_LABELS,
  SCOPE_OPTIONS,
  formatFilterLabel,
  toggleFilterItem,
} from '../_lib/filterOptions';

export interface RequestsSidebarFilterProps {
  selectedMoveTypes: MoveTypeOption[];
  selectedScopes: RequestScopeOption[];
  moveTypeCounts?: MoveTypeFilterCounts;
  scopeCounts?: RequestScopeFilterCounts;
  onMoveTypesChange: (next: MoveTypeOption[]) => void;
  onScopesChange: (next: RequestScopeOption[]) => void;
  className?: string;
}

/** 데스크톱 사이드 필터 — 이사 유형·범위 선택 */
export const RequestsSidebarFilter = ({
  selectedMoveTypes,
  selectedScopes,
  moveTypeCounts,
  scopeCounts,
  onMoveTypesChange,
  onScopesChange,
  className = '',
}: RequestsSidebarFilterProps) => {
  /** 이사 유형 전체선택 여부 판별 */
  const isAllMoveTypesSelected = MOVE_TYPE_OPTIONS.every((type) =>
    selectedMoveTypes.includes(type)
  );
  /** 요청 범위 전체선택 여부 판별 */
  const isAllScopesSelected = SCOPE_OPTIONS.every((scope) =>
    selectedScopes.includes(scope)
  );

  /** 이사 유형 전체선택 토글 */
  const handleMoveTypeSelectAll = (checked: boolean) => {
    onMoveTypesChange(checked ? [...MOVE_TYPE_OPTIONS] : []);
  };

  /** 요청 범위 전체선택 토글 */
  const handleScopeSelectAll = (checked: boolean) => {
    onScopesChange(checked ? [...SCOPE_OPTIONS] : []);
  };

  /** 이사 유형 개별 선택 변경 */
  const handleMoveTypeToggle = (type: MoveTypeOption, checked: boolean) => {
    onMoveTypesChange(toggleFilterItem(selectedMoveTypes, type, checked));
  };

  /** 요청 범위 개별 선택 변경 */
  const handleScopeToggle = (scope: RequestScopeOption, checked: boolean) => {
    onScopesChange(toggleFilterItem(selectedScopes, scope, checked));
  };

  return (
    <aside className={cn('flex w-full flex-col gap-6', className)}>
      {/* 이사 유형 필터 섹션 렌더 */}
      <section className="flex w-full flex-col gap-6 bg-white">
        <div className="flex items-center justify-between border-b border-line-200 px-2.5 py-4">
          <h2 className="text-xl-medium text-black-400">이사 유형</h2>
          <div className="flex items-center gap-1">
            <CheckBox
              checked={isAllMoveTypesSelected}
              onCheckedChange={handleMoveTypeSelectAll}
              size="md"
              shape="square"
              aria-label="이사 유형 전체선택"
            />
            <span className="text-2lg-regular text-gray-300">전체선택</span>
          </div>
        </div>
        <div className="flex flex-col">
          {MOVE_TYPE_OPTIONS.map((type) => (
            <FilterCheckBox
              key={type}
              label={formatFilterLabel(
                MOVE_TYPE_LABELS[type],
                moveTypeCounts?.[type]
              )}
              checked={selectedMoveTypes.includes(type)}
              onCheckedChange={(checked) => handleMoveTypeToggle(type, checked)}
            />
          ))}
        </div>
      </section>

      {/* 요청 범위 필터 섹션 렌더 */}
      <section className="flex w-full flex-col gap-6 bg-white">
        <div className="flex items-center justify-between border-b border-line-200 px-2.5 py-4">
          <h2 className="text-xl-medium text-black-400">필터</h2>
          <div className="flex items-center gap-1">
            <CheckBox
              checked={isAllScopesSelected}
              onCheckedChange={handleScopeSelectAll}
              size="md"
              shape="square"
              aria-label="필터 전체선택"
            />
            <span className="text-2lg-regular text-gray-300">전체선택</span>
          </div>
        </div>
        <div className="flex flex-col">
          {SCOPE_OPTIONS.map((scope) => (
            <FilterCheckBox
              key={scope}
              label={formatFilterLabel(
                SCOPE_LABELS[scope],
                scopeCounts?.[scope]
              )}
              checked={selectedScopes.includes(scope)}
              onCheckedChange={(checked) => handleScopeToggle(scope, checked)}
            />
          ))}
        </div>
      </section>
    </aside>
  );
};
