import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type ChipVariant = 'button' | 'textOnly';

export interface BaseChipProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'children'
> {
  variant?: ChipVariant;
  isSelected?: boolean;
  /** textOnly일 때 활성(파란) 스타일 여부 */
  textOnlyActive?: boolean;
  children: ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
}

const BASE_CLASS =
  'inline-flex items-center justify-center rounded-full border border-solid px-5 py-2.5 text-2lg-medium';

const SELECTED_CLASS = 'border-blue-300 bg-blue-50 text-blue-300 shadow-sm';

const UNSELECTED_CLASS =
  'border-gray-100 bg-background-100 text-blue-400 shadow-sm';

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
  const isActive = variant === 'textOnly' ? textOnlyActive : isSelected;
  const colorClass = isActive ? SELECTED_CLASS : UNSELECTED_CLASS;
  const mergedClassName = `${BASE_CLASS} ${colorClass} ${className}`.trim();

  if (variant === 'textOnly') {
    return (
      <div className={mergedClassName} {...rest}>
        <span className="whitespace-nowrap">{children}</span>
      </div>
    );
  }

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
