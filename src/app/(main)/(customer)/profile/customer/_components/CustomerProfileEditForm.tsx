'use client';

import { redirect, useRouter } from 'next/navigation';
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';

import { Button } from '@/components/Button/Button';
import { RequiredLabel } from '@/components/ui/RequiredLabel/RequiredLabel';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import {
  useCustomerProfile,
  useUpsertCustomerProfile,
} from '@/hooks/useCustomerProfile';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import {
  composeKrMobilePhone,
  formatKrMobileSubscriberInput,
  getKrMobileSubscriberError,
  KR_MOBILE_SUBSCRIBER_LENGTH,
  toKrMobileSubscriberDigits,
} from '@/lib/phoneNumber';
import { validateProfileImageFile } from '@/lib/uploadProfileImage';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MISMATCH_ERROR_MESSAGE,
  validatePassword,
} from '@/lib/validatePassword';

import { CustomerProfilePhoneField } from './CustomerProfilePhoneField';
import { CustomerProfileRegionField } from './CustomerProfileRegionField';
import { CustomerProfileServiceField } from './CustomerProfileServiceField';
import { CustomerProfileTextField } from './CustomerProfileTextField';
import { ProfileImageCropModal } from './ProfileImageCropModal';
import { ProfileImageField } from './ProfileImageField';
import {
  buildCustomerProfileUpdateBody,
  getCustomerProfileUpdateError,
} from '../_lib/customerProfileUpdate';
import { toggleService } from '../_lib/toggleService';
import { useProfileImageCrop } from '../_lib/useProfileImageCrop';

import type {
  CustomerProfileMe,
  CustomerRegion,
  CustomerServiceType,
} from '@/types/customerProfile';

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 20;
const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 20;

const NAME_FORMAT_ERROR_MESSAGE = `이름은 ${NAME_MIN_LENGTH}~${NAME_MAX_LENGTH}자로 입력해 주세요.`;
const NICKNAME_FORMAT_ERROR_MESSAGE = `닉네임은 ${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}자로 입력해 주세요.`;
const PASSWORD_FORMAT_FIELD_ERROR_MESSAGE = '비밀번호가 올바르지 않습니다.';

interface CustomerProfilePasswordFieldsProps {
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
const CustomerProfilePasswordFields = ({
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
}: CustomerProfilePasswordFieldsProps) => {
  return (
    <>
      <div className="h-px w-full bg-line-100" aria-hidden />

      <section className="flex w-full flex-col items-start gap-4">
        <label
          htmlFor={currentPasswordId}
          className="text-lg-semibold text-black-300 lg:text-xl-semibold"
        >
          현재 비밀번호
        </label>
        <CustomerProfileTextField
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

      <div className="h-px w-full bg-line-100" aria-hidden />

      <section className="flex w-full flex-col items-start gap-4">
        <label
          htmlFor={newPasswordId}
          className="text-lg-semibold text-black-300 lg:text-xl-semibold"
        >
          새 비밀번호
        </label>
        <CustomerProfileTextField
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
        <CustomerProfileTextField
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
    </>
  );
};

interface CustomerProfileEditFieldsProps {
  profile: CustomerProfileMe;
}

/** profile이 있을 때만 마운트한다. key로 리마운트한다. */
const CustomerProfileEditFields = ({
  profile,
}: CustomerProfileEditFieldsProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const { mutate: upsertProfile, isPending } = useUpsertCustomerProfile({
    successMessage: '프로필이 수정되었습니다.',
    errorFallbackMessage:
      '프로필 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.',
  });
  const imageInputId = useId();
  const nameInputId = useId();
  const nicknameInputId = useId();
  const emailInputId = useId();
  const phoneInputId = useId();
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();
  const {
    imageInputRef,
    displayImageUrl,
    cropImageSrc,
    profileImageFile,
    hasImageChange,
    isImageCleared,
    handleImageChange,
    handleImageButtonClick,
    handleImageClear,
    handleCropClose,
    handleCropComplete,
  } = useProfileImageCrop({ initialImageUrl: profile.profileImageUrl });

  const [name, setName] = useState(profile.name);
  const [nickname, setNickname] = useState(profile.nickname);
  const [email] = useState(profile.email);
  const [phoneNumber, setPhoneNumber] = useState(
    formatKrMobileSubscriberInput(profile.phoneNumber ?? '')
  );
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedServices, setSelectedServices] = useState<
    CustomerServiceType[]
  >([...profile.service]);
  const [selectedRegion, setSelectedRegion] = useState<CustomerRegion | null>(
    profile.region
  );

