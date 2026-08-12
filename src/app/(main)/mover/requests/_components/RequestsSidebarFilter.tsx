'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { CheckBox } from '@/components/ui/CheckBox/CheckBox';
import { FilterCheckBox } from '@/components/ui/Filter/FilterCheckBox';

import { fadeUp, getMotionTransition, tapScale } from '@/lib/motionVariants';
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

interface AnimatedFilterRowProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const AnimatedFilterRow = ({
  label,
  checked,
  onCheckedChange,
}: AnimatedFilterRowProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      layout
      {...(shouldReduceMotion ? {} : tapScale)}
      animate={{
        backgroundColor: checked
          ? 'rgba(239, 246, 255, 0.6)'
          : 'rgba(255, 255, 255, 1)',
      }}
      transition={getMotionTransition(shouldReduceMotion, { duration: 0.2 })}
    >
      <FilterCheckBox
        label={label}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </motion.div>
  );
};

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
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  const isAllMoveTypesSelected = MOVE_TYPE_OPTIONS.every((type) =>
    selectedMoveTypes.includes(type)
  );
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
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={motionTransition}
      className={cn('flex w-full flex-col gap-6', className)}
    >
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
        <motion.div layout className="flex flex-col">
          {MOVE_TYPE_OPTIONS.map((type, index) => (
            <motion.div
              key={type}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{
                ...motionTransition,
                delay: shouldReduceMotion ? 0 : index * 0.04,
              }}
            >
              <AnimatedFilterRow
                label={formatFilterLabel(
                  MOVE_TYPE_LABELS[type],
                  moveTypeCounts?.[type]
                )}
                checked={selectedMoveTypes.includes(type)}
                onCheckedChange={(checked) =>
                  handleMoveTypeToggle(type, checked)
                }
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

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
        <motion.div layout className="flex flex-col">
          {SCOPE_OPTIONS.map((scope, index) => (
            <motion.div
              key={scope}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{
                ...motionTransition,
                delay: shouldReduceMotion ? 0 : index * 0.04,
              }}
            >
              <AnimatedFilterRow
                label={formatFilterLabel(
                  SCOPE_LABELS[scope],
                  scopeCounts?.[scope]
                )}
                checked={selectedScopes.includes(scope)}
                onCheckedChange={(checked) => handleScopeToggle(scope, checked)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.aside>
  );
};
