'use client';

import { redirect, useRouter } from 'next/navigation';
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/Button/Button';
import { RegionChip, ServiceChip } from '@/components/ui/Chip';
import { TextFieldOutlined } from '@/components/ui/Input';
import { RequiredLabel } from '@/components/ui/RequiredLabel/RequiredLabel';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import {
  REGION_CHIP_OPTIONS,
  SERVICE_CHIP_OPTIONS,
  type RegionChipValue,
  type ServiceChipValue,
} from '@/constants/commonOptions';
import { AUTH_QUERY_KEYS, customerProfileQueryKeys } from '@/constants/queryKey';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';
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
import {
  uploadProfileImage,
  validateProfileImageFile,
} from '@/lib/uploadProfileImage';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MISMATCH_ERROR_MESSAGE,
  validatePassword,
} from '@/lib/validatePassword';
import { upsertCustomerProfile } from '@/services/customerProfileApi';
import type { CustomerProfileMe } from '@/types/customerProfile';

import {
  buildCustomerProfileUpdateBody,
  getCustomerProfileUpdateError,
} from '../_lib/customerProfileUpdate';
import { toggleService } from '../_lib/toggleService';
import { useProfileImageCrop } from '../_lib/useProfileImageCrop';
import { ProfileImageCropModal } from './ProfileImageCropModal';
import { ProfileImageField } from './ProfileImageField';

/** Figma Mobile·Tablet: input sm / Desktop(lg+): md 높이·텍스트 */
const FIELD_CLASSNAME =
  'w-full [&_>div]:min-h-[3.375rem] [&_>div]:w-full [&_>div]:max-w-full lg:[&_>div]:min-h-16 lg:[&_>div]:text-xl-regular';

const READONLY_FIELD_CLASSNAME = `${FIELD_CLASSNAME} [&_input]:!text-gray-300`;

/** Figma Mobile·Tablet: lg-semibold / Desktop(lg+): xl-semibold */
const LABEL_CLASSNAME = 'text-lg-semibold text-black-300 lg:text-xl-semibold';

/** Figma Mobile·Tablet chip sm / Desktop: md */
const CHIP_CLASSNAME =
  'px-3 py-1.5 text-md-medium lg:px-5 lg:py-2.5 lg:text-2lg-medium';

const HELPER_CLASSNAME = 'text-xs-regular text-gray-400 lg:text-lg-regular';

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 20;
const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 20;

const NAME_FORMAT_ERROR_MESSAGE = `이름은 ${NAME_MIN_LENGTH}~${NAME_MAX_LENGTH}자로 입력해 주세요.`;
const NICKNAME_FORMAT_ERROR_MESSAGE = `닉네임은 ${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}자로 입력해 주세요.`;
const PASSWORD_FORMAT_FIELD_ERROR_MESSAGE = '비밀번호가 올바르지 않습니다.';

interface CustomerProfileEditFieldsProps {
  profile: CustomerProfileMe;
}

