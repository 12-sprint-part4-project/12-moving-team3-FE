import { type ChangeEvent } from 'react';

import { EMAIL_MAX_LENGTH } from '@/lib/validateEmail';

import { AuthField } from './AuthField';

interface AuthEmailFieldProps {
  id: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isError?: boolean;
  errorMessage?: string;
  className?: string;
}

/** 로그인·회원가입 공통 이메일 필드 */
export const AuthEmailField = ({
  id,
  value,
  onChange,
  isError,
  errorMessage,
  className,
}: AuthEmailFieldProps) => {
  return (
    <AuthField
      id={id}
      name="email"
      type="email"
      autoComplete="email"
      label="이메일"
      placeholder="이메일을 입력해 주세요"
      maxLength={EMAIL_MAX_LENGTH}
      value={value}
      onChange={onChange}
      isError={isError}
      errorMessage={errorMessage}
      className={className}
    />
  );
};
