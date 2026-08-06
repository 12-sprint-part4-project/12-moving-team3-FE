'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';

import { Button } from '@/components/Button/Button';
import { TextFieldOutlined } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

/** Figma Mobile·Tablet: input sm / Desktop(lg+): md 높이·텍스트 */
const FIELD_CLASSNAME =
  'w-full [&_>div]:min-h-[3.375rem] [&_>div]:w-full [&_>div]:max-w-full lg:[&_>div]:min-h-16 [&_input]:lg:text-xl-regular';

const READONLY_FIELD_CLASSNAME = `${FIELD_CLASSNAME} [&_input]:!text-gray-300`;

/** Figma Mobile·Tablet: lg-semibold / Desktop(lg+): xl-semibold */
const LABEL_CLASSNAME = 'text-lg-semibold text-black-300 lg:text-xl-semibold';

/**
 * UI 목업용 초기값.
 * Figma Desktop(1:11171) · Tablet(1:11241) · Mobile(1:11307) 기준.
 */
const MOCK_BASIC_INFO = {
  name: '김코드',
  email: 'kcode@email.com',
  phoneNumber: '01012345678',
} as const;

interface MoverBasicInfoEditFormProps {
  className?: string;
}

/**
 * 기사님 기본정보 수정 폼 (UI only).
 * Figma: Mobile(1:11307)·Tablet(1:11241) → lg 미만 단일 컬럼,
 * Desktop(1:11171) → lg+ 2열.
 */
export const MoverBasicInfoEditForm = ({
  className,
}: MoverBasicInfoEditFormProps) => {
  const router = useRouter();
  const nameInputId = useId();
  const emailInputId = useId();
  const phoneInputId = useId();
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  const [name, setName] = useState(MOCK_BASIC_INFO.name);
  const [email] = useState(MOCK_BASIC_INFO.email);
  const [phoneNumber, setPhoneNumber] = useState(MOCK_BASIC_INFO.phoneNumber);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex w-full max-w-[20.4375rem] flex-col items-stretch gap-8 bg-white lg:max-w-[87.5rem] lg:gap-16 lg:rounded-[2rem] lg:px-6 lg:pt-8 lg:pb-10',
        className
      )}
    >
      <div className="flex w-full flex-col items-stretch gap-5 lg:gap-10">
        {/* Mobile·Tablet: title→divider 16px / Desktop: 40px */}
        <header className="flex w-full flex-col items-start gap-4 lg:gap-10">
          <h1 className="text-2lg-bold text-black-400 lg:text-3xl-semibold">
            기본정보 수정
          </h1>
          <div className="h-px w-full bg-line-100" aria-hidden />
        </header>

        {/*
          Mobile(1:11307)·Tablet(1:11241): 단일 컬럼
          — 이름→이메일→전화→비밀번호 3필드
          Desktop(1:11171): 2열 — 좌(이름·이메일·전화) / 우(비밀번호)
        */}
        <div className="flex w-full flex-col items-stretch gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="flex w-full flex-col items-start gap-5 lg:max-w-[40rem] lg:gap-8">
            <section className="flex w-full flex-col items-start gap-4">
              <label htmlFor={nameInputId} className={LABEL_CLASSNAME}>
                이름
              </label>
              <TextFieldOutlined
                id={nameInputId}
                size="sm"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={FIELD_CLASSNAME}
              />
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-4">
              <label htmlFor={emailInputId} className={LABEL_CLASSNAME}>
                이메일
              </label>
              <TextFieldOutlined
                id={emailInputId}
                size="sm"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                readOnly
                className={READONLY_FIELD_CLASSNAME}
              />
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-4">
              <label htmlFor={phoneInputId} className={LABEL_CLASSNAME}>
                전화번호
              </label>
              <TextFieldOutlined
                id={phoneInputId}
                size="sm"
                type="tel"
                name="phone"
                autoComplete="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                className={FIELD_CLASSNAME}
              />
            </section>
          </div>

          <div className="h-px w-full bg-line-100 lg:hidden" aria-hidden />

          <div className="flex w-full flex-col items-start gap-5 lg:max-w-[40rem] lg:gap-8">
            <section className="flex w-full flex-col items-start gap-4">
              <label htmlFor={currentPasswordId} className={LABEL_CLASSNAME}>
                현재 비밀번호
              </label>
              <TextFieldOutlined
                id={currentPasswordId}
                size="sm"
                type="password"
                name="currentPassword"
                autoComplete="current-password"
                placeholder="현재 비밀번호를 입력해주세요"
                showVisibilityToggle
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className={FIELD_CLASSNAME}
              />
            </section>

            {/* Mobile·Tablet: 현재↔새 비밀번호 사이 구분선 없음 / Desktop: 유지 */}
            <div className="hidden h-px w-full bg-line-100 lg:block" aria-hidden />

            <section className="flex w-full flex-col items-start gap-4">
              <label htmlFor={newPasswordId} className={LABEL_CLASSNAME}>
                새 비밀번호
              </label>
              <TextFieldOutlined
                id={newPasswordId}
                size="sm"
                type="password"
                name="newPassword"
                autoComplete="new-password"
                placeholder="새 비밀번호를 입력해주세요"
                showVisibilityToggle
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className={FIELD_CLASSNAME}
              />
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-4">
              <label htmlFor={confirmPasswordId} className={LABEL_CLASSNAME}>
                새 비밀번호 확인
              </label>
              <TextFieldOutlined
                id={confirmPasswordId}
                size="sm"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="새 비밀번호를 다시 한번 입력해주세요"
                showVisibilityToggle
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={FIELD_CLASSNAME}
              />
            </section>
          </div>
        </div>
      </div>

      {/* Mobile·Tablet: 세로 스택(수정하기→취소, gray) / Desktop: 가로(취소|수정하기, blue) */}
      <div className="flex w-full flex-col gap-2 lg:flex-row lg:justify-between lg:gap-4">
        <Button
          type="submit"
          variant="solid"
          size="sm"
          className="order-1 lg:order-2 lg:h-16 lg:max-w-[41.25rem] lg:text-xl-semibold"
        >
          수정하기
        </Button>
        <Button
          type="button"
          variant="outlined"
          size="sm"
          onClick={handleCancel}
          className="order-2 border-gray-200 text-gray-300 shadow-cta hover:border-gray-200 hover:bg-transparent hover:text-gray-300 hover:shadow-cta lg:order-1 lg:h-16 lg:max-w-[41.25rem] lg:border-blue-300 lg:text-blue-300 lg:text-xl-semibold lg:hover:border-blue-300 lg:hover:bg-blue-50 lg:hover:text-blue-300"
        >
          취소
        </Button>
      </div>
    </form>
  );
};
