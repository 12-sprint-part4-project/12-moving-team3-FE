'use client';

import { useRouter } from 'next/navigation';
import {
  useEffect,
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';

import NoImageIcon from '@/assets/icons/no-image.svg';
import { Button } from '@/components/Button/Button';
import { RegionChip, ServiceChip } from '@/components/ui/Chip';
import { TextFieldOutlined } from '@/components/ui/Input';
import {
  REGION_CHIP_OPTIONS,
  SERVICE_CHIP_OPTIONS,
} from '@/constants/commonOptions';
import { useAuth } from '@/hooks/useAuth';
import { customerProfileQueryKeys } from '@/hooks/useCustomerProfile';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { getAuthSession } from '@/lib/authSession';
import { uploadProfileImage } from '@/lib/uploadProfileImage';
import { cn } from '@/lib/utils';
import { upsertCustomerProfile } from '@/services/customerProfileApi';
import type {
  CustomerRegion,
  CustomerServiceType,
} from '@/types/customerProfile';

import { toggleService } from '../_lib/toggleService';
import { useProfileImageCrop } from '../_lib/useProfileImageCrop';
import { ProfileImageCropModal } from './ProfileImageCropModal';

const PHONE_NUMBER_LENGTH = 11;

const FIELD_CLASSNAME =
  'w-full [&_>div]:min-h-[3.375rem] [&_>div]:w-full [&_>div]:max-w-full lg:[&_>div]:min-h-16 [&_input]:lg:text-xl-regular';

/** Figma Mobile·Tablet: lg-semibold / Desktop(lg+): xl-semibold */
const LABEL_CLASSNAME = 'text-lg-semibold text-black-300 lg:text-xl-semibold';

/** Figma Mobile·Tablet chip sm / Desktop: md */
const CHIP_CLASSNAME =
  'px-3 py-1.5 text-md-medium lg:px-5 lg:py-2.5 lg:text-2lg-medium';

const toDigits = (value: string): string => value.replace(/\D/g, '');

export const CustomerProfileForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setSession } = useAuth();
  const { showToast } = useToast();
  const imageInputId = useId();
  const phoneInputId = useId();
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

  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedServices, setSelectedServices] = useState<
    CustomerServiceType[]
  >([]);
  const [selectedRegion, setSelectedRegion] = useState<CustomerRegion | null>(
    null
  );
  const [isPending, setIsPending] = useState(false);

  const isPhoneValid = phoneNumber.length === PHONE_NUMBER_LENGTH;
  const isSubmitEnabled =
    isPhoneValid &&
    selectedServices.length > 0 &&
    selectedRegion !== null &&
    !isPending;

  // 세션에 번호가 있으면(이전 데이터 등) 미리 채운다. 신규 가입은 비어 있다.
  useEffect(() => {
    const sessionPhone = toDigits(user?.phoneNumber ?? '');
    if (!sessionPhone) return;

    setPhoneNumber((prev) => (prev ? prev : sessionPhone));
  }, [user?.phoneNumber]);

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(toDigits(event.target.value).slice(0, PHONE_NUMBER_LENGTH));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !isPhoneValid ||
      !selectedRegion ||
      selectedServices.length === 0 ||
      isPending
    ) {
      return;
    }

    setIsPending(true);

    try {
      let s3Key: string | undefined;

      if (profileImageFile) {
        s3Key = await uploadProfileImage(profileImageFile);
      }

      await upsertCustomerProfile({
        nickname: user?.nickname ?? '',
        phoneNumber,
        region: selectedRegion,
        service: selectedServices,
        ...(s3Key ? { s3Key } : {}),
      });

      await queryClient.invalidateQueries({
        queryKey: customerProfileQueryKeys.all,
      });

      const session = getAuthSession();
      if (session) {
        setSession({
          ...session,
          user: {
            ...session.user,
            phoneNumber,
            isProfileCompleted: true,
          },
        });
      }

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
            <section className="flex flex-col items-start gap-4 lg:gap-6">
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
                  'flex size-[6.25rem] cursor-pointer items-center justify-center overflow-hidden rounded-md bg-background-200 lg:size-40',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300'
                )}
              >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- blob preview
                  <img
                    src={previewUrl}
                    alt="선택한 프로필 이미지 미리보기"
                    className="size-full object-cover"
                  />
                ) : (
                  <NoImageIcon
                    className="size-8 text-gray-300 lg:size-10"
                    aria-hidden
                  />
                )}
              </button>
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-4 lg:gap-6">
              <label htmlFor={phoneInputId} className={LABEL_CLASSNAME}>
                전화번호
              </label>
              <TextFieldOutlined
                id={phoneInputId}
                size="sm"
                type="tel"
                name="phone"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="숫자만 입력해 주세요"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className={FIELD_CLASSNAME}
              />
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-6 lg:gap-8">
              <div className="flex flex-col items-start gap-2">
                <h2 className={LABEL_CLASSNAME}>이용 서비스</h2>
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
                <h2 className={LABEL_CLASSNAME}>내가 사는 지역</h2>
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
