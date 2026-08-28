'use client';

import BoxFillIcon from '@/assets/icons/box-fill.svg';
import DockFillIcon from '@/assets/icons/dock-fill.svg';
import HomeFillIcon from '@/assets/icons/home-fill.svg';
import OfficeFillIcon from '@/assets/icons/office-fill.svg';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import type { HTMLAttributes, ReactNode } from 'react';

/*
  MOVE TYPE CHIP

  견적/요청 카드 등에 붙는 이사 유형 뱃지입니다. (표시 전용, 클릭 없음)
  type별로 아이콘·색·기본 라벨이 다르고, size로 밀도(아이콘만 ↔ 라벨 포함)를 조절합니다.

  [props]
  - type: 'small' | 'home' | 'office' | 'designated' | 'quotePending' | 'quoteConfirmed' | 'quoteRejected' | 'quoteClosed' | 'furnitureShare'
    · quotePending/quoteConfirmed/quoteRejected/quoteClosed/furnitureShare는 아이콘이 없고 xs 사이즈도 없음 (텍스트만 상태 표시용)
  - size: 'xs' | 'sm' | 'md' (xs = 아이콘만)
  - children: ReactNode (미지정 시 type별 기본 라벨)
  - className: string
*/

type IconMoveType = 'small' | 'home' | 'office' | 'designated';
type StatusMoveType =
  | 'quotePending'
  | 'quoteConfirmed'
  | 'quoteRejected'
  | 'quoteClosed'
  | 'furnitureShare';
type MoveType = IconMoveType | StatusMoveType;
type MoveTypeSize = 'xs' | 'sm' | 'md';
type StatusMoveTypeSize = Exclude<MoveTypeSize, 'xs'>;

interface MoveTypeChipBaseProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

interface IconMoveTypeChipProps extends MoveTypeChipBaseProps {
  type?: IconMoveType;
  size?: MoveTypeSize;
}

interface StatusMoveTypeChipProps extends MoveTypeChipBaseProps {
  type: StatusMoveType;
  size?: StatusMoveTypeSize;
}

type MoveTypeChipProps = IconMoveTypeChipProps | StatusMoveTypeChipProps;

const MOVE_TYPE_I18N_KEY: Record<
  'small' | 'home' | 'office',
  'SMALL' | 'HOME' | 'OFFICE'
> = {
  small: 'SMALL',
  home: 'HOME',
  office: 'OFFICE',
};

// 일반 이사 = 파란, 지정 요청 = 빨간(강조), 상태칩(대기/확정/반려) = 회색 배경·진한 텍스트 (Figma Chip/이사유형)
const themeStyles: Record<MoveType, string> = {
  small: 'bg-blue-100 text-blue-300',
  home: 'bg-blue-100 text-blue-300',
  office: 'bg-blue-100 text-blue-300',
  designated: 'bg-red-100 text-red-200',
  quotePending: 'bg-line-100 text-blue-400',
  quoteConfirmed: 'bg-line-100 text-blue-400',
  quoteRejected: 'bg-line-100 text-blue-400',
  quoteClosed: 'bg-line-100 text-blue-400',
  furnitureShare: 'bg-yellow-100/12 text-yellow-100',
};

// 아이콘+라벨 레이아웃. 왼쪽 패딩을 작게 해 아이콘이 라벨에 붙도록 함
const sizeStyles: Record<MoveTypeSize, string> = {
  xs: 'p-0.5',
  sm: 'gap-0.5 py-0.5 pr-1.5 pl-0.5 text-sm-semibold',
  md: 'gap-1 py-1 pr-1.25 pl-0.5 text-lg-semibold',
};

// 상태칩은 아이콘이 없어 좌우 패딩을 대칭으로 맞춤 (Figma 스펙)
const statusChipSizeStyles: Record<Exclude<MoveTypeSize, 'xs'>, string> = {
  sm: 'px-1.5 py-0.5 text-sm-semibold',
  md: 'px-1.5 py-1 text-lg-semibold',
};

const iconSizeStyles: Record<MoveTypeSize, string> = {
  xs: 'size-5',
  sm: 'size-5',
  md: 'size-6',
};

const isStatusChip = (type: MoveType): type is StatusMoveType =>
  type === 'quotePending' ||
  type === 'quoteConfirmed' ||
  type === 'quoteRejected' ||
  type === 'quoteClosed' ||
  type === 'furnitureShare';

// 상태칩은 아이콘 맵에서 제외 (상태 텍스트만 표시)
const ICONS: Record<Exclude<MoveType, StatusMoveType>, typeof BoxFillIcon> = {
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
  const { t } = useTranslation();

  const defaultLabel = (() => {
    if (type === 'designated') {
      return t('moveType.designated');
    }
    if (type === 'furnitureShare') {
      return t('moveType.furnitureShare');
    }
    if (type === 'quotePending') {
      return t('quoteStatus.pending');
    }
    if (type === 'quoteConfirmed') {
      return t('quoteStatus.confirmed');
    }
    if (type === 'quoteRejected') {
      return t('quoteStatus.rejected');
    }
    if (type === 'quoteClosed') {
      return t('chat.closedEstimate.EXPIRED');
    }
    return t(`moveType.${MOVE_TYPE_I18N_KEY[type as 'small' | 'home' | 'office']}`);
  })();

  const label = children ?? defaultLabel;
  // xs: 좁은 공간(리스트 썸네일 등)용 아이콘-only
  const isIconOnly = size === 'xs';
  const Icon = isStatusChip(type) ? null : ICONS[type];

  // 상태칩은 아이콘 없는 전용 패딩, 그 외는 공통 sizeStyles
  const layoutClass =
    isStatusChip(type) && size !== 'xs'
      ? statusChipSizeStyles[size]
      : sizeStyles[size];

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded shadow-sm',
        themeStyles[type],
        layoutClass,
        className
      )}
      {...rest}
    >
      {Icon && (
        <Icon aria-hidden className={`shrink-0 ${iconSizeStyles[size]}`} />
      )}
      {!isIconOnly && <span className="whitespace-nowrap">{label}</span>}
    </div>
  );
};
