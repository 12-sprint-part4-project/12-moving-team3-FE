'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/Button/Button';
import { RegionChip, ServiceChip } from '@/components/ui/Chip';
import { TextFieldOutlined } from '@/components/ui/Input';
import {
  REGION_CHIP_OPTIONS,
  SERVICE_CHIP_OPTIONS,
} from '@/constants/commonOptions';
import { useAuth } from '@/hooks/useAuth';
import { AUTH_QUERY_KEYS } from '@/hooks/useAuthMe';
import { customerProfileQueryKeys } from '@/hooks/useCustomerProfile';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { getAuthSession } from '@/lib/authSession';
import { cn } from '@/lib/utils';
import {
  composeKrMobilePhone,
  formatKrMobileSubscriberInput,
  getKrMobileSubscriberError,
  getPhoneNumberError,
  KR_MOBILE_PREFIX_LABEL,
  KR_MOBILE_SUBSCRIBER_LENGTH,
  toKrMobileSubscriberDigits,
  toPhoneDigits,
} from '@/lib/phoneNumber';
import { uploadProfileImage } from '@/lib/uploadProfileImage';
import { upsertCustomerProfile } from '@/services/customerProfileApi';
import type {
  CustomerRegion,
  CustomerServiceType,
} from '@/types/customerProfile';

import { toggleService } from '../_lib/toggleService';
import { useProfileImageCrop } from '../_lib/useProfileImageCrop';
import { ProfileImageCropModal } from './ProfileImageCropModal';
import { ProfileImageField } from './ProfileImageField';

const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 20;

const FIELD_CLASSNAME =
  'w-full [&_>div]:min-h-[3.375rem] [&_>div]:w-full [&_>div]:max-w-full lg:[&_>div]:min-h-16 lg:[&_>div]:text-xl-regular';

/** Figma Mobile·Tablet: lg-semibold / Desktop(lg+): xl-semibold */
const LABEL_CLASSNAME = 'text-lg-semibold text-black-300 lg:text-xl-semibold';

const FIELD_HINT_CLASSNAME = 'text-md-medium text-gray-400 lg:text-lg-medium';

const FieldHint = ({ children }: { children: string }) => (
  <span className={FIELD_HINT_CLASSNAME}>{children}</span>
);

/** Figma Mobile·Tablet chip sm / Desktop: md */
const CHIP_CLASSNAME =
  'px-3 py-1.5 text-md-medium lg:px-5 lg:py-2.5 lg:text-2lg-medium';

export const CustomerProfileForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { showToast } = useToast();
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
  const [isPending, setIsPending] = useState(false);

  // 세션 번호는 effect로 복사하지 않고, 미입력 시 표시값 fallback으로 사용
  const phoneNumber =
    phoneDraft ?? formatKrMobileSubscriberInput(user?.phoneNumber ?? '');
  const subscriberDigits = toKrMobileSubscriberDigits(phoneNumber);
  const phoneFieldError = getKrMobileSubscriberError(phoneNumber);
  const isPhoneFormatError = Boolean(phoneFieldError);

  const isSubmitEnabled =
    subscriberDigits.length === KR_MOBILE_SUBSCRIBER_LENGTH &&
    selectedServices.length > 0 &&
    selectedRegion !== null &&
    !isPending;

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneDraft(formatKrMobileSubscriberInput(event.target.value));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmitEnabled) return;

    const fullPhone = composeKrMobilePhone(phoneNumber);
    const phoneError = getPhoneNumberError(fullPhone);
    if (phoneError) {
      showToast({ content: phoneError });
      return;
    }

    const phoneDigits = toPhoneDigits(fullPhone);

    if (selectedServices.length === 0) {
      showToast({ content: '이용 서비스를 한 개 이상 선택해 주세요.' });
      return;
    }

    if (!selectedRegion) {
      showToast({ content: '내가 사는 지역을 선택해 주세요.' });
      return;
    }

    const nickname = user?.nickname?.trim() ?? '';
    if (
      nickname.length < NICKNAME_MIN_LENGTH ||
      nickname.length > NICKNAME_MAX_LENGTH
    ) {
      showToast({
        content: `닉네임은 ${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}자로 입력해 주세요.`,
      });
      return;
    }

    setIsPending(true);

    try {
      let s3Key: string | undefined;

      if (profileImageFile) {
        s3Key = await uploadProfileImage(profileImageFile);
      }

      await upsertCustomerProfile({
        nickname,
        phoneNumber: phoneDigits,
        region: selectedRegion,
        service: selectedServices,
        ...(s3Key ? { s3Key } : {}),
      });

      await queryClient.invalidateQueries({
        queryKey: customerProfileQueryKeys.all,
      });
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me() });

      showToast({ content: '프로필 등록이 완료되었습니다.' });
      router.replace('/');
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '프로필 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.';
      showToast({ content: message });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
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
              labelClassName={LABEL_CLASSNAME}
              labelExtra={<FieldHint>(선택)</FieldHint>}
              onImageChange={handleImageChange}
              onImageButtonClick={handleImageButtonClick}
              onImageClear={handleImageClear}
            />

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-4 lg:gap-6">
              <label
                htmlFor={phoneInputId}
                className={cn(LABEL_CLASSNAME, 'flex items-center gap-1.5')}
              >
                전화번호
                <FieldHint>(필수)</FieldHint>
              </label>
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
                onChange={handlePhoneChange}
                isError={isPhoneFormatError}
                errorMessage={phoneFieldError ?? undefined}
                className={FIELD_CLASSNAME}
              />
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-6 lg:gap-8">
              <div className="flex flex-col items-start gap-2">
                <h2
                  className={cn(LABEL_CLASSNAME, 'flex items-center gap-1.5')}
                >
                  이용 서비스
                  <FieldHint>(필수)</FieldHint>
                </h2>
                <p className="text-xs-regular text-gray-400 lg:text-lg-regular">
                  *이용 서비스는 중복 선택 가능하며, 언제든 수정 가능해요!
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
                <h2
                  className={cn(LABEL_CLASSNAME, 'flex items-center gap-1.5')}
                >
                  내가 사는 지역
                  <FieldHint>(필수)</FieldHint>
                </h2>
                <p className="text-xs-regular text-gray-400 lg:text-lg-regular">
                  *내가 사는 지역은 언제든 수정 가능해요!
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

        <div className="w-full">
          <Button
            type="submit"
            variant="solid"
            size="sm"
            disabled={!isSubmitEnabled}
            className="lg:h-16 lg:text-xl-semibold"
          >
            {isPending ? '등록 중...' : '시작하기'}
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
