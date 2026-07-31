'use client';

import Link from 'next/link';
import { useState, type ChangeEvent, type FormEvent } from 'react';

import { Button } from '@/components/Button/Button';
import { TextFieldOutlined } from '@/components/ui/Input';

export type SignupRole = 'customer' | 'mover';

interface SignupFormProps {
  role: SignupRole;
}

const KAKAO_LOGIN = {
  label: '카카오로 가입',
  src: '/images/kakao.svg',
} as const;

const ROLE_SWITCH_COPY: Record<
  SignupRole,
  { prompt: string; linkLabel: string; href: string }
> = {
  customer: {
    prompt: '기사님이신가요?',
    linkLabel: '기사님 전용 페이지',
    href: '/signup/mover',
  },
  mover: {
    prompt: '일반 유저라면?',
    linkLabel: '일반 유저 전용 페이지',
    href: '/signup',
  },
};

const LOGIN_HREF: Record<SignupRole, string> = {
  customer: '/login',
  mover: '/login/mover',
};

interface SignupFormValues {
  name: string;
  email: string;
  nickname: string;
  phone: string;
  password: string;
  passwordConfirm: string;
}

const INITIAL_VALUES: SignupFormValues = {
  name: '',
  email: '',
  nickname: '',
  phone: '',
  password: '',
  passwordConfirm: '',
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
 * 회원가입 폼 (customer / mover 공통).
 * Figma: Mobile(1:2900) · Tablet(1:2608) · Desktop(1:2756).
 * role만 달라지며, API 연동 시 payload에 role을 포함하면 된다.
 */
export const SignupForm = ({ role }: SignupFormProps) => {
  const [values, setValues] = useState<SignupFormValues>(INITIAL_VALUES);
  const roleSwitch = ROLE_SWITCH_COPY[role];

  const isSubmittable =
    values.name.trim().length > 0 &&
    values.email.trim().length > 0 &&
    values.nickname.trim().length > 0 &&
    values.phone.trim().length > 0 &&
    values.password.length > 0 &&
    values.passwordConfirm.length > 0;

  const handleChange =
    (field: keyof SignupFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue =
        field === 'phone'
          ? event.target.value.replace(/\D/g, '')
          : event.target.value;

      setValues((prev) => ({ ...prev, [field]: nextValue }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmittable) return;
    // API 연동 시: { ...values, role }
  };

  return (
    <div className="flex w-full flex-col items-center gap-8 lg:gap-14">
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

      <div className="flex w-full flex-col items-center gap-12 lg:gap-[4.5rem]">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[20.4375rem] flex-col items-center gap-4 lg:max-w-[40rem] lg:gap-6"
        >
          <div className="flex w-full flex-col gap-8 lg:gap-14">
            <div className="flex w-full flex-col gap-4 lg:gap-8">
              <div className={FIELD_GROUP_CLASSNAME}>
                <label htmlFor="signup-name" className={LABEL_CLASSNAME}>
                  이름
                </label>
                <TextFieldOutlined
                  id="signup-name"
                  size="sm"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="성함을 입력해 주세요"
                  value={values.name}
                  onChange={handleChange('name')}
                  className={FIELD_CLASSNAME}
                />
              </div>

              <div className={FIELD_GROUP_CLASSNAME}>
                <label htmlFor="signup-email" className={LABEL_CLASSNAME}>
                  이메일
                </label>
                <TextFieldOutlined
                  id="signup-email"
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
                <label htmlFor="signup-nickname" className={LABEL_CLASSNAME}>
                  닉네임
                </label>
                <TextFieldOutlined
                  id="signup-nickname"
                  size="sm"
                  type="text"
                  name="nickname"
                  autoComplete="nickname"
                  placeholder="닉네임을 입력해 주세요"
                  value={values.nickname}
                  onChange={handleChange('nickname')}
                  className={FIELD_CLASSNAME}
                />
              </div>

              <div className={FIELD_GROUP_CLASSNAME}>
                <label htmlFor="signup-phone" className={LABEL_CLASSNAME}>
                  전화번호
                </label>
                <TextFieldOutlined
                  id="signup-phone"
                  size="sm"
                  type="tel"
                  name="phone"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="숫자만 입력해 주세요"
                  value={values.phone}
                  onChange={handleChange('phone')}
                  className={FIELD_CLASSNAME}
                />
              </div>

              <div className={FIELD_GROUP_CLASSNAME}>
                <label htmlFor="signup-password" className={LABEL_CLASSNAME}>
                  비밀번호
                </label>
                <TextFieldOutlined
                  id="signup-password"
                  size="sm"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  showVisibilityToggle
                  placeholder="비밀번호를 입력해 주세요"
                  value={values.password}
                  onChange={handleChange('password')}
                  className={FIELD_CLASSNAME}
                />
              </div>

              <div className={FIELD_GROUP_CLASSNAME}>
                <label
                  htmlFor="signup-password-confirm"
                  className={LABEL_CLASSNAME}
                >
                  비밀번호 확인
                </label>
                <TextFieldOutlined
                  id="signup-password-confirm"
                  size="sm"
                  type="password"
                  name="passwordConfirm"
                  autoComplete="new-password"
                  showVisibilityToggle
                  placeholder="비밀번호를 다시 한번 입력해 주세요"
                  value={values.passwordConfirm}
                  onChange={handleChange('passwordConfirm')}
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
              시작하기
            </Button>
          </div>

          <p className={HELPER_TEXT_CLASSNAME}>
            <span className={HELPER_MUTED_CLASSNAME}>
              이미 무빙 회원이신가요?
            </span>
            <Link href={LOGIN_HREF[role]} className={HELPER_LINK_CLASSNAME}>
              로그인
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
