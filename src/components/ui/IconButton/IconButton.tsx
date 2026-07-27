import type { ButtonHTMLAttributes, FC, SVGProps } from 'react';

/** SVGR로 import한 svg 아이콘 컴포넌트 타입 (`src/types/svg.d.ts` 선언과 동일한 형태) */
export type IconButtonIconComponent = FC<SVGProps<SVGSVGElement>>;

export type IconButtonSize = 'xs' | 'sm' | 'md';
export type IconButtonVariant = 'outlined' | 'kakao' | 'facebook';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 안에 보여줄 아이콘.
   * 이미 렌더링된 JSX가 아니라 `import Icon from '@/assets/icons/xxx.svg'`로 가져온
   * svg 컴포넌트 자체를 넘긴다. (`Toast`의 icon prop과 동일한 방식)
   */
  icon: IconButtonIconComponent;
  /** 아이콘만 있는 버튼이라 스크린리더가 읽을 이름을 반드시 받는다. */
  'aria-label': string;
  /** 버튼 크기. xs=40px, sm=54px, md=64px */
  size?: IconButtonSize;
  /** outlined=흰 배경+테두리(찜/링크복사), kakao/facebook=SNS 브랜드 색 배경 */
  variant?: IconButtonVariant;
  className?: string;
}

const SIZE_STYLE: Record<IconButtonSize, string> = {
  xs: 'size-10 rounded-lg',
  sm: 'size-13.5 rounded-2xl',
  md: 'size-16 rounded-2xl',
};

const VARIANT_STYLE: Record<IconButtonVariant, string> = {
  outlined: 'border border-line-200 bg-white',
  kakao: 'bg-kakao-100 text-black-500',
  facebook: 'bg-facebook-100 text-white',
};

/** md에서만 outlined(36px)와 SNS 공유 버튼(28px)의 아이콘 크기가 다르다. */
const ICON_SIZE_STYLE: Record<
  IconButtonVariant,
  Record<IconButtonSize, string>
> = {
  outlined: { xs: 'size-6', sm: 'size-6', md: 'size-9' },
  kakao: { xs: 'size-6', sm: 'size-6', md: 'size-7' },
  facebook: { xs: 'size-6', sm: 'size-6', md: 'size-7' },
};

/**
 * 아이콘 하나만 담는 정사각형 버튼 (Figma "etc" 시트의 찜/링크복사/SNS 공유 버튼).
 * 아이콘 색은 버튼이 상속시키는 `currentColor`를 따르므로, 색을 바꿀 때는
 * className에 텍스트 색 토큰(예: `text-blue-400`)을 넘긴다.
 */
export const IconButton = ({
  icon: Icon,
  size = 'sm',
  variant = 'outlined',
  className = '',
  type = 'button',
  ...rest
}: IconButtonProps) => (
  <button
    type={type}
    className={`inline-flex shrink-0 items-center justify-center ${SIZE_STYLE[size]} ${VARIANT_STYLE[variant]} ${className}`}
    {...rest}
  >
    <Icon
      className={`${ICON_SIZE_STYLE[variant][size]} shrink-0`}
      aria-hidden
    />
  </button>
);
