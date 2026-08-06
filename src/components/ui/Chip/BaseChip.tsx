import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

/*
  BASE CHIP (내부 공용)

  ServiceChip / RegionChip이 공유하는 선택형 칩 베이스입니다.
  공개 export하지 않고, 두 래퍼가 textOnlyActive만 다르게 주입합니다.

  - button: 클릭 가능한 <button>. isSelected로 선택/미선택 스타일 전환
  - textOnly: 표시 전용 <div>. 선택 상태 없이 textOnlyActive로 색만 고정
    · Service → 파란색, Region → 회색
  - 선택 상태는 부모가 isSelected로 제어합니다 (단일/다중 선택은 부모 state 책임)
*/

export type ChipVariant = 'button' | 'textOnly';

export interface BaseChipProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'children'
> {
  variant?: ChipVariant;
  isSelected?: boolean; /** button일 때 선택 여부. textOnly에서는 무시됨 */
  /**
   * textOnly일 때만 사용.
   * true면 파란(선택형) 스타일, false면 회색(비선택형) 스타일.
   * ServiceChip / RegionChip 래퍼가 고정값으로 넘기고, 외부에는 노출하지 않음.
   */
  textOnlyActive?: boolean;
  children: ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
}

const BASE_CLASS =
  'inline-flex items-center justify-center rounded-full border border-solid px-5 py-2.5 text-2lg-medium';

/** 활성(선택/Service textOnly): 파란 테두리·배경 */
const SELECTED_CLASS = 'border-blue-300 bg-blue-50 text-blue-300 ';

/** 비활성(미선택/Region textOnly): 회색 테두리·배경 */
const UNSELECTED_CLASS = 'border-gray-100 bg-background-100 text-blue-400 ';

export const BaseChip = ({
  variant = 'button',
  isSelected = false,
  textOnlyActive = false,
  children,
  className = '',
  type = 'button',
  disabled,
  onClick,
  ...rest
}: BaseChipProps) => {
  // textOnly는 클릭 선택이 없으므로 래퍼가 준 textOnlyActive로 색을 결정.
  // button은 부모가 넘긴 isSelected로 색을 결정.
  const isActive = variant === 'textOnly' ? textOnlyActive : isSelected;
  const colorClass = isActive ? SELECTED_CLASS : UNSELECTED_CLASS;
  const mergedClassName = cn(BASE_CLASS, colorClass, className);

  // textOnly: 시맨틱상 버튼이 아니므로 div로 렌더 (키보드/폼 제출 방지)
  if (variant === 'textOnly') {
    return (
      <div className={mergedClassName} {...rest}>
        <span className="whitespace-nowrap">{children}</span>
      </div>
    );
  }

  // button: 실제 인터랙션용. type 기본값 'button'으로 form 안에서의 의도치 않은 submit 방지
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick as ButtonHTMLAttributes<HTMLButtonElement>['onClick']}
      className={mergedClassName}
      {...(rest as HTMLAttributes<HTMLButtonElement>)}
    >
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
};
