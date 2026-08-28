import { EMAIL_MAX_LENGTH } from '@/lib/validateEmail';

import { AuthField } from './AuthField';

import type { ChangeEvent } from 'react';

interface AuthEmailFieldProps {
  id: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder: string;
  isError?: boolean;
  errorMessage?: string;
}

/** 로그인·회원가입 공통 이메일 필드 */
export const AuthEmailField = ({
  id,
  value,
  onChange,
  label,
  placeholder,
  isError,
  errorMessage,
}: AuthEmailFieldProps) => {
  return (
    <AuthField
      id={id}
      name="email"
      type="email"
      autoComplete="email"
      label={label}
      placeholder={placeholder}
      maxLength={EMAIL_MAX_LENGTH}
      value={value}
      onChange={onChange}
      isError={isError}
      errorMessage={errorMessage}
    />
  );
};
