'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';

import { Button } from '@/components/Button/Button';
import { ProfileImageCropModal } from '@/components/profile/ProfileImageCropModal';
import { ProfileImageField } from '@/components/profile/ProfileImageField';
import { ProfilePhoneField } from '@/components/profile/ProfilePhoneField';
import { ProfileRegionField } from '@/components/profile/ProfileRegionField';
import { ProfileServiceField } from '@/components/profile/ProfileServiceField';
import { useAuth } from '@/hooks/useAuth';
import { useUpsertCustomerProfile } from '@/hooks/useCustomerProfile';
import { useProfileImageCrop } from '@/hooks/useProfileImageCrop';
import { useToast } from '@/hooks/useToast';
import {
  composeKrMobilePhone,
  formatKrMobileSubscriberInput,
  getKrMobileSubscriberError,
  KR_MOBILE_SUBSCRIBER_LENGTH,
  toKrMobileSubscriberDigits,
  toPhoneDigits,
} from '@/lib/phoneNumber';
import { validateProfileImageFile } from '@/lib/uploadProfileImage';

import { toggleService } from '../_lib/toggleService';

import type {
  CustomerRegion,
  CustomerServiceType,
} from '@/types/customerProfile';

/** `/profile/customer` 고객 프로필 등록 폼 */
export const CustomerProfileForm = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { mutate: upsertProfile, isPending } = useUpsertCustomerProfile({
    successMessage: '프로필 등록이 완료되었습니다.',
    errorFallbackMessage:
      '프로필 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.',
  });
  const imageInputId = useId();
  const phoneInputId = useId();
  const {
    imageInputRef,
    displayImageUrl,
    cropImageSrc,
    profileImageFile,
    handleImageChange,
    handleImageButtonClick,
    handleImageClear,
    handleCropClose,
    handleCropComplete,
  } = useProfileImageCrop();

  const [phoneDraft, setPhoneDraft] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<
    CustomerServiceType[]
  >([]);
  const [selectedRegion, setSelectedRegion] = useState<CustomerRegion | null>(
    null
  );

  // 세션 번호는 effect로 복사하지 않고, 미입력 시 표시값 fallback으로 사용
  const phoneNumber =
    phoneDraft ?? formatKrMobileSubscriberInput(user?.phoneNumber ?? '');
  const subscriberDigits = toKrMobileSubscriberDigits(phoneNumber);
  const phoneFieldError = getKrMobileSubscriberError(phoneNumber);
  const isPhoneFormatError = Boolean(phoneFieldError);
  const isSubmitEnabled =
    subscriberDigits.length === KR_MOBILE_SUBSCRIBER_LENGTH &&
    !isPhoneFormatError &&
    selectedServices.length > 0 &&
    selectedRegion !== null &&
    !isPending;
  const submitLabel = isPending ? '등록 중...' : '시작하기';

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneDraft(formatKrMobileSubscriberInput(event.target.value));
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

  /** 전화·서비스·지역을 검증한 뒤 프로필을 등록하고 홈으로 이동한다 */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmitEnabled || selectedRegion === null) return;

    upsertProfile(
      {
        body: {
          phoneNumber: toPhoneDigits(composeKrMobilePhone(phoneNumber)),
          region: selectedRegion,
          service: selectedServices,
        },
        imageFile: profileImageFile,
      },
      {
        onSuccess: () => {
          router.replace('/');
        },
      }
    );
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[20.4375rem] flex-col items-stretch gap-8 lg:max-w-[40rem] lg:gap-14"
      >
        <div className="flex w-full flex-col items-stretch gap-4 lg:gap-16">
          <header className="flex w-full flex-col items-start gap-4 lg:gap-8">
            <h1 className="text-2lg-bold text-black-400 lg:text-3xl-semibold">
              프로필 등록
            </h1>
            <p className="text-xs-regular text-black-100 lg:text-xl-regular lg:text-black-200">
              추가 정보를 입력하여 회원가입을 완료해주세요.
            </p>
            <div className="h-px w-full bg-line-100" aria-hidden />
          </header>

          <div className="flex w-full flex-col items-start gap-5 lg:gap-8">
            <ProfileImageField
              imageInputId={imageInputId}
              imageInputRef={imageInputRef}
              displayImageUrl={displayImageUrl}
              onImageChange={handleValidatedImageChange}
              onImageButtonClick={handleImageButtonClick}
              onImageClear={handleImageClear}
            />

            <div className="h-px w-full bg-line-100" aria-hidden />

            <ProfilePhoneField
              id={phoneInputId}
              value={phoneNumber}
              errorMessage={phoneFieldError ?? undefined}
              onChange={handlePhoneChange}
              className="lg:gap-6"
            />

            <div className="h-px w-full bg-line-100" aria-hidden />

            <ProfileServiceField
              selectedServices={selectedServices}
              helperText="이용 서비스는 중복 선택 가능하며, 언제든 수정 가능해요!"
              label="이용 서비스"
              onToggle={handleServiceToggle}
            />

            <div className="h-px w-full bg-line-100" aria-hidden />

            <ProfileRegionField
              selectedRegions={selectedRegion ? [selectedRegion] : []}
              helperText="내가 사는 지역은 언제든 수정 가능해요!"
              label="내가 사는 지역"
              onSelect={handleRegionSelect}
            />
          </div>
        </div>

        <div className="w-full">
          <Button
            type="submit"
            variant="solid"
            size="sm"
            disabled={!isSubmitEnabled}
            className="lg:h-16 lg:text-xl-semibold"
          >
            {submitLabel}
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
