'use client';

import { redirect, useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import NoImageIcon from '@/assets/icons/no-image.svg';
import { Button } from '@/components/Button/Button';
import { RegionChip, ServiceChip } from '@/components/ui/Chip';
import { TextFieldOutlined } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import {
  REGION_CHIP_OPTIONS,
  SERVICE_CHIP_OPTIONS,
  type RegionChipValue,
  type ServiceChipValue,
} from '@/constants/commonOptions';
import { useAuth } from '@/hooks/useAuth';
import {
  customerProfileQueryKeys,
  useCustomerProfile,
} from '@/hooks/useCustomerProfile';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { getAuthSession } from '@/lib/authSession';
import { uploadProfileImage } from '@/lib/uploadProfileImage';
import { cn } from '@/lib/utils';
import { upsertCustomerProfile } from '@/services/customerProfileApi';
import type { CustomerProfileMe } from '@/types/customerProfile';

import {
  buildCustomerProfileUpdateBody,
  getCustomerProfileUpdateError,
} from '../_lib/customerProfileUpdate';
import { toggleService } from '../_lib/toggleService';
import { useProfileImageCrop } from '../_lib/useProfileImageCrop';
import { ProfileImageCropModal } from './ProfileImageCropModal';

const FIELD_CLASSNAME =
  'w-full [&_>div]:min-h-16 [&_>div]:w-full [&_>div]:max-w-full [&_input]:text-xl-regular';

const READONLY_FIELD_CLASSNAME = `${FIELD_CLASSNAME} [&_input]:!text-gray-300`;

const LABEL_CLASSNAME = 'text-xl-semibold text-black-300';

const CHIP_CLASSNAME = 'px-5 py-2.5 text-2lg-medium';

const HELPER_CLASSNAME = 'text-lg-regular text-gray-400';

interface CustomerProfileEditFieldsProps {
  profile: CustomerProfileMe;
}

/** 쿼리 데이터로 초기화된 수정 폼. 마운트 시점에 profile이 이미 존재한다. */
const CustomerProfileEditFields = ({
  profile,
}: CustomerProfileEditFieldsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setSession } = useAuth();
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
    previewUrl,
    cropImageSrc,
    profileImageFile,
    handleImageChange,
    handleImageButtonClick,
    handleCropClose,
    handleCropComplete,
  } = useProfileImageCrop();

  const [name, setName] = useState(profile.name);
  const [nickname, setNickname] = useState(profile.nickname);
  const [email] = useState(profile.email);
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber ?? '');
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

  const displayImageUrl = previewUrl ?? profile.profileImageUrl;

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const updateParams = {
      profile,
      name,
      nickname,
      phoneNumber,
      selectedServices,
      selectedRegion,
      currentPassword,
      newPassword,
      confirmPassword,
      hasImageChange: Boolean(profileImageFile),
    };

    const validationError = getCustomerProfileUpdateError(updateParams);
    if (validationError) {
      showToast({ content: validationError });
      return;
    }

    setIsSubmitting(true);

    try {
      let s3Key: string | undefined;

      if (profileImageFile) {
        s3Key = await uploadProfileImage(profileImageFile);
      }

      const body = buildCustomerProfileUpdateBody({
        ...updateParams,
        s3Key,
      });

      if (!body) {
        showToast({ content: '변경된 내용이 없습니다.' });
        return;
      }

      const response = await upsertCustomerProfile(body);

      await queryClient.invalidateQueries({
        queryKey: customerProfileQueryKeys.all,
      });

      const session = getAuthSession();
      if (session) {
        setSession({
          ...session,
          user: {
            ...session.user,
            nickname: response.data.nickname,
            phoneNumber: response.data.phoneNumber ?? session.user.phoneNumber,
          },
        });
      }

      showToast({ content: '프로필이 수정되었습니다.' });
      router.back();
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
        className="flex w-full max-w-[87.5rem] flex-col items-stretch gap-10 rounded-[2rem] bg-white px-6 pt-8 pb-10 lg:gap-16"
      >
        <div className="flex w-full flex-col items-stretch gap-10">
          <header className="flex w-full flex-col items-start gap-10">
            <h1 className="text-3xl-semibold text-black-400">프로필 수정</h1>
            <div className="h-px w-full bg-line-100" aria-hidden />
          </header>

          <div className="flex w-full flex-col items-stretch gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex w-full flex-col items-start gap-8 lg:max-w-[40rem]">
              <section className="flex w-full flex-col items-start gap-4">
                <label htmlFor={nameInputId} className={LABEL_CLASSNAME}>
                  이름
                </label>
                <TextFieldOutlined
                  id={nameInputId}
                  size="md"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={FIELD_CLASSNAME}
                />
              </section>

              <div className="h-px w-full bg-line-100" aria-hidden />

              <section className="flex w-full flex-col items-start gap-4">
                <label htmlFor={nicknameInputId} className={LABEL_CLASSNAME}>
                  닉네임
                </label>
                <TextFieldOutlined
                  id={nicknameInputId}
                  size="md"
                  name="nickname"
                  autoComplete="nickname"
                  placeholder="닉네임을 입력해 주세요"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
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
                  size="md"
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
                  size="md"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className={FIELD_CLASSNAME}
                />
              </section>

              <div className="h-px w-full bg-line-100" aria-hidden />

              <section className="flex w-full flex-col items-start gap-4">
                <label htmlFor={currentPasswordId} className={LABEL_CLASSNAME}>
                  현재 비밀번호
                </label>
                <TextFieldOutlined
                  id={currentPasswordId}
                  size="md"
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

              <div className="h-px w-full bg-line-100" aria-hidden />

              <section className="flex w-full flex-col items-start gap-4">
                <label htmlFor={newPasswordId} className={LABEL_CLASSNAME}>
                  새 비밀번호
                </label>
                <TextFieldOutlined
                  id={newPasswordId}
                  size="md"
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
                  size="md"
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

            <div className="flex w-full flex-col items-start gap-8 lg:max-w-[40rem]">
              <section className="flex flex-col items-start gap-6">
                <h2 className={LABEL_CLASSNAME}>프로필 이미지</h2>
                <input
                  ref={imageInputRef}
                  id={imageInputId}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={handleImageButtonClick}
                  aria-label="프로필 이미지 업로드"
                  className={cn(
                    'flex size-40 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-background-200',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300'
                  )}
                >
                  {displayImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- Presigned URL / blob preview
                    <img
                      src={displayImageUrl}
                      alt="프로필 이미지"
                      className="size-full object-cover"
                    />
                  ) : (
                    <NoImageIcon
                      className="size-10 text-gray-300"
                      aria-hidden
                    />
                  )}
                </button>
              </section>

              <div className="h-px w-full bg-line-100" aria-hidden />

              <section className="flex w-full flex-col items-start gap-8">
                <div className="flex flex-col items-start gap-2">
                  <h2 className={LABEL_CLASSNAME}>이용 서비스</h2>
                  <p className={HELPER_CLASSNAME}>
                    *견적 요청 시 이용 서비스를 선택할 수 있어요.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
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

              <section className="flex w-full flex-col items-start gap-8">
                <div className="flex w-full flex-col items-start gap-2">
                  <h2 className={LABEL_CLASSNAME}>내가 사는 지역</h2>
                  <p className={HELPER_CLASSNAME}>
                    *견적 요청 시 지역을 설정할 수 있어요.
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-3.5 gap-y-[1.125rem]">
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

        <div className="flex w-full flex-col gap-4 lg:flex-row lg:justify-between">
          <Button
            type="button"
            variant="outlined"
            size="md"
            onClick={handleCancel}
            className="border-gray-200 text-gray-300 shadow-cta hover:border-gray-200 hover:bg-transparent hover:text-gray-300 hover:shadow-cta lg:max-w-[41.25rem]"
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="solid"
            size="md"
            disabled={isSubmitting}
            className="lg:max-w-[41.25rem]"
          >
            {isSubmitting ? '수정 중...' : '수정하기'}
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
