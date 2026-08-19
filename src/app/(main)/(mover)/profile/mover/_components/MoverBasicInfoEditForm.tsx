'use client';

import { redirect, useRouter } from 'next/navigation';
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';

import { Button } from '@/components/Button/Button';
import { ProfilePhoneField } from '@/components/profile/ProfilePhoneField';
import { ProfileTextField } from '@/components/profile/ProfileTextField';
import { RequiredLabel } from '@/components/ui/RequiredLabel/RequiredLabel';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useAuth } from '@/hooks/useAuth';
import {
  useMoverProfile,
  useUpdateMoverBasicInfo,
} from '@/hooks/useMoverProfile';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import {
  composeKrMobilePhone,
  formatKrMobileSubscriberInput,
  getKrMobileSubscriberError,
  KR_MOBILE_SUBSCRIBER_LENGTH,
  toKrMobileSubscriberDigits,
} from '@/lib/phoneNumber';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MISMATCH_ERROR_MESSAGE,
  validatePassword,
} from '@/lib/validatePassword';

import {
  buildMoverBasicInfoUpdateBody,
  getMoverBasicInfoUpdateError,
} from '../_lib/moverBasicInfoUpdate';

import type { MoverProfileMe } from '@/types/moverProfile';

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 20;

const NAME_FORMAT_ERROR_MESSAGE = `이름은 ${NAME_MIN_LENGTH}~${NAME_MAX_LENGTH}자로 입력해 주세요.`;
const PASSWORD_FORMAT_FIELD_ERROR_MESSAGE = '비밀번호가 올바르지 않습니다.';

