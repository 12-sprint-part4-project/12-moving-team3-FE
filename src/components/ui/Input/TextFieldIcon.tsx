'use client';

import { useState, type ChangeEvent, type InputHTMLAttributes } from 'react';

import SearchIcon from '@/assets/icons/search.svg';
import XCircleIcon from '@/assets/icons/x-circle.svg';

/*
  TEXT FIELD ICON 컴포넌트
  
  [props]
  - size: 'sm' | 'md'
  - className: string
  - ...rest: InputHTMLAttributes<HTMLInputElement>
  - value: string
  - defaultValue: string
  - onChange: (event: ChangeEvent<HTMLInputElement>) => void
  - onClear?: () => void
  - onSearch?: () => void
  - disabled: boolean
  - placeholder: string
 */

type InputSize = 'sm' | 'md';

interface TextFieldIconProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  size?: InputSize;
  onClear?: () => void;
  onSearch?: () => void;
}

const sizeStyles: Record<
  InputSize,
  { field: string; input: string; icon: string; gap: string }
> = {
  sm: {
    field: 'w-full max-w-64 gap-1.5 px-4 py-3.5',
    input: 'text-md-regular',
    icon: 'size-6',
    gap: 'gap-3',
  },
  md: {
    field: 'h-16 w-full max-w-xl gap-2 px-6 py-3.5',
    input: 'text-xl-regular',
    icon: 'size-9',
    gap: 'gap-4',
  },
};

export const TextFieldIcon = ({
  size = 'sm',
  className = '',
  value,
  defaultValue,
  onChange,
  onClear,
  onSearch,
  disabled,
  placeholder = '텍스트를 입력해 주세요.',
  ...rest
}: TextFieldIconProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    String(defaultValue ?? '')
  );

  const currentValue = value !== undefined ? String(value) : uncontrolledValue;
  const hasValue = currentValue.length > 0;
  const showActiveActions = isFocused || hasValue;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) {
      setUncontrolledValue(event.target.value);
    }
    onChange?.(event);
  };

  const handleClear = () => {
    if (value === undefined) {
      setUncontrolledValue('');
    }

    onClear?.();

    if (onChange) {
      const event = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  return (
    <div
      className={`flex items-center overflow-clip rounded-2xl bg-background-100 ${sizeStyles[size].field} ${className}`.trim()}
    >
      {!showActiveActions && (
        <SearchIcon
          aria-hidden
          className={`shrink-0 ${sizeStyles[size].icon}`}
        />
      )}

      <input
        {...rest}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={(event) => {
          setIsFocused(true);
          rest.onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          rest.onBlur?.(event);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onSearch?.();
          }
          rest.onKeyDown?.(event);
        }}
        className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-400 disabled:cursor-not-allowed ${sizeStyles[size].input} ${
          hasValue ? 'text-black-400' : 'text-gray-400'
        }`}
      />

      {showActiveActions && (
        <div className={`flex shrink-0 items-center ${sizeStyles[size].gap}`}>
          {hasValue && (
            <button
              type="button"
              aria-label="입력 내용 지우기"
              onClick={handleClear}
              className={`flex items-center justify-center overflow-clip ${sizeStyles[size].icon}`}
            >
              <XCircleIcon className="size-full" />
            </button>
          )}
          <button
            type="button"
            aria-label="검색"
            onClick={onSearch}
            className={`flex items-center justify-center overflow-clip ${sizeStyles[size].icon}`}
          >
            <SearchIcon className="size-full" />
          </button>
        </div>
      )}
    </div>
  );
};
