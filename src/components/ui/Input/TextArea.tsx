'use client';

import { useState, type ChangeEvent, type TextareaHTMLAttributes } from 'react';

/*
  TEXT AREA

  여러 줄 텍스트 입력(요청 사항, 리뷰 등)용입니다.
  outlined 필드와 달리 기본 배경이 background-200이고,
  에러일 때만 빨간 테두리를 켭니다 (평소엔 transparent border로 레이아웃 점프 방지).

  [props]
  - size: 'sm' | 'md'
  - errorMessage / isError: 둘 중 하나라도 있으면 에러 스타일
  - value / defaultValue / onChange / disabled / placeholder
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
  // 비제어 모드(부모가 value를 안 넘길 때)에서
  // 글자색(hasValue) 판단을 위한 로컬 미러(입력값을 따라가는 내부 state)
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    String(defaultValue ?? '')
  );

  const currentValue = value !== undefined ? String(value) : uncontrolledValue;
  const hasValue = currentValue.length > 0;
  // Outlined와 달리 isError만으로도 테두리를 켤 수 있음
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
        className={`flex flex-col overflow-clip rounded-2xl ${sizeStyles[size].field} ${
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
          // 포커스 중이거나 값이 있으면 본문색, 아니면 placeholder와 같은 회색
          className={`min-h-0 w-full flex-1 resize-none bg-transparent outline-none placeholder:text-gray-300 disabled:cursor-not-allowed ${sizeStyles[size].text} ${
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