interface MoverBasicInfoPasswordFieldsProps {
  currentPasswordId: string;
  newPasswordId: string;
  confirmPasswordId: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  isPasswordFormatError: boolean;
  isPasswordMismatchError: boolean;
  onCurrentPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onNewPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

/** LOCAL 계정 전용 비밀번호 변경 필드 */
const MoverBasicInfoPasswordFields = ({
  currentPasswordId,
  newPasswordId,
  confirmPasswordId,
  currentPassword,
  newPassword,
  confirmPassword,
  isPasswordFormatError,
  isPasswordMismatchError,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
}: MoverBasicInfoPasswordFieldsProps) => {
  return (
    <>
      <div className="h-px w-full bg-line-100 lg:hidden" aria-hidden />

      <div className="flex w-full flex-col items-start gap-5 lg:max-w-[40rem] lg:gap-8">
        <section className="flex w-full flex-col items-start gap-4">
          <label
            htmlFor={currentPasswordId}
            className="text-lg-semibold text-black-300 lg:text-xl-semibold"
          >
            현재 비밀번호
          </label>
          <ProfileTextField
            id={currentPasswordId}
            type="password"
            name="currentPassword"
            autoComplete="new-password"
            placeholder="현재 비밀번호를 입력해주세요"
            showVisibilityToggle
            value={currentPassword}
            onChange={onCurrentPasswordChange}
          />
        </section>

        <div className="hidden h-px w-full bg-line-100 lg:block" aria-hidden />

        <section className="flex w-full flex-col items-start gap-4">
          <label
            htmlFor={newPasswordId}
            className="text-lg-semibold text-black-300 lg:text-xl-semibold"
          >
            새 비밀번호
          </label>
          <ProfileTextField
            id={newPasswordId}
            type="password"
            name="newPassword"
            autoComplete="new-password"
            placeholder="새 비밀번호를 입력해주세요"
            showVisibilityToggle
            maxLength={PASSWORD_MAX_LENGTH}
            value={newPassword}
            onChange={onNewPasswordChange}
            isError={isPasswordFormatError}
            errorMessage={
              isPasswordFormatError
                ? PASSWORD_FORMAT_FIELD_ERROR_MESSAGE
                : undefined
            }
          />
        </section>

        <div className="h-px w-full bg-line-100" aria-hidden />

        <section className="flex w-full flex-col items-start gap-4">
          <label
            htmlFor={confirmPasswordId}
            className="text-lg-semibold text-black-300 lg:text-xl-semibold"
          >
            새 비밀번호 확인
          </label>
          <ProfileTextField
            id={confirmPasswordId}
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="새 비밀번호를 다시 한번 입력해주세요"
            showVisibilityToggle
            maxLength={PASSWORD_MAX_LENGTH}
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            isError={isPasswordMismatchError}
            errorMessage={
              isPasswordMismatchError
                ? PASSWORD_MISMATCH_ERROR_MESSAGE
                : undefined
            }
          />
        </section>
      </div>
    </>
  );
};

interface MoverBasicInfoEditFieldsProps {
  profile: MoverProfileMe;
}

/** profile이 있을 때만 마운트한다. key로 리마운트한다. */
const MoverBasicInfoEditFields = ({
  profile,
}: MoverBasicInfoEditFieldsProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { mutate: updateBasicInfo, isPending } = useUpdateMoverBasicInfo({
    successMessage: '기본정보가 수정되었습니다.',
    errorFallbackMessage:
      '기본정보 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.',
  });
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
  const showPasswordFields = profile.hasPassword;
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
    !isPending;
  const submitLabel = isPending ? '수정 중...' : '수정하기';

  const handleCancel = () => {
    router.back();
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneDraft(formatKrMobileSubscriberInput(event.target.value));
  };

  /** 변경분만 제출한다. 변경이 없으면 토스트를 띄운다 */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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

    updateBasicInfo(body);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[20.4375rem] flex-col items-stretch gap-8 bg-white lg:max-w-[87.5rem] lg:gap-16 lg:rounded-[2rem] lg:px-6 lg:pt-8 lg:pb-10"
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
              <ProfileTextField
                id={nameInputId}
                name="name"
                autoComplete="name"
                value={name}
                onChange={handleNameChange}
                isError={isNameFormatError}
                errorMessage={
                  isNameFormatError ? NAME_FORMAT_ERROR_MESSAGE : undefined
                }
              />
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-4">
              <label
                htmlFor={emailInputId}
                className="text-lg-semibold text-black-300 lg:text-xl-semibold"
              >
                이메일
              </label>
              <ProfileTextField
                id={emailInputId}
                type="email"
                name="email"
                autoComplete="off"
                value={email}
                readOnly
                className="[&_input]:!text-gray-300"
              />
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <ProfilePhoneField
              id={phoneInputId}
              value={phoneNumber}
              errorMessage={phoneFieldError ?? undefined}
              onChange={handlePhoneChange}
            />
          </div>

          {showPasswordFields ? (
            <MoverBasicInfoPasswordFields
              currentPasswordId={currentPasswordId}
              newPasswordId={newPasswordId}
              confirmPasswordId={confirmPasswordId}
              currentPassword={currentPassword}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              isPasswordFormatError={isPasswordFormatError}
              isPasswordMismatchError={isPasswordMismatchError}
              onCurrentPasswordChange={(event) =>
                setCurrentPassword(event.target.value)
              }
              onNewPasswordChange={(event) =>
                setNewPassword(event.target.value)
              }
              onConfirmPasswordChange={(event) =>
                setConfirmPassword(event.target.value)
              }
            />
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
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="outlined"
          size="sm"
          onClick={handleCancel}
          disabled={isPending}
          className="order-2 border-gray-200 text-gray-300 shadow-cta hover:border-gray-200 hover:bg-transparent hover:text-gray-300 hover:shadow-cta lg:order-1 lg:h-16 lg:max-w-[41.25rem] lg:border-blue-300 lg:text-xl-semibold lg:text-blue-300 lg:hover:border-blue-300 lg:hover:bg-blue-50 lg:hover:text-blue-300"
        >
          취소
        </Button>
      </div>
    </form>
  );
};

/** `/profile/mover/basic` 기본정보 조회·로딩·에러 가드. 성공 시 수정 폼을 마운트한다. */
export const MoverBasicInfoEditForm = () => {
  const {
    data: profile,
    isPending,
    isError,
    error,
    refetch,
  } = useMoverProfile();

  const handleRetry = () => {
    void refetch();
  };

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
          onClick={handleRetry}
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

  return <MoverBasicInfoEditFields key={profile.updatedAt} profile={profile} />;
};
