import type { HTMLAttributes, ReactNode } from 'react';

/*
  CHIP / address (도로명 칩)

  [props]
  - size: 'sm' | 'md'
  - children: ReactNode
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
      className={`inline-flex items-center justify-center rounded-2xl bg-blue-50 text-blue-300 ${sizeStyles[size]} ${className}`.trim()}
      {...rest}
    >
      <span className="whitespace-nowrap">{children}</span>
    </div>
  );
};
