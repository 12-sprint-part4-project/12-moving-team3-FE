'use client';

import Link from 'next/link';
import { useState, type ChangeEvent, type FormEvent } from 'react';

import { Button } from '@/components/Button/Button';
import { TextFieldOutlined } from '@/components/ui/Input';

const SNS_PROVIDERS = [
  {
    id: 'google',
    label: 'Google로 가입',
    src: '/images/google.svg',
  },
  {
    id: 'kakao',
    label: '카카오로 가입',
    src: '/images/kakao.svg',
  },
  {
    id: 'naver',
    label: '네이버로 가입',
    src: '/images/naver.svg',
  },
] as const;

interface SignupFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
}

const INITIAL_VALUES: SignupFormValues = {
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
};

/**
 * 일반유저 회원가입 폼 (Figma: 회원가입_일반유저/Desktop 1:2756).
 * UI만 담당하며 API 연동은 하지 않는다.
 */
export const CustomerSignupForm = () => {
  const [values, setValues] = useState<SignupFormValues>(INITIAL_VALUES);

  const isSubmittable =
    values.name.trim().length > 0 &&
    values.email.trim().length > 0 &&
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
  };

  return (
    <div className="flex w-full flex-col items-center gap-14">
      <div className="flex flex-col items-center gap-2">
        <Link
          href="/"
          className="flex w-full max-w-[40rem] flex-col items-center justify-center p-2.5"
        >
          <img
            src="/text-logo.svg"
            alt="무빙"
            className="h-20 w-[8.75rem]"
          />
        </Link>
        <p className="flex items-center justify-center gap-2 text-xl-regular whitespace-nowrap">
          <span className="text-black-200">기사님이신가요?</span>
          <Link
            href="/signup/mover"
            className="text-xl-semibold text-blue-300 underline"
          >
            기사님 전용 페이지
          </Link>
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-[4.5rem]">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[40rem] flex-col items-center gap-6"
        >
          <div className="flex w-full flex-col gap-14">
            <div className="flex w-full flex-col gap-8">
              <div className="flex w-full flex-col gap-4">
                <label
                  htmlFor="signup-name"
                  className="text-xl-regular text-black-400"
                >
                  이름
                </label>
                <TextFieldOutlined
                  id="signup-name"
                  size="md"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="성함을 입력해 주세요"
                  value={values.name}
                  onChange={handleChange('name')}
                  className="w-full [&_>div]:min-h-16 [&_>div]:w-full [&_>div]:max-w-full"
                />
              </div>

              <div className="flex w-full flex-col gap-4">
                <label
                  htmlFor="signup-email"
                  className="text-xl-regular text-black-400"
                >
                  이메일
                </label>
                <TextFieldOutlined
                  id="signup-email"
                  size="md"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="이메일을 입력해 주세요"
                  value={values.email}
                  onChange={handleChange('email')}
                  className="w-full [&_>div]:min-h-16 [&_>div]:w-full [&_>div]:max-w-full"
                />
              </div>

              <div className="flex w-full flex-col gap-4">
                <label
                  htmlFor="signup-phone"
                  className="text-xl-regular text-black-400"
                >
                  전화번호
                </label>
                <TextFieldOutlined
                  id="signup-phone"
                  size="md"
                  type="tel"
                  name="phone"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="숫자만 입력해 주세요"
                  value={values.phone}
                  onChange={handleChange('phone')}
                  className="w-full [&_>div]:min-h-16 [&_>div]:w-full [&_>div]:max-w-full"
                />
              </div>

              <div className="flex w-full flex-col gap-4">
                <label
                  htmlFor="signup-password"
                  className="text-xl-regular text-black-400"
                >
                  비밀번호
                </label>
                <TextFieldOutlined
                  id="signup-password"
                  size="md"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  showVisibilityToggle
                  placeholder="비밀번호를 입력해 주세요"
                  value={values.password}
                  onChange={handleChange('password')}
                  className="w-full [&_>div]:min-h-16 [&_>div]:w-full [&_>div]:max-w-full"
                />
              </div>

              <div className="flex w-full flex-col gap-4">
                <label
                  htmlFor="signup-password-confirm"
                  className="text-xl-regular text-black-400"
                >
                  비밀번호 확인
                </label>
                <TextFieldOutlined
                  id="signup-password-confirm"
                  size="md"
                  type="password"
                  name="passwordConfirm"
                  autoComplete="new-password"
                  showVisibilityToggle
                  placeholder="비밀번호 다시 한번 입력해 주세요"
                  value={values.passwordConfirm}
                  onChange={handleChange('passwordConfirm')}
                  className="w-full [&_>div]:min-h-16 [&_>div]:w-full [&_>div]:max-w-full"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="solid"
              size="md"
              disabled={!isSubmittable}
            >
              시작하기
            </Button>
          </div>

          <p className="flex items-center justify-center gap-2 text-xl-regular whitespace-nowrap">
            <span className="text-black-200">이미 무빙 회원이신가요?</span>
            <Link
              href="/login"
              className="text-xl-semibold text-blue-300 underline"
            >
              로그인
            </Link>
          </p>
        </form>

        <div className="flex flex-col items-center gap-8">
          <p className="text-xl-regular text-black-200">
            SNS 계정으로 간편 가입하기
          </p>
          <div className="flex items-start gap-8">
            {SNS_PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                type="button"
                aria-label={provider.label}
                className="inline-flex size-[4.5rem] shrink-0 items-center justify-center overflow-clip rounded-full"
              >
                <img
                  src={provider.src}
                  alt=""
                  width={72}
                  height={72}
                  className="size-full"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
