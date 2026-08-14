'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AuthBrand, AuthHelperText } from '@/app/(auth)/_components/AuthBrand';
import { AuthEmailField } from '@/app/(auth)/_components/AuthEmailField';
import { AuthField } from '@/app/(auth)/_components/AuthField';
import { AuthKakaoSection } from '@/app/(auth)/_components/AuthKakaoSection';
import { AuthPasswordField } from '@/app/(auth)/_components/AuthPasswordField';
import {
  AUTH_PATH,
  USER_TYPE_BY_ROLE,
  getAuthRoleSwitch,
} from '@/app/(auth)/_components/authRole';
import { Button } from '@/components/Button/Button';
import { API_ERROR_CODE } from '@/constants/errorCode';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { redirectToKakaoLogin } from '@/lib/kakaoAuth';
import { validateEmail } from '@/lib/validateEmail';
import {
  PASSWORD_FORMAT_ERROR_MESSAGE,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MISMATCH_ERROR_MESSAGE,
  validatePassword,
} from '@/lib/validatePassword';
import { signup } from '@/services/authApi';

import type { AuthRole } from '@/app/(auth)/_components/authRole';
import type { ChangeEvent, FormEvent } from 'react';

interface SignupFormProps {
  role: AuthRole;
}

interface SignupFormValues {
  name: string;
  email: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
}

const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 20;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 20;

const NAME_FORMAT_ERROR_MESSAGE = `이름은 ${NAME_MIN_LENGTH}~${NAME_MAX_LENGTH}자로 입력해 주세요.`;
const NICKNAME_FORMAT_ERROR_MESSAGE = `닉네임은 ${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}자로 입력해 주세요.`;
const EMAIL_FORMAT_FIELD_ERROR_MESSAGE = '이메일 형식이 아닙니다.';
const PASSWORD_FORMAT_FIELD_ERROR_MESSAGE = '비밀번호가 올바르지 않습니다.';

const INITIAL_VALUES: SignupFormValues = {
  name: '',
  email: '',
  nickname: '',
  password: '',
  passwordConfirm: '',
};

