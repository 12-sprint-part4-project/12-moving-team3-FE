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
  sm: 'px-[0.375rem] py-[0.125rem] text-xs-semibold',
  md: 'px-[0.25rem] py-[0.125rem] text-md-semibold',
};

export const AddressChip = ({
  size = 'sm',
  children,
  className = '',
  ...rest
}: AddressChipProps) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-[1rem] bg-blue-50 text-blue-300 ${sizeStyles[size]} ${className}`.trim()}
      {...rest}
    >
      <span className="whitespace-nowrap">{children}</span>
    </div>
  );
};
