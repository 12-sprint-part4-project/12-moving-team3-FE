'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';

import { Button } from '@/components/Button/Button';
import { TextFieldOutlined } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { setAccessToken } from '@/lib/accessToken';
import { ApiError } from '@/lib/apiClient';
import { login } from '@/service/authApi';
import type { ApiUserType } from '@/types/auth';

export type LoginRole = 'customer' | 'mover';

interface LoginFormProps {
  role: LoginRole;
}

const KAKAO_LOGIN = {
  label: '카카오로 로그인',
  src: '/images/kakao.svg',
} as const;

const ROLE_SWITCH_COPY: Record<
  LoginRole,
  { prompt: string; linkLabel: string; href: string }
> = {
  customer: {
    prompt: '기사님이신가요?',
    linkLabel: '기사님 전용 페이지',
    href: '/login/mover',
  },
  mover: {
    prompt: '일반 유저라면?',
    linkLabel: '일반 유저 전용 페이지',
    href: '/login',
  },
};

const SIGNUP_HREF: Record<LoginRole, string> = {
  customer: '/signup',
  mover: '/signup/mover',
};

const USER_TYPE_BY_ROLE: Record<LoginRole, ApiUserType> = {
  customer: 'CUSTOMER',
  mover: 'MOVER',
};

interface LoginFormValues {
  email: string;
  password: string;
}

const INITIAL_VALUES: LoginFormValues = {
  email: '',
  password: '',
};

/** Mobile·Tablet(sm) 기본 + Desktop(md)는 lg: 오버라이드 */
const FIELD_CLASSNAME =
  'w-full [&_>div]:min-h-[3.375rem] [&_>div]:w-full [&_>div]:max-w-full lg:[&_>div]:min-h-16 [&_input]:lg:text-xl-regular';

const LABEL_CLASSNAME = 'text-md-regular text-black-400 lg:text-xl-regular';

const FIELD_GROUP_CLASSNAME = 'flex w-full flex-col gap-2 lg:gap-4';

const HELPER_TEXT_CLASSNAME =
  'flex items-center justify-center gap-1 whitespace-nowrap text-xs-regular lg:gap-2 lg:text-xl-regular';

const HELPER_MUTED_CLASSNAME = 'text-black-100 lg:text-black-200';

const HELPER_LINK_CLASSNAME =
  'text-xs-semibold text-blue-300 underline lg:text-xl-semibold';

/**
 * 로그인 폼 (customer / mover 공통).
 * Figma: Mobile(1:2155) · Tablet(1:2329) · Desktop(1:2051).
 * Mobile/Tablet은 sm 스펙(327px), Desktop만 lg:에서 확대.
 * role → API userType(CUSTOMER|MOVER)으로 매핑한다.
 * 소셜 로그인은 카카오만 제공한다.
 */
export const LoginForm = ({ role }: LoginFormProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [values, setValues] = useState<LoginFormValues>(INITIAL_VALUES);
  const [isPending, setIsPending] = useState(false);
  const roleSwitch = ROLE_SWITCH_COPY[role];

  const isSubmittable =
    values.email.trim().length > 0 &&
    values.password.length > 0 &&
    !isPending;

  const handleChange =
    (field: keyof LoginFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmittable) return;

    setIsPending(true);

    try {
      const response = await login({
        userType: USER_TYPE_BY_ROLE[role],
        email: values.email.trim(),
        password: values.password,
      });

      setAccessToken(response.data.accessToken);
      showToast({ content: '로그인되었습니다.' });
      router.replace('/');
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

  return (
    <div className="flex w-full flex-col items-center gap-10 lg:gap-[4.5rem]">
      <div className="flex flex-col items-center lg:gap-2">
        <Link
          href="/"
          className="flex w-full max-w-[20.4375rem] flex-col items-center justify-center p-2.5 lg:max-w-[40rem]"
        >
          <img
            src="/text-logo.svg"
            alt="무빙"
            className="h-16 w-[7rem] lg:h-20 lg:w-[8.75rem]"
          />
        </Link>
        <p className={HELPER_TEXT_CLASSNAME}>
          <span className={HELPER_MUTED_CLASSNAME}>{roleSwitch.prompt}</span>
          <Link href={roleSwitch.href} className={HELPER_LINK_CLASSNAME}>
            {roleSwitch.linkLabel}
          </Link>
        </p>
      </div>

      {/* Mobile: 폼↔SNS 48px / Tablet: 40px / Desktop: 외곽 gap으로 합류 */}
      <div className="flex w-full flex-col items-center gap-12 md:gap-10 lg:contents">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[20.4375rem] flex-col items-center gap-4 lg:max-w-[40rem] lg:gap-6"
        >
          <div className="flex w-full flex-col gap-8 lg:gap-14">
            <div className="flex w-full flex-col gap-4 lg:gap-8">
              <div className={FIELD_GROUP_CLASSNAME}>
                <label htmlFor="login-email" className={LABEL_CLASSNAME}>
                  이메일
                </label>
                <TextFieldOutlined
                  id="login-email"
                  size="sm"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="이메일을 입력해 주세요"
                  value={values.email}
                  onChange={handleChange('email')}
                  className={FIELD_CLASSNAME}
                />
              </div>

              <div className={FIELD_GROUP_CLASSNAME}>
                <label htmlFor="login-password" className={LABEL_CLASSNAME}>
                  비밀번호
                </label>
                <TextFieldOutlined
                  id="login-password"
                  size="sm"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  showVisibilityToggle
                  placeholder="비밀번호를 입력해 주세요"
                  value={values.password}
                  onChange={handleChange('password')}
                  className={FIELD_CLASSNAME}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="solid"
              size="sm"
              disabled={!isSubmittable}
              className="lg:h-16 lg:gap-2 lg:text-xl-semibold"
            >
              {isPending ? '로그인 중...' : '로그인'}
            </Button>
          </div>

          <p className={HELPER_TEXT_CLASSNAME}>
            <span className={HELPER_MUTED_CLASSNAME}>
              아직 무빙 회원이 아니신가요?
            </span>
            <Link href={SIGNUP_HREF[role]} className={HELPER_LINK_CLASSNAME}>
              이메일로 회원가입하기
            </Link>
          </p>
        </form>

        <div className="flex flex-col items-center gap-6 lg:gap-8">
          <p className="text-xs-regular text-black-100 lg:text-xl-regular lg:text-black-200">
            SNS 계정으로 간편 가입하기
          </p>
          <button
            type="button"
            aria-label={KAKAO_LOGIN.label}
            className="inline-flex size-[3.375rem] shrink-0 cursor-pointer items-center justify-center overflow-clip rounded-full lg:size-[4.5rem]"
          >
            <img
              src={KAKAO_LOGIN.src}
              alt=""
              width={72}
              height={72}
              className="size-full"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
