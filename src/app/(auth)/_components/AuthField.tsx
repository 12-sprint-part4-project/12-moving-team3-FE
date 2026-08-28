import { TextFieldOutlined } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

import type { ChangeEvent } from 'react';

interface AuthFieldProps {
  id: string;
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password';
  autoComplete: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isError?: boolean;
  errorMessage?: string;
  maxLength?: number;
  showVisibilityToggle?: boolean;
  className?: string;
}

/** 로그인·회원가입 공통 라벨+인풋 필드 */
export const AuthField = ({
  id,
  label,
  name,
  type = 'text',
  autoComplete,
  placeholder,
  value,
  onChange,
  isError = false,
  errorMessage,
  maxLength,
  showVisibilityToggle,
  className = '',
}: AuthFieldProps) => {
  return (
    <div className={cn('flex w-full flex-col gap-2 lg:gap-4', className)}>
      <label
        htmlFor={id}
        className="text-md-regular text-black-400 lg:text-xl-regular"
      >
        {label}
      </label>
      <TextFieldOutlined
        id={id}
        size="sm"
        type={type}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isError={isError}
        errorMessage={isError ? errorMessage : undefined}
        maxLength={maxLength}
        showVisibilityToggle={showVisibilityToggle}
        className="w-full [&_>div]:min-h-[3.375rem] [&_>div]:w-full [&_>div]:max-w-full lg:[&_>div]:min-h-16 [&_input]:lg:text-xl-regular"
      />
    </div>
  );
};
