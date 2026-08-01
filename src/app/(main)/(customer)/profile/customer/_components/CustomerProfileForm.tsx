'use client';

import { useRouter } from 'next/navigation';
import {
  useEffect,
  useId,
  useRef,
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
} from '@/constants/chipOptions';
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

import { ProfileImageCropModal } from './ProfileImageCropModal';

const PHONE_NUMBER_LENGTH = 11;

const FIELD_CLASSNAME =
  'w-full [&_>div]:min-h-[3.375rem] [&_>div]:w-full [&_>div]:max-w-full lg:[&_>div]:min-h-16 [&_input]:lg:text-xl-regular';

const LABEL_CLASSNAME = 'text-xl-semibold text-black-300';

const toDigits = (value: string): string => value.replace(/\D/g, '');

const toggleService = (
  values: CustomerServiceType[],
  value: CustomerServiceType
): CustomerServiceType[] =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];

export const CustomerProfileForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setSession } = useAuth();
  const { showToast } = useToast();
  const imageInputId = useId();
  const phoneInputId = useId();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(() =>
    toDigits(user?.phoneNumber ?? '')
  );
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

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (cropImageSrc) URL.revokeObjectURL(cropImageSrc);
    };
  }, [cropImageSrc]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setCropImageSrc(URL.createObjectURL(file));
  };

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(toDigits(event.target.value).slice(0, PHONE_NUMBER_LENGTH));
  };

  const handleCropClose = () => {
    setCropImageSrc(null);
  };

  const handleCropComplete = (blob: Blob) => {
    const file = new File([blob], 'profile.jpg', {
      type: blob.type || 'image/jpeg',
    });
    setProfileImageFile(file);
    setPreviewUrl(URL.createObjectURL(blob));
    setCropImageSrc(null);
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
        phoneNumber,
        region: selectedRegion,
        service: selectedServices,
        ...(s3Key ? { s3Key } : {}),
      });

      await queryClient.invalidateQueries({
        queryKey: customerProfileQueryKeys.me(),
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
        className="flex w-full max-w-[40rem] flex-col items-center gap-14"
      >
        <div className="flex w-full flex-col items-center gap-16">
          <header className="flex w-full flex-col items-start gap-8">
            <h1 className="text-3xl-semibold text-black-400">프로필 등록</h1>
            <p className="text-xl-regular text-black-200">
              추가 정보를 입력하여 회원가입을 완료해주세요.
            </p>
            <div className="h-px w-full bg-line-100" aria-hidden />
          </header>

          <div className="flex w-full flex-col items-start gap-8">
            <section className="flex flex-col items-start gap-6">
              <h2 className="text-xl-semibold text-black-300">프로필 이미지</h2>
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
                  'flex size-40 items-center justify-center overflow-hidden rounded-md bg-background-200',
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
                  <NoImageIcon className="size-10 text-gray-300" aria-hidden />
                )}
              </button>
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-6">
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

            <section className="flex w-full flex-col items-start gap-8">
              <div className="flex flex-col items-start gap-2">
                <h2 className="text-xl-semibold text-black-300">이용 서비스</h2>
                <p className="text-lg-regular text-gray-400">
                  *이용 서비스는 중복 선택 가능하며, 언제든 수정 가능해요!
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
                  >
                    {option.label}
                  </ServiceChip>
                ))}
              </div>
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-8">
              <div className="flex w-full flex-col items-start gap-2">
                <h2 className="text-xl-semibold text-black-300">
                  내가 사는 지역
                </h2>
                <p className="text-lg-regular text-gray-400">
                  *내가 사는 지역은 언제든 수정 가능해요!
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
            size="md"
            disabled={!isSubmitEnabled}
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