/** 쿼리 데이터로 초기화된 수정 폼. 마운트 시점에 profile이 이미 존재한다. */
const CustomerProfileEditFields = ({
  profile,
}: CustomerProfileEditFieldsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
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
  const [selectedServices, setSelectedServices] = useState<ServiceChipValue[]>([
    ...profile.service,
  ]);
  const [selectedRegion, setSelectedRegion] = useState<RegionChipValue | null>(
    profile.region
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedName = name.trim();
  const trimmedNickname = nickname.trim();
  const subscriberDigits = toKrMobileSubscriberDigits(phoneNumber);
  const phoneFieldError = getKrMobileSubscriberError(phoneNumber);
  const isPhoneFormatError = Boolean(phoneFieldError);

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
    !isSubmitting;

  const handleCancel = () => {
    router.back();
  };

  const handleValidatedImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

    setIsSubmitting(true);

    try {
      let s3Key: string | null | undefined;

      if (profileImageFile) {
        s3Key = await uploadProfileImage(profileImageFile);
      } else if (isImageCleared) {
        s3Key = null;
      }

      const body = buildCustomerProfileUpdateBody({
        ...updateParams,
        s3Key,
      });

      if (!body) {
        showToast({ content: '변경된 내용이 없습니다.' });
        return;
      }

      await upsertCustomerProfile(body);

      await queryClient.invalidateQueries({
        queryKey: customerProfileQueryKeys.all,
      });
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me() });

      showToast({ content: '프로필이 수정되었습니다.' });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '프로필 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.';
      showToast({ content: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
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
                <RequiredLabel htmlFor={nicknameInputId}>닉네임</RequiredLabel>
                <TextFieldOutlined
                  id={nicknameInputId}
                  size="sm"
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
                  autoComplete="tel"
                  leftAddon={KR_MOBILE_PREFIX_LABEL}
                  placeholder="1234-5678"
                  value={formatKrMobileSubscriberInput(phoneNumber)}
                  onChange={(event) =>
                    setPhoneNumber(
                      formatKrMobileSubscriberInput(event.target.value)
                    )
                  }
                  isError={isPhoneFormatError}
                  errorMessage={phoneFieldError ?? undefined}
                  className={FIELD_CLASSNAME}
                />
              </section>

              {profile.hasPassword ? (
                <>
                  <div className="h-px w-full bg-line-100" aria-hidden />

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

                  <div className="h-px w-full bg-line-100" aria-hidden />

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
                </>
              ) : null}
            </div>

            <div
              className="h-px w-full bg-line-100 lg:hidden"
              aria-hidden
            />

            <div className="flex w-full flex-col items-start gap-5 lg:max-w-[40rem] lg:gap-8">
              <ProfileImageField
                imageInputId={imageInputId}
                imageInputRef={imageInputRef}
                displayImageUrl={displayImageUrl}
                labelClassName={LABEL_CLASSNAME}
                onImageChange={handleValidatedImageChange}
                onImageButtonClick={handleImageButtonClick}
                onImageClear={handleImageClear}
              />

              <div className="h-px w-full bg-line-100" aria-hidden />

              <section className="flex w-full flex-col items-start gap-6 lg:gap-8">
                <div className="flex flex-col items-start gap-2">
                  <RequiredLabel>이용 서비스</RequiredLabel>
                  <p className={HELPER_CLASSNAME}>
                    *견적 요청 시 이용 서비스를 선택할 수 있어요.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 lg:gap-3">
                  {SERVICE_CHIP_OPTIONS.map((option) => (
                    <ServiceChip
                      key={option.value}
                      variant="button"
                      isSelected={selectedServices.includes(option.value)}
                      onClick={() =>
                        setSelectedServices((prev) =>
                          toggleService(prev, option.value)
                        )
                      }
                      className={CHIP_CLASSNAME}
                    >
                      {option.label}
                    </ServiceChip>
                  ))}
                </div>
              </section>

              <div className="h-px w-full bg-line-100" aria-hidden />

              <section className="flex w-full flex-col items-start gap-6 lg:gap-8">
                <div className="flex w-full flex-col items-start gap-2">
                  <RequiredLabel>내가 사는 지역</RequiredLabel>
                  <p className={HELPER_CLASSNAME}>
                    *견적 요청 시 지역을 설정할 수 있어요.
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-2 gap-y-3 lg:gap-x-3.5 lg:gap-y-[1.125rem]">
                  {REGION_CHIP_OPTIONS.map((option) => (
                    <RegionChip
                      key={option.value}
                      variant="button"
                      isSelected={selectedRegion === option.value}
                      onClick={() =>
                        setSelectedRegion((prev) =>
                          prev === option.value ? null : option.value
                        )
                      }
                      className={CHIP_CLASSNAME}
                    >
                      {option.label}
                    </RegionChip>
                  ))}
                </div>
              </section>
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
            {isSubmitting ? '수정 중...' : '수정하기'}
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

/** 고객 프로필 수정. useCustomerProfile로 조회 후 폼에 전달 */
export const CustomerProfileEditForm = () => {
  const {
    data: profile,
    isPending,
    isError,
    error,
    refetch,
  } = useCustomerProfile();

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
    redirect('/profile/customer');
  }

  return (
    <CustomerProfileEditFields key={profile.updatedAt} profile={profile} />
  );
};
