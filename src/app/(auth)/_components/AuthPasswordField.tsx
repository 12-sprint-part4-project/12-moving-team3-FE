import { type ChangeEvent } from 'react';

import { AuthField } from './AuthField';

interface AuthPasswordFieldProps {
  id: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  label?: string;
  autoComplete?: string;
  placeholder?: string;
  maxLength?: number;
  isError?: boolean;
  errorMessage?: string;
  className?: string;
}

/** 로그인·회원가입 공통 비밀번호 필드 */
export const AuthPasswordField = ({
  id,
  value,
  onChange,
  name = 'password',
  label = '비밀번호',
  autoComplete = 'current-password',
  placeholder = '비밀번호를 입력해 주세요',
  maxLength,
  isError,
  errorMessage,
  className,
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
      className={className}
    />
  );
};
