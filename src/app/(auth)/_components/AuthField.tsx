import { TextFieldOutlined } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

import {
  AUTH_FIELD_CLASS,
  AUTH_FIELD_GROUP_CLASS,
  AUTH_LABEL_CLASS,
} from './authStyles';

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
    <div className={cn(AUTH_FIELD_GROUP_CLASS, className)}>
      <label htmlFor={id} className={AUTH_LABEL_CLASS}>
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
        className={AUTH_FIELD_CLASS}
      />
    </div>
  );
};
