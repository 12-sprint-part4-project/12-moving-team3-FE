'use client';

import {
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from 'react';

import CloseIcon from '@/assets/icons/close.svg';
import SearchIcon from '@/assets/icons/search.svg';
import { useTranslation } from '@/i18n/useTranslation';

/*
  TEXT FIELD SEARCH

  검색용 입력 필드입니다.
  오른쪽에 clear(X, 값 있을 때만) + search 아이콘을 항상 표시합니다.

  [props]
  - size: 'sm' | 'md'
  - value / defaultValue: 제어·비제어 중 하나만 사용 (동시 사용 금지)
  - onChange / onClear / onSearch
  - onClear: X 클릭 시 추가 처리
  - onSearch: 검색 아이콘 클릭 또는 Enter 시 호출
  - disabled / placeholder
  - ...rest: InputHTMLAttributes<HTMLInputElement>
*/

type InputSize = 'sm' | 'md';

interface TextFieldSearchProps extends Omit<
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

export const TextFieldSearch = ({
  size = 'sm',
  className = '',
  value,
  defaultValue,
  onChange,
  onClear,
  onSearch,
  disabled,
  placeholder,
  ...rest
}: TextFieldSearchProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  // 비제어 모드(부모가 value를 안 넘길 때)에서
  // hasValue·액션 노출을 계산하기 위한 로컬 미러(입력값을 따라가는 내부 state)
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    String(defaultValue ?? '')
  );

  const currentValue = value !== undefined ? String(value) : uncontrolledValue;
  const hasValue = currentValue.length > 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) {
      setUncontrolledValue(event.target.value);
    }
    onChange?.(event);
  };

  const handleClear = () => {
    // 비제어: 로컬 미러(내부 state)를 먼저 비움
    if (value === undefined) {
      setUncontrolledValue('');
    }

    onClear?.();

    // 제어 모드(부모가 value로 값을 관리): React가 value를 소유하므로
    // native setter로 DOM을 비운 뒤 input 이벤트를 발생시켜
    // 부모 onChange(또는 폼 라이브러리)가 빈 값을 받도록 함
    const input = inputRef.current;
    if (onChange && input) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      setter?.call(input, '');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  const resolvedPlaceholder = placeholder ?? t('common.textPlaceholder');

  return (
    <div
      className={`flex items-center overflow-clip rounded-2xl bg-background-100 ${sizeStyles[size].field} ${className}`.trim()}
    >
      <input
        {...rest}
        ref={inputRef}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        placeholder={resolvedPlaceholder}
        onChange={handleChange}
        onFocus={rest.onFocus}
        onBlur={rest.onBlur}
        onKeyDown={(event) => {
          // Enter = 검색 실행 (검색창 UX)
          if (event.key === 'Enter') {
            onSearch?.();
          }
          rest.onKeyDown?.(event);
        }}
        className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-400 disabled:cursor-not-allowed ${sizeStyles[size].input} ${
          hasValue ? 'text-black-400' : 'text-gray-400'
        }`}
      />

      <div className={`flex shrink-0 items-center ${sizeStyles[size].gap}`}>
        {hasValue && (
          <button
            type="button"
            disabled={disabled}
            aria-label={t('common.clearInput')}
            onClick={handleClear}
            className={`flex cursor-pointer items-center justify-center overflow-clip ${sizeStyles[size].icon}`}
          >
            <CloseIcon className="size-full text-gray-200" />
          </button>
        )}
        <button
          type="button"
          disabled={disabled}
          aria-label={t('common.search')}
          onClick={onSearch}
          className={`flex items-center justify-center overflow-clip ${sizeStyles[size].icon}`}
        >
          <SearchIcon className="size-full text-gray-300" />
        </button>
      </div>
    </div>
  );
};
