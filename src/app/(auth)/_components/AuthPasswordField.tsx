import { AuthField } from './AuthField';

import type { ChangeEvent } from 'react';

interface AuthPasswordFieldProps {
  id: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder: string;
  name?: string;
  autoComplete?: string;
  maxLength?: number;
  isError?: boolean;
  errorMessage?: string;
}

/** 로그인·회원가입 공통 비밀번호 필드 */
export const AuthPasswordField = ({
  id,
  value,
  onChange,
  label,
  placeholder,
  name = 'password',
  autoComplete = 'current-password',
  maxLength,
  isError,
  errorMessage,
}: AuthPasswordFieldProps) => {
  return (
    <AuthField
      id={id}
      name={name}
      type="password"
      autoComplete={autoComplete}
      label={label}
      placeholder={placeholder}
      maxLength={maxLength}
      showVisibilityToggle
      value={value}
      onChange={onChange}
      isError={isError}
      errorMessage={errorMessage}
    />
  );
};
