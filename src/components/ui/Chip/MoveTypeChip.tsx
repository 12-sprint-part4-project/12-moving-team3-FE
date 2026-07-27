import type { HTMLAttributes, ReactNode } from 'react';

import BoxFillIcon from '@/assets/icons/box-fill.svg';
import DockFillIcon from '@/assets/icons/dock-fill.svg';
import HomeFillIcon from '@/assets/icons/home-fill.svg';
import OfficeFillIcon from '@/assets/icons/office-fill.svg';

/*
  MOVE TYPE CHIP

  견적/요청 카드 등에 붙는 이사 유형 뱃지입니다. (표시 전용, 클릭 없음)
  type별로 아이콘·색·기본 라벨이 다르고, size로 밀도(아이콘만 ↔ 라벨 포함)를 조절합니다.

  [props]
  - type: 'small' | 'home' | 'office' | 'designated' | 'quotePending'
    · quotePending는 아이콘이 없고 xs 사이즈도 없음 (텍스트만 상태 표시용)
  - size: 'xs' | 'sm' | 'md' (xs = 아이콘만)
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

// 일반 이사 = 파란, 지정 요청 = 빨간(강조), 견적 대기 = 회색(대기 상태)
const themeStyles: Record<MoveType, string> = {
  small: 'bg-blue-100 text-blue-300',
  home: 'bg-blue-100 text-blue-300',
  office: 'bg-blue-100 text-blue-300',
  designated: 'bg-red-100 text-red-200',
  quotePending: 'bg-line-100 text-blue-400',
};

// 아이콘+라벨 레이아웃. 왼쪽 패딩을 작게 해 아이콘이 라벨에 붙도록 함
const sizeStyles: Record<MoveTypeSize, string> = {
  xs: 'p-0.5',
  sm: 'gap-0.5 py-0.5 pr-1.5 pl-0.5 text-sm-semibold',
  md: 'gap-1 py-1 pr-1.25 pl-0.5 text-lg-semibold',
};

// quotePending는 아이콘이 없어 좌우 패딩을 대칭으로 맞춤 (Figma 스펙)
const quotePendingSizeStyles: Record<Exclude<MoveTypeSize, 'xs'>, string> = {
  sm: 'px-1.5 py-0.5 text-sm-semibold',
  md: 'px-1.5 py-1 text-lg-semibold',
};

const iconSizeStyles: Record<MoveTypeSize, string> = {
  xs: 'size-5',
  sm: 'size-5',
  md: 'size-6',
};

// quotePending는 아이콘 맵에서 제외 (상태 텍스트만 표시)
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
  // xs: 좁은 공간(리스트 썸네일 등)용 아이콘-only
  const isIconOnly = size === 'xs';
  const Icon = type === 'quotePending' ? null : ICONS[type];

  // quotePending는 아이콘 없는 전용 패딩, 그 외는 공통 sizeStyles
  const layoutClass =
    type === 'quotePending' && size !== 'xs'
      ? quotePendingSizeStyles[size]
      : sizeStyles[size];

  return (
    <div
      className={`inline-flex items-center justify-center rounded shadow-sm ${themeStyles[type]} ${layoutClass} ${className}`.trim()}
      {...rest}
    >
      {Icon && (
        <Icon aria-hidden className={`shrink-0 ${iconSizeStyles[size]}`} />
      )}
      {!isIconOnly && <span className="whitespace-nowrap">{label}</span>}
    </div>
  );
};