  const trimmedName = name.trim();
  const trimmedNickname = nickname.trim();
  const subscriberDigits = toKrMobileSubscriberDigits(phoneNumber);
  const phoneFieldError = getKrMobileSubscriberError(phoneNumber);
  const isPhoneFormatError = Boolean(phoneFieldError);
  const showPasswordFields = profile.hasPassword;
  const isNameFormatError =
    trimmedName.length > 0 &&
    (trimmedName.length < NAME_MIN_LENGTH ||
      trimmedName.length > NAME_MAX_LENGTH);
  const isNicknameFormatError =
    trimmedNickname.length > 0 &&
    (trimmedNickname.length < NICKNAME_MIN_LENGTH ||
      trimmedNickname.length > NICKNAME_MAX_LENGTH);
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
    trimmedNickname.length >= NICKNAME_MIN_LENGTH &&
    trimmedNickname.length <= NICKNAME_MAX_LENGTH &&
    subscriberDigits.length === KR_MOBILE_SUBSCRIBER_LENGTH &&
    !isPhoneFormatError &&
    selectedServices.length > 0 &&
    selectedRegion !== null &&
    !isPasswordFormatError &&
    !isPasswordMismatchError &&
    !isPasswordIncomplete &&
    !isPending;
  const submitLabel = isPending ? '수정 중...' : '수정하기';

  const handleCancel = () => {
    router.back();
  };