/** 전화번호는 프로필 등록에서 받는다. */
export const SignupForm = ({ role }: SignupFormProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [values, setValues] = useState<SignupFormValues>(INITIAL_VALUES);
  const [isPending, setIsPending] = useState(false);

  const roleSwitch = getAuthRoleSwitch('signup', role);
  const userType = USER_TYPE_BY_ROLE[role];
  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();
  const trimmedNickname = values.nickname.trim();

  const isNameFormatError =
    trimmedName.length > 0 &&
    (trimmedName.length < NAME_MIN_LENGTH ||
      trimmedName.length > NAME_MAX_LENGTH);
  const isEmailFormatError =
    trimmedEmail.length > 0 && Boolean(validateEmail(trimmedEmail));
  const isNicknameFormatError =
    trimmedNickname.length > 0 &&
    (trimmedNickname.length < NICKNAME_MIN_LENGTH ||
      trimmedNickname.length > NICKNAME_MAX_LENGTH);
  const isPasswordFormatError =
    values.password.length > 0 && Boolean(validatePassword(values.password));
  const isPasswordMismatchError =
    values.passwordConfirm.length > 0 &&
    values.password !== values.passwordConfirm;

  const isSubmittable =
    trimmedName.length >= NAME_MIN_LENGTH &&
    trimmedName.length <= NAME_MAX_LENGTH &&
    trimmedEmail.length > 0 &&
    !isEmailFormatError &&
    trimmedNickname.length >= NICKNAME_MIN_LENGTH &&
    trimmedNickname.length <= NICKNAME_MAX_LENGTH &&
    values.password.length > 0 &&
    !isPasswordFormatError &&
    values.passwordConfirm.length > 0 &&
    !isPasswordMismatchError &&
    !isPending;
  const submitLabel = isPending ? '가입 중...' : '시작하기';

  const handleChange =
    (field: keyof SignupFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmittable) return;

    setIsPending(true);

    try {
      await signup({
        userType,
        name: trimmedName,
        nickname: trimmedNickname,
        email: trimmedEmail,
        password: values.password,
        passwordConfirmation: values.passwordConfirm,
      });

      // 이메일 가입은 로그인 페이지로, 카카오는 콜백에서 바로 로그인
      showToast({ content: '회원가입이 완료되었습니다. 로그인해 주세요.' });
      router.replace(AUTH_PATH.login[role]);
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.code === API_ERROR_CODE.INVALID_PASSWORD_FORMAT
      ) {
        showToast({ content: PASSWORD_FORMAT_ERROR_MESSAGE });
        return;
      }

      const message =
        error instanceof ApiError
          ? error.message
          : '회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.';
      showToast({ content: message });
    } finally {
      setIsPending(false);
    }
  };

  const handleKakaoLogin = () => {
    if (isPending) return;

    try {
      redirectToKakaoLogin(userType);
    } catch {
      showToast({ content: '카카오 로그인 설정이 필요합니다.' });
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-8 lg:gap-14">
      <AuthBrand
        prompt={roleSwitch.prompt}
        linkLabel={roleSwitch.linkLabel}
        href={roleSwitch.href}
      />

      <div className="flex w-full flex-col items-center gap-12 lg:gap-[4.5rem]">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex w-full max-w-[20.4375rem] flex-col items-center gap-4 lg:max-w-[40rem] lg:gap-6"
        >
          <div className="flex w-full flex-col gap-8 lg:gap-14">
            <div className="flex w-full flex-col gap-4 lg:gap-8">
              <AuthField
                id="signup-name"
                label="이름"
                name="name"
                autoComplete="name"
                placeholder="성함을 입력해 주세요"
                value={values.name}
                onChange={handleChange('name')}
                isError={isNameFormatError}
                errorMessage={NAME_FORMAT_ERROR_MESSAGE}
              />
              <AuthEmailField
                id="signup-email"
                value={values.email}
                onChange={handleChange('email')}
                isError={isEmailFormatError}
                errorMessage={EMAIL_FORMAT_FIELD_ERROR_MESSAGE}
              />
              <AuthField
                id="signup-nickname"
                label="닉네임"
                name="nickname"
                autoComplete="nickname"
                placeholder="닉네임을 입력해 주세요"
                value={values.nickname}
                onChange={handleChange('nickname')}
                isError={isNicknameFormatError}
                errorMessage={NICKNAME_FORMAT_ERROR_MESSAGE}
              />
              <AuthPasswordField
                id="signup-password"
                autoComplete="new-password"
                maxLength={PASSWORD_MAX_LENGTH}
                value={values.password}
                onChange={handleChange('password')}
                isError={isPasswordFormatError}
                errorMessage={PASSWORD_FORMAT_FIELD_ERROR_MESSAGE}
              />
              <AuthPasswordField
                id="signup-password-confirm"
                name="passwordConfirm"
                label="비밀번호 확인"
                autoComplete="new-password"
                maxLength={PASSWORD_MAX_LENGTH}
                placeholder="비밀번호를 다시 한번 입력해 주세요"
                value={values.passwordConfirm}
                onChange={handleChange('passwordConfirm')}
                isError={isPasswordMismatchError}
                errorMessage={PASSWORD_MISMATCH_ERROR_MESSAGE}
              />
            </div>

            <Button
              type="submit"
              variant="solid"
              size="sm"
              disabled={!isSubmittable}
              className="lg:h-16 lg:gap-2 lg:text-xl-semibold"
            >
              {submitLabel}
            </Button>
          </div>

          <AuthHelperText
            prompt="이미 무빙 회원이신가요?"
            linkLabel="로그인"
            href={AUTH_PATH.login[role]}
          />
        </form>

        <AuthKakaoSection
          ariaLabel="카카오로 가입"
          disabled={isPending}
          onClick={handleKakaoLogin}
        />
      </div>
    </div>
  );
};
