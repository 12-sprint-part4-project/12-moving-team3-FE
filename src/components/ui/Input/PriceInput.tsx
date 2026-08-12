'use client';

import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

import { cn } from '@/lib/utils';

/*
  PRICE INPUT

  금액 입력.
  react-currency-input-field로 천 단위 콤마·커서 유지를 처리

  [props]
  - value: 숫자만 담은 문자열 (예: '1500000')
  - onValueChange: 숫자 문자열 변경 콜백 (빈 값이면 '')
  - errorMessage / isError: TextFieldOutlined와 동일한 에러 표시
  - size: 'sm' | 'md'
*/

type InputSize = 'sm' | 'md';

export interface PriceInputProps {
  value: string;
  onValueChange: (value: string) => void;
  size?: InputSize;
  placeholder?: string;
  errorMessage?: string;
  isError?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  id?: string;
  name?: string;
}

const sizeStyles: Record<
  InputSize,
  { field: string; input: string; error: string }
> = {
  sm: {
    field: 'min-h-[26px] w-full rounded-2xl p-3.5',
    input: 'text-lg-regular',
    error: 'text-sm-medium',
  },
  md: {
    field: 'min-h-[32px] w-full rounded-2xl p-3.5',
    input: 'text-xl-regular',
    error: 'text-lg-medium',
  },
};

export const PriceInput = ({
  value,
  onValueChange,
  size = 'sm',
  placeholder = '견적가 입력',
  errorMessage,
  isError = false,
  disabled = false,
  className = '',
  id,
  name,
  'aria-label': ariaLabel = '견적가',
}: PriceInputProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value.length > 0;
  const showError = Boolean(errorMessage) && (isError || !hasValue);
  const isRequiredFeedback = Boolean(errorMessage) && !isError && !hasValue;

  let borderClass = 'border-transparent';
  if (showError && !isRequiredFeedback) {
    borderClass = 'border-red-200';
  } else if (isFocused) {
    borderClass = 'border-blue-300';
  } else if (isHovered && !disabled) {
    borderClass = 'border-gray-100';
  }

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div className={cn('flex w-full flex-col', className)}>
      <div
        className={cn(
          'relative flex items-center overflow-clip border bg-background-200',
          sizeStyles[size].field,
          borderClass
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CurrencyInput
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel}
          allowDecimals={false}
          allowNegativeValue={false}
          disableAbbreviations
          groupSeparator=","
          decimalSeparator="."
          inputMode="numeric"
          onValueChange={(nextValue) => {
            onValueChange(nextValue ?? '');
          }}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'w-full min-w-0 bg-transparent outline-none placeholder:text-gray-400 disabled:cursor-not-allowed',
            sizeStyles[size].input,
            hasValue ? 'text-black-400' : 'text-gray-400'
          )}
        />
      </div>

      {errorMessage ? (
        <p
          className={cn(
            'mt-1 pl-2 text-left text-red-200',
            sizeStyles[size].error
          )}
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};
