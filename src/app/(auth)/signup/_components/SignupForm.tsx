'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';

import { AuthBrand } from '@/app/(auth)/_components/AuthBrand';
import { AuthEmailField } from '@/app/(auth)/_components/AuthEmailField';
import { AuthField } from '@/app/(auth)/_components/AuthField';
import { AuthHelperText } from '@/app/(auth)/_components/AuthHelperText';
import { AuthKakaoSection } from '@/app/(auth)/_components/AuthKakaoSection';
import { AuthPasswordField } from '@/app/(auth)/_components/AuthPasswordField';
import {
  USER_TYPE_BY_ROLE,
  getAuthRoleSwitch,
} from '@/app/(auth)/_components/authRole';
import { Button } from '@/components/Button/Button';
import { API_ERROR_CODE } from '@/constants/errorCode';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { LOGIN_HREF_BY_USER_TYPE } from '@/lib/authRoutePaths';
import { redirectToKakaoLogin } from '@/lib/kakaoAuth';
import { validateEmail } from '@/lib/validateEmail';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  validatePassword,
} from '@/lib/validatePassword';
import { signup } from '@/services/authApi';

import type { AuthRole } from '@/app/(auth)/_components/authRole';
import type { ChangeEvent, SubmitEvent } from 'react';

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

const INITIAL_VALUES: SignupFormValues = {
  name: '',
  email: '',
  nickname: '',
  password: '',
  passwordConfirm: '',
};

/** 이메일·카카오 회원가입 폼. 전화번호는 프로필 등록에서 받는다. */
export const SignupForm = ({ role }: SignupFormProps) => {
  const router = useRouter();
  const { t } = useTranslation();
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
  const submitLabel = isPending
    ? t('auth.signup.submitting')
    : t('auth.signup.submit');
  const nameFormatErrorMessage = t('auth.validation.nameFormat', {
    min: NAME_MIN_LENGTH,
    max: NAME_MAX_LENGTH,
  });
  const nicknameFormatErrorMessage = t('auth.validation.nicknameFormat', {
    min: NICKNAME_MIN_LENGTH,
    max: NICKNAME_MAX_LENGTH,
  });
  const emailFormatFieldErrorMessage = t('auth.validation.emailInvalid');
  const passwordFormatFieldErrorMessage = t(
    'auth.validation.passwordFormatShort'
  );
  const passwordMismatchErrorMessage = t('auth.validation.passwordMismatch');
  const passwordFormatErrorMessage = t('auth.validation.passwordFormat', {
    min: PASSWORD_MIN_LENGTH,
    max: PASSWORD_MAX_LENGTH,
  });

  const handleChange =
    (field: keyof SignupFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
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
      showToast({ content: t('auth.signup.success') });
      router.replace(LOGIN_HREF_BY_USER_TYPE[userType]);
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.code === API_ERROR_CODE.INVALID_PASSWORD_FORMAT
      ) {
        showToast({ content: passwordFormatErrorMessage });
        return;
      }

      const message =
        error instanceof ApiError
          ? error.message
          : t('auth.signup.unexpected');
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
      showToast({ content: t('auth.kakao.configRequired') });
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-8 lg:gap-14">
      <AuthBrand
        prompt={t(roleSwitch.promptKey)}
        linkLabel={t(roleSwitch.linkLabelKey)}
        href={roleSwitch.href}
        ariaLabel={t('auth.brand')}
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
                label={t('auth.name.label')}
                name="name"
                autoComplete="name"
                placeholder={t('auth.name.placeholder')}
                value={values.name}
                onChange={handleChange('name')}
                isError={isNameFormatError}
                errorMessage={nameFormatErrorMessage}
              />
              <AuthEmailField
                id="signup-email"
                label={t('auth.email.label')}
                placeholder={t('auth.email.placeholder')}
                value={values.email}
                onChange={handleChange('email')}
                isError={isEmailFormatError}
                errorMessage={emailFormatFieldErrorMessage}
              />
              <AuthField
                id="signup-nickname"
                label={t('auth.nickname.label')}
                name="nickname"
                autoComplete="nickname"
                placeholder={t('auth.nickname.placeholder')}
                value={values.nickname}
                onChange={handleChange('nickname')}
                isError={isNicknameFormatError}
                errorMessage={nicknameFormatErrorMessage}
              />
              <AuthPasswordField
                id="signup-password"
                label={t('auth.password.label')}
                placeholder={t('auth.password.placeholder')}
                autoComplete="new-password"
                maxLength={PASSWORD_MAX_LENGTH}
                value={values.password}
                onChange={handleChange('password')}
                isError={isPasswordFormatError}
                errorMessage={passwordFormatFieldErrorMessage}
              />
              <AuthPasswordField
                id="signup-password-confirm"
                name="passwordConfirm"
                label={t('auth.password.confirmLabel')}
                autoComplete="new-password"
                maxLength={PASSWORD_MAX_LENGTH}
                placeholder={t('auth.password.confirmPlaceholder')}
                value={values.passwordConfirm}
                onChange={handleChange('passwordConfirm')}
                isError={isPasswordMismatchError}
                errorMessage={passwordMismatchErrorMessage}
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
            prompt={t('auth.helper.hasAccount')}
            linkLabel={t('common.login')}
            href={LOGIN_HREF_BY_USER_TYPE[userType]}
          />
        </form>

        <AuthKakaoSection
          hint={t('auth.kakao.snsHint')}
          ariaLabel={t('auth.signup.kakaoAria')}
          disabled={isPending}
          onClick={handleKakaoLogin}
        />
      </div>
    </div>
  );
};
