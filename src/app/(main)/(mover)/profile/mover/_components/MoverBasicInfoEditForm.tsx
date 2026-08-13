'use client';

import { redirect, useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/Button/Button';
import { TextFieldOutlined } from '@/components/ui/Input';
import { RequiredLabel } from '@/components/ui/RequiredLabel/RequiredLabel';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { AUTH_QUERY_KEYS } from '@/hooks/useAuthMe';
import {
  moverProfileQueryKeys,
  useMoverProfile,
} from '@/hooks/useMoverProfile';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import {
  composeKrMobilePhone,
  formatKrMobileSubscriberInput,
  getKrMobileSubscriberError,
  KR_MOBILE_PREFIX_LABEL,
  KR_MOBILE_SUBSCRIBER_LENGTH,
  toKrMobileSubscriberDigits,
} from '@/lib/phoneNumber';
import { cn } from '@/lib/utils';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MISMATCH_ERROR_MESSAGE,
  validatePassword,
} from '@/lib/validatePassword';
import { updateMoverBasicInfo } from '@/services/moverProfileApi';
import type { MoverProfileMe } from '@/types/moverProfile';

import {
  buildMoverBasicInfoUpdateBody,
  getMoverBasicInfoUpdateError,
} from '../_lib/moverBasicInfoUpdate';

const FIELD_CLASSNAME =
  'w-full [&_>div]:min-h-[3.375rem] [&_>div]:w-full [&_>div]:max-w-full lg:[&_>div]:min-h-16 lg:[&_>div]:text-xl-regular';

const READONLY_FIELD_CLASSNAME = `${FIELD_CLASSNAME} [&_input]:!text-gray-300`;

const LABEL_CLASSNAME = 'text-lg-semibold text-black-300 lg:text-xl-semibold';

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 20;

const NAME_FORMAT_ERROR_MESSAGE = `이름은 ${NAME_MIN_LENGTH}~${NAME_MAX_LENGTH}자로 입력해 주세요.`;
const PASSWORD_FORMAT_FIELD_ERROR_MESSAGE = '비밀번호가 올바르지 않습니다.';

interface MoverBasicInfoEditFieldsProps {
  profile: MoverProfileMe;
  className?: string;
}

/** 기본정보 수정 폼 (프로필 조회로 초기화) */
const MoverBasicInfoEditFields = ({
  profile,
  className,
}: MoverBasicInfoEditFieldsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { showToast } = useToast();
  const nameInputId = useId();
  const emailInputId = useId();
  const phoneInputId = useId();
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  const [name, setName] = useState(profile.name);
  const [email] = useState(profile.email);
  const [phoneDraft, setPhoneDraft] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 프로필 번호 → 세션 번호 순으로 표시. 사용자 입력 후에만 draft 사용
  const phoneNumber =
    phoneDraft ??
    formatKrMobileSubscriberInput(
      profile.phoneNumber || user?.phoneNumber || ''
    );

  const trimmedName = name.trim();
  const subscriberDigits = toKrMobileSubscriberDigits(phoneNumber);
  const phoneFieldError = getKrMobileSubscriberError(phoneNumber);
  const isPhoneFormatError = Boolean(phoneFieldError);

  const isNameFormatError =
    trimmedName.length > 0 &&
    (trimmedName.length < NAME_MIN_LENGTH ||
      trimmedName.length > NAME_MAX_LENGTH);

  const hasPasswordInput =
    currentPassword.length > 0 ||
    newPassword.length > 0 ||
    confirmPassword.length > 0;
  const isPasswordFormatError =
    newPassword.length > 0 && Boolean(validatePassword(newPassword));
  const isPasswordMismatchError =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const isPasswordIncomplete =
    hasPasswordInput &&
    (currentPassword.length === 0 ||
      newPassword.length === 0 ||
      confirmPassword.length === 0);

  const isSubmitEnabled =
    trimmedName.length >= NAME_MIN_LENGTH &&
    trimmedName.length <= NAME_MAX_LENGTH &&
    subscriberDigits.length === KR_MOBILE_SUBSCRIBER_LENGTH &&
    !isPhoneFormatError &&
    !isPasswordFormatError &&
    !isPasswordMismatchError &&
    !isPasswordIncomplete &&
    !isSubmitting;

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmitEnabled) return;

    const updateParams = {
      profile,
      name,
      phoneNumber: composeKrMobilePhone(phoneNumber),
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
      await updateMoverBasicInfo(body);

      await queryClient.invalidateQueries({
        queryKey: moverProfileQueryKeys.all,
      });
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me() });

      showToast({ content: '기본정보가 수정되었습니다.' });
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
        <header className="flex w-full flex-col items-start gap-4 lg:gap-10">
          <h1 className="text-2lg-bold text-black-400 lg:text-3xl-semibold">
            기본정보 수정
          </h1>
          <div className="h-px w-full bg-line-100" aria-hidden />
        </header>

        <div className="flex w-full flex-col items-stretch gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="flex w-full flex-col items-start gap-5 lg:max-w-[40rem] lg:gap-8">
            <section className="flex w-full flex-col items-start gap-4">
              <RequiredLabel htmlFor={nameInputId}>이름</RequiredLabel>
              <TextFieldOutlined
                id={nameInputId}
                size="sm"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                isError={isNameFormatError}
                errorMessage={
                  isNameFormatError ? NAME_FORMAT_ERROR_MESSAGE : undefined
                }
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
                autoComplete="off"
                value={email}
                readOnly
                className={READONLY_FIELD_CLASSNAME}
              />
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-4">
              <RequiredLabel htmlFor={phoneInputId}>전화번호</RequiredLabel>
              <TextFieldOutlined
                id={phoneInputId}
                size="sm"
                type="tel"
                name="phone"
                inputMode="numeric"
                autoComplete="tel"
                leftAddon={KR_MOBILE_PREFIX_LABEL}
                placeholder="1234-5678"
                value={formatKrMobileSubscriberInput(phoneNumber)}
                onChange={(event) =>
                  setPhoneDraft(
                    formatKrMobileSubscriberInput(event.target.value)
                  )
                }
                isError={isPhoneFormatError}
                errorMessage={phoneFieldError ?? undefined}
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
                    autoComplete="new-password"
                    placeholder="현재 비밀번호를 입력해주세요"
                    showVisibilityToggle
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    className={FIELD_CLASSNAME}
                  />
                </section>

                {/* lg 미만: 현재↔새 비밀번호 구분선 없음 */}
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
                    maxLength={PASSWORD_MAX_LENGTH}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    isError={isPasswordFormatError}
                    errorMessage={
                      isPasswordFormatError
                        ? PASSWORD_FORMAT_FIELD_ERROR_MESSAGE
                        : undefined
                    }
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
                    maxLength={PASSWORD_MAX_LENGTH}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    isError={isPasswordMismatchError}
                    errorMessage={
                      isPasswordMismatchError
                        ? PASSWORD_MISMATCH_ERROR_MESSAGE
                        : undefined
                    }
                    className={FIELD_CLASSNAME}
                  />
                </section>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 lg:flex-row lg:justify-between lg:gap-4">
        <Button
          type="submit"
          variant="solid"
          size="sm"
          disabled={!isSubmitEnabled}
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

/** 기사님 기본정보 수정 */
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
