'use client';

import { useState, type ChangeEvent, type TextareaHTMLAttributes } from 'react';

/*
  TEXT AREA 컴포넌트
  
  [props]
  - size: 'sm' | 'md'
  - errorMessage: string
  - isError: boolean
  - className: string
  - value: string
  - defaultValue: string
  - onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  - disabled: boolean
  - placeholder: string
  - ...rest: TextareaHTMLAttributes<HTMLTextAreaElement>
*/

type InputSize = 'sm' | 'md';

interface TextAreaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size'
> {
  size?: InputSize;
  errorMessage?: string;
  isError?: boolean;
}

const sizeStyles: Record<
  InputSize,
  { field: string; text: string; error: string }
> = {
  sm: {
    field: 'min-h-33 w-73 px-4 py-3.5',
    text: 'text-lg-regular',
    error: 'text-sm-medium',
  },
  md: {
    field: 'min-h-33 w-128 px-6 py-3.5',
    text: 'text-xl-regular',
    error: 'text-lg-medium',
  },
};

export const TextArea = ({
  size = 'md',
  errorMessage,
  isError = false,
  className = '',
  value,
  defaultValue,
  onChange,
  disabled,
  placeholder = '텍스트를 입력해 주세요.',
  ...rest
}: TextAreaProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    String(defaultValue ?? '')
  );

  const currentValue = value !== undefined ? String(value) : uncontrolledValue;
  const hasValue = currentValue.length > 0;
  const showError = Boolean(errorMessage) || isError;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) {
      setUncontrolledValue(event.target.value);
    }
    onChange?.(event);
  };

  return (
    <div className={`flex w-full flex-col gap-1 ${className}`.trim()}>
      <div
        className={`overflow-clip rounded-2xl ${sizeStyles[size].field} ${
          showError
            ? 'border border-red-200 bg-background-200'
            : 'border border-transparent bg-background-200'
        }`}
      >
        <textarea
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
          className={`h-full w-full resize-none bg-transparent outline-none placeholder:text-gray-300 disabled:cursor-not-allowed ${sizeStyles[size].text} ${
            hasValue || isFocused ? 'text-black-400' : 'text-gray-300'
          }`}
        />
      </div>

      {errorMessage && (
        <p className={`pl-2 text-red-200 ${sizeStyles[size].error}`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};
