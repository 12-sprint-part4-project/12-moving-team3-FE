'use client';

import {
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';

import VisibilityOffIcon from '@/assets/icons/visibility-off.svg';
import VisibilityOnIcon from '@/assets/icons/visibility-on.svg';
import { cn } from '@/lib/utils';

/*
  TEXT FIELD OUTLINED

  로그인·회원가입 등 일반 폼 입력용 outlined 필드입니다.
  hover / focus / error 상태에 따라 테두리·배경이 바뀌고,
  비밀번호일 때 눈 아이콘으로 표시/숨김을 전환할 수 있습니다.

  에러 표시 규칙 (Figma)
  - errorMessage + isError: 유효성 실패 → 빨간 테두리, 메시지 우측 정렬
  - errorMessage만 있고 값이 비어 있음: 필수 미입력 안내 → 테두리는 유지, 메시지 좌측 정렬
  - 에러가 아닐 때는 errorMessage를 undefined로 두는 것을 권장

  [props]
  - size: 'sm' | 'md'
  - errorMessage: string
  - isError: boolean
  - showVisibilityToggle: boolean (password일 때 눈 아이콘 표시)
  - leftAddon: ReactNode (입력 왼쪽 고정 표시)
  - rightIcon: ReactNode (toggle이 없을 때만 오른쪽에 렌더)
  - type / value / defaultValue / onChange / disabled
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
  /** 입력 왼쪽 고정 표시 (예: 전화번호 010) */
  leftAddon?: ReactNode;
  rightIcon?: ReactNode;
}

const sizeStyles: Record<
  InputSize,
  { field: string; input: string; error: string }
> = {
  sm: {
    field: 'min-h-[26px] w-[299px] rounded-2xl p-3.5',
    input: 'text-lg-regular',
    error: 'text-sm-medium',
  },
  md: {
    field: 'min-h-[32px] w-[612px] rounded-2xl p-3.5',
    input: 'text-xl-regular',
    error: 'text-lg-medium',
  },
};

export const TextFieldOutlined = ({
  size = 'sm',
  errorMessage,
  isError = false,
  showVisibilityToggle = false,
  leftAddon,
  rightIcon,
  type = 'text',
  className = '',
  value,
  defaultValue,
  onChange,
  disabled,
  ...rest
}: TextFieldOutlinedProps) => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // 비제어 모드(부모가 value를 안 넘기고 defaultValue만 쓸 때)에서
  // hasValue·에러 정렬을 계산하기 위한 로컬 미러(입력값을 따라가는 내부 state)
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    String(defaultValue ?? '')
  );

  // value가 있으면 제어 모드(부모가 value로 값을 관리),
  // 없으면 비제어 모드(컴포넌트 내부에서 값을 관리). 둘 다 넘기지 않도록 사용처에서 관리
  const currentValue = value !== undefined ? String(value) : uncontrolledValue;
  const hasValue = currentValue.length > 0;
  // 유효성 에러이거나, 필수 안내가 필요한 빈 값일 때 에러 UI 후보
  const showError = Boolean(errorMessage) && (isError || !hasValue);
  // 필수 미입력: 빨간 테두리는 치지 않고 메시지만 좌측에 표시
  const isRequiredFeedback = Boolean(errorMessage) && !isError && !hasValue;
  // password + toggle일 때만 type을 내부에서 text/password로 전환
  const inputType =
    showVisibilityToggle && type === 'password'
      ? isPasswordVisible
        ? 'text'
        : 'password'
      : type;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    // 제어 모드면 부모 onChange만,
    // 비제어면 로컬 미러(내부 state)도 함께 갱신
    if (value === undefined) {
      setUncontrolledValue(event.target.value);
    }
    onChange?.(event);
  };

  const handleToggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // 우선순위: 유효성 에러 > focus > hover (필수 안내는 테두리 색을 바꾸지 않음)
  let borderClass = 'border-line-200';
  let bgClass = 'bg-white';

  if (showError && !isRequiredFeedback) {
    borderClass = 'border-red-200';
  } else if (isFocused) {
    borderClass = 'border-blue-300';
  } else if (isHovered && !disabled) {
    borderClass = 'border-gray-100';
    // md만 hover 시 배경을 살짝 바꿔 Figma 스펙에 맞춤
    if (size === 'md') {
      bgClass = 'bg-background-200';
    }
  }

  return (
    <div className={cn('flex w-full flex-col', className)}>
      <div
        className={cn(
          'relative flex items-center overflow-clip border',
          sizeStyles[size].field,
          sizeStyles[size].input,
          bgClass,
          borderClass
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {leftAddon ? (
          <span className="shrink-0 text-black-400" aria-hidden>
            {leftAddon}
          </span>
        ) : null}
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
          className={cn(
            'w-full min-w-0 bg-transparent outline-none placeholder:text-gray-400 disabled:cursor-not-allowed',
            hasValue ? 'text-black-400' : 'text-gray-400'
          )}
        />

        {/* toggle이 있으면 눈 아이콘 우선, 없으면 rightIcon 슬롯 */}
        {(showVisibilityToggle || rightIcon) && (
          <div className="ml-1 flex shrink-0 items-center">
            {showVisibilityToggle ? (
              <button
                type="button"
                aria-label={
                  isPasswordVisible
                    ? t('auth.password.hide')
                    : t('auth.password.show')
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
          className={cn(
            'mt-1 text-red-200',
            isRequiredFeedback ? 'pl-2 text-left' : 'pr-2 text-right',
            sizeStyles[size].error
          )}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};
