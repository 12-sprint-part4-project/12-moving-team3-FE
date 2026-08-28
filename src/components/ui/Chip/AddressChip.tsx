import type { HTMLAttributes, ReactNode } from 'react';

/*
  ADDRESS CHIP

  출발지/도착지 등 짧은 주소(시·구 단위)를 표시하는 라벨 칩입니다.
  선택·클릭 없이 정보 표시만 담당하며, 파란 연한 배경으로 주소임을 구분합니다.

  [props]
  - size: 'sm' | 'md'
  - children: ReactNode (예: '서울 강남구')
  - className: string
*/

type AddressSize = 'sm' | 'md';

interface AddressChipProps extends HTMLAttributes<HTMLDivElement> {
  size?: AddressSize;
  children: ReactNode;
}

const sizeStyles: Record<AddressSize, string> = {
  sm: 'px-1.5 py-0.5 text-xs-semibold',
  md: 'px-1 py-0.5 text-md-semibold',
};

export const AddressChip = ({
  size = 'sm',
  children,
  className = '',
  ...rest
}: AddressChipProps) => {
  return (
    <div
      // rounded-2xl + blue-50: 주소 태그용 연한 필 형태 (Figma address chip)
      className={`inline-flex items-center justify-center rounded-2xl bg-blue-50 text-blue-300 ${sizeStyles[size]} ${className}`.trim()}
      {...rest}
    >
      <span className="whitespace-nowrap">{children}</span>
    </div>
  );
};
