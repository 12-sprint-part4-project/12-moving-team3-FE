'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AuthBrand, AuthHelperText } from '@/app/(auth)/_components/AuthBrand';
import { AuthEmailField } from '@/app/(auth)/_components/AuthEmailField';
import { AuthKakaoSection } from '@/app/(auth)/_components/AuthKakaoSection';
import { AuthPasswordField } from '@/app/(auth)/_components/AuthPasswordField';
import {
  AUTH_PATH,
  USER_TYPE_BY_ROLE,
  getAuthRoleSwitch,
} from '@/app/(auth)/_components/authRole';
import { Button } from '@/components/Button/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { getPostAuthRedirectPath } from '@/lib/getPostAuthRedirectPath';
import { redirectToKakaoLogin } from '@/lib/kakaoAuth';
import {
  EMAIL_FORMAT_ERROR_MESSAGE,
  validateEmail,
} from '@/lib/validateEmail';
import { login } from '@/services/authApi';

import type { AuthRole } from '@/app/(auth)/_components/authRole';
import type { ChangeEvent, FormEvent } from 'react';

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
  const { showToast } = useToast();
  const { setSession } = useAuth();
  const [values, setValues] = useState<LoginFormValues>(INITIAL_VALUES);
  const [isPending, setIsPending] = useState(false);

  const roleSwitch = getAuthRoleSwitch('login', role);
  const userType = USER_TYPE_BY_ROLE[role];
  const trimmedEmail = values.email.trim();
  const isSubmittable =
    trimmedEmail.length > 0 && values.password.length > 0 && !isPending;
  const submitLabel = isPending ? '로그인 중...' : '로그인';

  const handleChange =
    (field: keyof LoginFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  /** 이메일 형식 검사 후 로그인하고 역할별 경로로 이동한다 */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmittable) return;

    if (validateEmail(trimmedEmail)) {
      showToast({ content: EMAIL_FORMAT_ERROR_MESSAGE });
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
      showToast({ content: '로그인되었습니다.' });
      router.replace(
        getPostAuthRedirectPath(response.data.user, {
          redirectTo,
        })
      );
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.';
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
      showToast({ content: '카카오 로그인 설정이 필요합니다.' });
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-10 lg:gap-[4.5rem]">
      <AuthBrand
        prompt={roleSwitch.prompt}
        linkLabel={roleSwitch.linkLabel}
        href={roleSwitch.href}
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
                value={values.email}
                onChange={handleChange('email')}
              />
              <AuthPasswordField
                id="login-password"
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
            prompt="아직 무빙 회원이 아니신가요?"
            linkLabel="이메일로 회원가입하기"
            href={AUTH_PATH.signup[role]}
          />
        </form>

        <AuthKakaoSection
          ariaLabel="카카오로 로그인"
          disabled={isPending}
          onClick={handleKakaoLogin}
        />
      </div>
    </div>
  );
};
