'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';

import { AuthBrand } from '@/app/(auth)/_components/AuthBrand';
import { AuthEmailField } from '@/app/(auth)/_components/AuthEmailField';
import { AuthHelperText } from '@/app/(auth)/_components/AuthHelperText';
import { AuthKakaoSection } from '@/app/(auth)/_components/AuthKakaoSection';
import { AuthPasswordField } from '@/app/(auth)/_components/AuthPasswordField';
import {
  USER_TYPE_BY_ROLE,
  getAuthRoleSwitch,
} from '@/app/(auth)/_components/authRole';
import { Button } from '@/components/Button/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { SIGNUP_HREF_BY_USER_TYPE } from '@/lib/authRoutePaths';
import { getPostAuthRedirectPath } from '@/lib/getPostAuthRedirectPath';
import { redirectToKakaoLogin } from '@/lib/kakaoAuth';
import { validateEmail } from '@/lib/validateEmail';
import { login } from '@/services/authApi';

import type { AuthRole } from '@/app/(auth)/_components/authRole';
import type { ChangeEvent, SubmitEvent } from 'react';

interface LoginFormProps {
  role: AuthRole;
  redirectTo?: string | null;
}

interface LoginFormValues {
  email: string;
  password: string;
}

const INITIAL_VALUES: LoginFormValues = {
  email: '',
  password: '',
};

/** 이메일·비밀번호·카카오 로그인 폼 */
export const LoginForm = ({ role, redirectTo = null }: LoginFormProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { setSession } = useAuth();
  const [values, setValues] = useState<LoginFormValues>(INITIAL_VALUES);
  const [isPending, setIsPending] = useState(false);

  const roleSwitch = getAuthRoleSwitch('login', role);
  const userType = USER_TYPE_BY_ROLE[role];
  const trimmedEmail = values.email.trim();
  const isSubmittable =
    trimmedEmail.length > 0 && values.password.length > 0 && !isPending;
  const submitLabel = isPending
    ? t('auth.login.submitting')
    : t('auth.login.submit');

  const handleChange =
    (field: keyof LoginFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  /** 이메일 형식 검사 후 로그인하고 역할별 경로로 이동한다 */
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmittable) return;

    const emailError = validateEmail(trimmedEmail);
    if (emailError) {
      showToast({ content: t('auth.validation.emailFormat') });
      return;
    }

    setIsPending(true);

    try {
      const response = await login({
        userType,
        email: trimmedEmail,
        password: values.password,
      });

      setSession({
        accessToken: response.data.accessToken,
      });
      showToast({ content: t('auth.login.success') });
      router.replace(
        getPostAuthRedirectPath(response.data.user, {
          redirectTo,
        })
      );
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : t('auth.login.unexpected');
      showToast({ content: message });
    } finally {
      setIsPending(false);
    }
  };

  const handleKakaoLogin = () => {
    if (isPending) return;

    try {
      redirectToKakaoLogin(userType, redirectTo);
    } catch {
      showToast({ content: t('auth.kakao.configRequired') });
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-10 lg:gap-[4.5rem]">
      <AuthBrand
        prompt={t(roleSwitch.promptKey)}
        linkLabel={t(roleSwitch.linkLabelKey)}
        href={roleSwitch.href}
        ariaLabel={t('auth.brand')}
      />

      <div className="flex w-full flex-col items-center gap-12 md:gap-10 lg:contents">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex w-full max-w-[20.4375rem] flex-col items-center gap-4 lg:max-w-[40rem] lg:gap-6"
        >
          <div className="flex w-full flex-col gap-8 lg:gap-14">
            <div className="flex w-full flex-col gap-4 lg:gap-8">
              <AuthEmailField
                id="login-email"
                label={t('auth.email.label')}
                placeholder={t('auth.email.placeholder')}
                value={values.email}
                onChange={handleChange('email')}
              />
              <AuthPasswordField
                id="login-password"
                label={t('auth.password.label')}
                placeholder={t('auth.password.placeholder')}
                value={values.password}
                onChange={handleChange('password')}
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
            prompt={t('auth.helper.noAccount')}
            linkLabel={t('auth.helper.signupLink')}
            href={SIGNUP_HREF_BY_USER_TYPE[userType]}
          />
        </form>

        <AuthKakaoSection
          hint={t('auth.kakao.snsHint')}
          ariaLabel={t('auth.login.kakaoAria')}
          disabled={isPending}
          onClick={handleKakaoLogin}
        />
      </div>
    </div>
  );
};
