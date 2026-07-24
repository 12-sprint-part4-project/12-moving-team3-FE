'use client';

import {
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import VisibilityOffIcon from '@/assets/icons/visibility-off.svg';
import VisibilityOnIcon from '@/assets/icons/visibility-on.svg';

/*
  TEXT FIELD OUTLINED 컴포넌트
  
  [props]
  - size: 'sm' | 'md'
  - errorMessage: string (입력 필드 조건 틀렸을 때, 필드 밑에 나타나는 빨간 메세지. 에러가 아닌 상황엔, 꼭 undefined로 설정해주기.)
  - isError: boolean
  - showVisibilityToggle: boolean
  - rightIcon: ReactNode
  - type: 'text' | 'password'
  - className: string
  - value: string
  - defaultValue: string
  - onChange: (event: ChangeEvent<HTMLInputElement>) => void
  - disabled: boolean
  - ...rest: InputHTMLAttributes<HTMLInputElement>
*/

type InputSize = 'sm' | 'md';

interface TextFieldOutlinedProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  size?: InputSize;
  errorMessage?: string;
  isError?: boolean;
  showVisibilityToggle?: boolean;
  rightIcon?: ReactNode;
}

const sizeStyles: Record<
  InputSize,
  { field: string; input: string; error: string }
> = {
  sm: {
    field: 'min-h-14 w-full max-w-xs rounded-2xl p-3.5',
    input: 'text-lg-regular',
    error: 'text-sm-medium',
  },
  md: {
    field: 'h-16 w-full max-w-screen-sm rounded-2xl p-3.5',
    input: 'text-xl-regular',
    error: 'text-lg-medium',
  },
};

export const TextFieldOutlined = ({
  size = 'sm',
  errorMessage,
  isError = false,
  showVisibilityToggle = false,
  rightIcon,
  type = 'text',
  className = '',
  value,
  defaultValue,
  onChange,
  disabled,
  ...rest
}: TextFieldOutlinedProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    String(defaultValue ?? '')
  );

  const currentValue = value !== undefined ? String(value) : uncontrolledValue;
  const hasValue = currentValue.length > 0;
  const showError = Boolean(errorMessage) && (isError || !hasValue);
  const isRequiredFeedback = Boolean(errorMessage) && !isError && !hasValue;
  const inputType =
    showVisibilityToggle && type === 'password'
      ? isPasswordVisible
        ? 'text'
        : 'password'
      : type;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) {
      setUncontrolledValue(event.target.value);
    }
    onChange?.(event);
  };

  const handleToggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  let borderClass = 'border-line-200';
  let bgClass = 'bg-white';

  if (showError && !isRequiredFeedback) {
    borderClass = 'border-red-200';
  } else if (isFocused) {
    borderClass = 'border-blue-300';
  } else if (isHovered && !disabled) {
    borderClass = 'border-gray-100';
    if (size === 'md') {
      bgClass = 'bg-background-200';
    }
  }

  return (
    <div className={`flex w-full flex-col ${className}`.trim()}>
      <div
        className={`relative flex items-center overflow-clip border ${sizeStyles[size].field} ${bgClass} ${borderClass}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          {...rest}
          type={inputType}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={handleChange}
          onFocus={(event) => {
            setIsFocused(true);
            rest.onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            rest.onBlur?.(event);
          }}
          className={`w-full min-w-0 bg-transparent outline-none placeholder:text-gray-400 disabled:cursor-not-allowed ${sizeStyles[size].input} ${
            hasValue ? 'text-black-400' : 'text-gray-400'
          }`}
        />

        {(showVisibilityToggle || rightIcon) && (
          <div className="ml-1 flex shrink-0 items-center">
            {showVisibilityToggle ? (
              <button
                type="button"
                aria-label={
                  isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'
                }
                onClick={handleToggleVisibility}
                className="flex size-6 items-center justify-center overflow-clip"
              >
                {isPasswordVisible ? (
                  <VisibilityOnIcon className="size-full" />
                ) : (
                  <VisibilityOffIcon className="size-full" />
                )}
              </button>
            ) : (
              rightIcon
            )}
          </div>
        )}
      </div>

      {errorMessage && (
        <p
          className={`mt-1 text-red-200 ${
            isRequiredFeedback ? 'pl-2 text-left' : 'pr-2 text-right'
          } ${sizeStyles[size].error}`}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};
