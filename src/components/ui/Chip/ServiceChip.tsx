import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

/*
  SERVICE CHIP

  두 용도로 구분됩니다.
  button으로 사용하기 : 프로필 등록 등..
  textOnly으로 사용하기 : 기사님 상세 페이지 등..

  [props]
  - variant: 'button' | 'textOnly'
  - isSelected: boolean (button일 때 선택 여부)
  - children: ReactNode
  - className: string
*/

type ChipVariant = 'button' | 'textOnly';

type ServiceChipProps = {
  variant?: ChipVariant;
  isSelected?: boolean;
  children: ReactNode;
  className?: string;
} & (
  | ({ variant?: 'button' } & ButtonHTMLAttributes<HTMLButtonElement>)
  | ({ variant: 'textOnly' } & HTMLAttributes<HTMLDivElement>)
);

const BASE_CLASS =
  'inline-flex items-center justify-center rounded-full border border-solid px-[1.25rem] py-[0.625rem] text-2lg-medium';

const SELECTED_CLASS =
  'border-blue-300 bg-blue-50 text-blue-300 shadow-[4px_4px_5px_rgba(230,230,230,0.25)]';

const UNSELECTED_CLASS =
  'border-gray-100 bg-background-100 text-blue-400 shadow-[4px_4px_5px_rgba(230,230,230,0.16)]';

export const ServiceChip = ({
  variant = 'button',
  isSelected = false,
  children,
  className = '',
  ...rest
}: ServiceChipProps) => {
  const colorClass =
    variant === 'textOnly' || (variant === 'button' && isSelected)
      ? SELECTED_CLASS
      : UNSELECTED_CLASS;
  const mergedClassName = `${BASE_CLASS} ${colorClass} ${className}`.trim();

  if (variant === 'textOnly') {
    const { ...divRest } = rest as HTMLAttributes<HTMLDivElement>;

    return (
      <div className={mergedClassName} {...divRest}>
        <span className="whitespace-nowrap">{children}</span>
      </div>
    );
  }

  const { type = 'button', ...buttonRest } =
    rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={type} className={mergedClassName} {...buttonRest}>
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
};
