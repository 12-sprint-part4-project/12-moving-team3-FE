'use client';

import { redirect, useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/Button/Button';
import { TextFieldOutlined } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useAuth } from '@/hooks/useAuth';
import {
  moverProfileQueryKeys,
  useMoverProfile,
} from '@/hooks/useMoverProfile';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { getAuthSession } from '@/lib/authSession';
import { cn } from '@/lib/utils';
import { updateMoverBasicInfo } from '@/services/moverProfileApi';
import type { MoverProfileMe } from '@/types/moverProfile';

import {
  buildMoverBasicInfoUpdateBody,
  getMoverBasicInfoUpdateError,
} from '../_lib/moverBasicInfoUpdate';

/** Figma Mobile·Tablet: input sm / Desktop(lg+): md 높이·텍스트 */
const FIELD_CLASSNAME =
  'w-full [&_>div]:min-h-[3.375rem] [&_>div]:w-full [&_>div]:max-w-full lg:[&_>div]:min-h-16 [&_input]:lg:text-xl-regular';

const READONLY_FIELD_CLASSNAME = `${FIELD_CLASSNAME} [&_input]:!text-gray-300`;

/** Figma Mobile·Tablet: lg-semibold / Desktop(lg+): xl-semibold */
const LABEL_CLASSNAME = 'text-lg-semibold text-black-300 lg:text-xl-semibold';

interface MoverBasicInfoEditFieldsProps {
  profile: MoverProfileMe;
  className?: string;
}

/**
 * 쿼리 데이터로 초기화된 기본정보 수정 폼.
 * Figma: Mobile(1:11307)·Tablet(1:11241) → lg 미만 단일 컬럼,
 * Desktop(1:11171) → lg+ 2열.
 */
const MoverBasicInfoEditFields = ({
  profile,
  className,
}: MoverBasicInfoEditFieldsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setSession } = useAuth();
  const { showToast } = useToast();
  const nameInputId = useId();
  const emailInputId = useId();
  const phoneInputId = useId();
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  const [name, setName] = useState(profile.name);
  const [email] = useState(profile.email);
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const updateParams = {
      profile,
      name,
      phoneNumber,
      currentPassword,
      newPassword,
      confirmPassword,
    };

    const validationError = getMoverBasicInfoUpdateError(updateParams);
    if (validationError) {
      showToast({ content: validationError });
      return;
    }

    const body = buildMoverBasicInfoUpdateBody(updateParams);
    if (!body) {
      showToast({ content: '변경된 내용이 없습니다.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await updateMoverBasicInfo(body);

      await queryClient.invalidateQueries({
        queryKey: moverProfileQueryKeys.all,
      });

      const session = getAuthSession();
      if (session) {
        setSession({
          ...session,
          user: {
            ...session.user,
            phoneNumber:
              response.data.phoneNumber ?? session.user.phoneNumber,
          },
        });
      }

      showToast({ content: '기본정보가 수정되었습니다.' });
      router.back();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '기본정보 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.';
      showToast({ content: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
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

          {profile.hasPassword ? (
            <>
              <div className="h-px w-full bg-line-100 lg:hidden" aria-hidden />

              <div className="flex w-full flex-col items-start gap-5 lg:max-w-[40rem] lg:gap-8">
                <section className="flex w-full flex-col items-start gap-4">
                  <label
                    htmlFor={currentPasswordId}
                    className={LABEL_CLASSNAME}
                  >
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
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    className={FIELD_CLASSNAME}
                  />
                </section>

                {/* Mobile·Tablet: 현재↔새 비밀번호 사이 구분선 없음 / Desktop: 유지 */}
                <div
                  className="hidden h-px w-full bg-line-100 lg:block"
                  aria-hidden
                />

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
                  <label
                    htmlFor={confirmPasswordId}
                    className={LABEL_CLASSNAME}
                  >
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
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    className={FIELD_CLASSNAME}
                  />
                </section>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Mobile·Tablet: 세로 스택(수정하기→취소, gray) / Desktop: 가로(취소|수정하기, blue) */}
      <div className="flex w-full flex-col gap-2 lg:flex-row lg:justify-between lg:gap-4">
        <Button
          type="submit"
          variant="solid"
          size="sm"
          disabled={isSubmitting}
          className="order-1 lg:order-2 lg:h-16 lg:max-w-[41.25rem] lg:text-xl-semibold"
        >
          {isSubmitting ? '수정 중...' : '수정하기'}
        </Button>
        <Button
          type="button"
          variant="outlined"
          size="sm"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="order-2 border-gray-200 text-gray-300 shadow-cta hover:border-gray-200 hover:bg-transparent hover:text-gray-300 hover:shadow-cta lg:order-1 lg:h-16 lg:max-w-[41.25rem] lg:border-blue-300 lg:text-blue-300 lg:text-xl-semibold lg:hover:border-blue-300 lg:hover:bg-blue-50 lg:hover:text-blue-300"
        >
          취소
        </Button>
      </div>
    </form>
  );
};

interface MoverBasicInfoEditFormProps {
  className?: string;
}

/** 기사님 기본정보 수정. useMoverProfile로 조회 후 폼에 전달 */
export const MoverBasicInfoEditForm = ({
  className,
}: MoverBasicInfoEditFormProps) => {
  const {
    data: profile,
    isPending,
    isError,
    error,
    refetch,
  } = useMoverProfile();

  if (isPending) {
    return <Spinner message="기본정보 불러오는 중..." />;
  }

  if (isError) {
    const message =
      error instanceof ApiError
        ? error.message
        : '기본정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';

    return (
      <div className="flex w-full max-w-[87.5rem] flex-col items-center gap-6 py-16">
        <p className="text-center text-lg-medium text-gray-400">{message}</p>
        <Button
          type="button"
          variant="outlined"
          size="sm"
          onClick={() => {
            void refetch();
          }}
          className="max-w-[12rem]"
        >
          다시 시도
        </Button>
      </div>
    );
  }

  if (profile === null) {
    redirect('/profile/mover');
  }

  return (
    <MoverBasicInfoEditFields
      key={profile.updatedAt}
      profile={profile}
      className={className}
    />
  );
};
