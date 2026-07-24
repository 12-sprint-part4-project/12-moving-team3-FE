import type { HTMLAttributes, ReactNode } from 'react';

import BoxFillIcon from '@/assets/icons/box-fill.svg';
import DockFillIcon from '@/assets/icons/dock-fill.svg';
import HomeFillIcon from '@/assets/icons/home-fill.svg';
import OfficeFillIcon from '@/assets/icons/office-fill.svg';

/*
  CHIP / 이사유형

  [props]
  - type: 'small' | 'home' | 'office' | 'designated' | 'quotePending' (quotePending는, xs사이즈가 없음.)
  - size: 'xs' | 'sm' | 'md'
  - children: ReactNode (미지정 시 type별 기본 라벨)
  - className: string
*/

type MoveType = 'small' | 'home' | 'office' | 'designated' | 'quotePending';
type MoveTypeSize = 'xs' | 'sm' | 'md';

interface MoveTypeChipProps extends HTMLAttributes<HTMLDivElement> {
  type?: MoveType;
  size?: MoveTypeSize;
  children?: ReactNode;
}

const DEFAULT_LABELS: Record<MoveType, string> = {
  small: '소형이사',
  home: '가정이사',
  office: '사무실이사',
  designated: '지정 견적 요청',
  quotePending: '견적 대기',
};

const themeStyles: Record<MoveType, string> = {
  small: 'bg-blue-100 text-blue-300',
  home: 'bg-blue-100 text-blue-300',
  office: 'bg-blue-100 text-blue-300',
  designated: 'bg-red-100 text-red-200',
  quotePending: 'bg-line-100 text-blue-400',
};

const sizeStyles: Record<MoveTypeSize, string> = {
  xs: 'p-[0.125rem]',
  sm: 'gap-[0.125rem] py-[0.125rem] pr-[0.375rem] pl-[0.125rem] text-sm-semibold',
  md: 'gap-[0.25rem] py-[0.25rem] pr-[0.3125rem] pl-[0.1875rem] text-lg-semibold',
};

const quotePendingSizeStyles: Record<Exclude<MoveTypeSize, 'xs'>, string> = {
  sm: 'px-[0.375rem] py-[0.125rem] text-sm-semibold',
  md: 'px-[0.375rem] py-[0.25rem] text-lg-semibold',
};

const iconSizeStyles: Record<MoveTypeSize, string> = {
  xs: 'size-[1.25rem]',
  sm: 'size-[1.25rem]',
  md: 'size-[1.5rem]',
};

const ICONS: Record<Exclude<MoveType, 'quotePending'>, typeof BoxFillIcon> = {
  small: BoxFillIcon,
  home: HomeFillIcon,
  office: OfficeFillIcon,
  designated: DockFillIcon,
};

export const MoveTypeChip = ({
  type = 'small',
  size = 'sm',
  children,
  className = '',
  ...rest
}: MoveTypeChipProps) => {
  const label = children ?? DEFAULT_LABELS[type];
  const isIconOnly = size === 'xs';
  const Icon = type === 'quotePending' ? null : ICONS[type];

  const layoutClass =
    type === 'quotePending' && size !== 'xs'
      ? quotePendingSizeStyles[size]
      : sizeStyles[size];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-[0.25rem] shadow-[4px_4px_4px_rgba(217,217,217,0.1)] ${themeStyles[type]} ${layoutClass} ${className}`.trim()}
      {...rest}
    >
      {Icon && (
        <Icon aria-hidden className={`shrink-0 ${iconSizeStyles[size]}`} />
      )}
      {!isIconOnly && <span className="whitespace-nowrap">{label}</span>}
    </div>
  );
};