  const handleValidatedImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageError = validateProfileImageFile(file);
      if (imageError) {
        event.target.value = '';
        showToast({ content: imageError });
        return;
      }
    }
    handleImageChange(event);
  };

  const handleServiceToggle = (value: CustomerServiceType) => {
    setSelectedServices((prev) => toggleService(prev, value));
  };

  const handleRegionSelect = (value: CustomerRegion) => {
    setSelectedRegion((prev) => (prev === value ? null : value));
  };

  /** 검증을 통과한 변경분만 제출한다 */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmitEnabled) return;

    const updateParams = {
      profile,
      name,
      nickname,
      phoneNumber: composeKrMobilePhone(phoneNumber),
      selectedServices,
      selectedRegion,
      currentPassword,
      newPassword,
      confirmPassword,
      hasImageChange,
    };

    const validationError = getCustomerProfileUpdateError(updateParams);
    if (validationError) {
      showToast({ content: validationError });
      return;
    }

    const body = buildCustomerProfileUpdateBody({
      ...updateParams,
      s3Key: isImageCleared && !profileImageFile ? null : undefined,
    });

    if (!body) {
      showToast({ content: '변경된 내용이 없습니다.' });
      return;
    }

    upsertProfile({
      body,
      imageFile: profileImageFile,
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[20.4375rem] flex-col items-stretch gap-8 bg-white lg:max-w-[87.5rem] lg:gap-16 lg:rounded-[2rem] lg:px-6 lg:pt-8 lg:pb-10"
      >
        <div className="flex w-full flex-col items-stretch gap-5 lg:gap-10">
          <header className="flex w-full flex-col items-start gap-8 lg:gap-10">
            <h1 className="text-2lg-bold text-black-400 lg:text-3xl-semibold">
              프로필 수정
            </h1>
            <div className="h-px w-full bg-line-100" aria-hidden />
          </header>

          <div className="flex w-full flex-col items-stretch gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
            <div className="flex w-full flex-col items-start gap-5 lg:max-w-[40rem] lg:gap-8">
              <section className="flex w-full flex-col items-start gap-4">
                <RequiredLabel htmlFor={nameInputId}>이름</RequiredLabel>
                <CustomerProfileTextField
                  id={nameInputId}
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  isError={isNameFormatError}
                  errorMessage={
                    isNameFormatError ? NAME_FORMAT_ERROR_MESSAGE : undefined
                  }
                />
              </section>

              <div className="h-px w-full bg-line-100" aria-hidden />

              <section className="flex w-full flex-col items-start gap-4">
                <RequiredLabel htmlFor={nicknameInputId}>닉네임</RequiredLabel>
                <CustomerProfileTextField
                  id={nicknameInputId}
                  name="nickname"
                  autoComplete="nickname"
                  placeholder="닉네임을 입력해 주세요"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  isError={isNicknameFormatError}
                  errorMessage={
                    isNicknameFormatError
                      ? NICKNAME_FORMAT_ERROR_MESSAGE
                      : undefined
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
                <CustomerProfileTextField
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

              <CustomerProfilePhoneField
                id={phoneInputId}
                value={phoneNumber}
                errorMessage={phoneFieldError ?? undefined}
                onChange={(event) =>
                  setPhoneNumber(
                    formatKrMobileSubscriberInput(event.target.value)
                  )
                }
              />

              {showPasswordFields ? (
                <CustomerProfilePasswordFields
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

            <div className="h-px w-full bg-line-100 lg:hidden" aria-hidden />

            <div className="flex w-full flex-col items-start gap-5 lg:max-w-[40rem] lg:gap-8">
              <ProfileImageField
                imageInputId={imageInputId}
                imageInputRef={imageInputRef}
                displayImageUrl={displayImageUrl}
                onImageChange={handleValidatedImageChange}
                onImageButtonClick={handleImageButtonClick}
                onImageClear={handleImageClear}
              />

              <div className="h-px w-full bg-line-100" aria-hidden />

              <CustomerProfileServiceField
                selectedServices={selectedServices}
                helperText="*견적 요청 시 이용 서비스를 선택할 수 있어요."
                onToggle={handleServiceToggle}
              />

              <div className="h-px w-full bg-line-100" aria-hidden />

              <CustomerProfileRegionField
                selectedRegion={selectedRegion}
                helperText="*견적 요청 시 지역을 설정할 수 있어요."
                onSelect={handleRegionSelect}
              />
            </div>
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
            className="order-2 border-gray-200 text-gray-300 shadow-cta hover:border-gray-200 hover:bg-transparent hover:text-gray-300 hover:shadow-cta lg:order-1 lg:h-16 lg:max-w-[41.25rem] lg:text-xl-semibold"
          >
            취소
          </Button>
        </div>
      </form>

      {cropImageSrc ? (
        <ProfileImageCropModal
          imageSrc={cropImageSrc}
          onClose={handleCropClose}
          onCropComplete={handleCropComplete}
        />
      ) : null}
    </>
  );
};

/** `/profile/customer/edit` 프로필 조회·로딩·에러 가드. 성공 시 수정 폼을 마운트한다. */
export const CustomerProfileEditForm = () => {
  const {
    data: profile,
    isPending,
    isError,
    error,
    refetch,
  } = useCustomerProfile();

  const handleRetry = () => {
    void refetch();
  };

  if (isPending) {
    return <Spinner message="프로필 불러오는 중..." />;
  }

  if (isError) {
    const message =
      error instanceof ApiError
        ? error.message
        : '프로필을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';

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
    redirect('/profile/customer');
  }

  return (
    <CustomerProfileEditFields key={profile.updatedAt} profile={profile} />
  );
};
