'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { ProfileImageCropModal } from '@/app/(main)/(customer)/profile/customer/_components/ProfileImageCropModal';
import { ProfileImageField } from '@/app/(main)/(customer)/profile/customer/_components/ProfileImageField';
import { useProfileImageCrop } from '@/app/(main)/(customer)/profile/customer/_lib/useProfileImageCrop';
import { Button } from '@/components/Button/Button';
import { RegionChip, ServiceChip } from '@/components/ui/Chip';
import { TextArea, TextFieldOutlined } from '@/components/ui/Input';
import { RequiredLabel } from '@/components/ui/RequiredLabel/RequiredLabel';
import {
  REGION_CHIP_OPTIONS,
  SERVICE_CHIP_OPTIONS,
  type RegionChipValue,
  type ServiceChipValue,
} from '@/constants/commonOptions';
import { AUTH_QUERY_KEYS, moverProfileQueryKeys } from '@/constants/queryKey';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import {
  composeKrMobilePhone,
  formatKrMobileSubscriberInput,
  getKrMobileSubscriberError,
  KR_MOBILE_PREFIX_LABEL,
  KR_MOBILE_SUBSCRIBER_LENGTH,
  toKrMobileSubscriberDigits,
  toPhoneDigits,
} from '@/lib/phoneNumber';
import {
  uploadProfileImage,
  validateProfileImageFile,
} from '@/lib/uploadProfileImage';
import { cn } from '@/lib/utils';
import {
  getMoverProfileMe,
  updateMoverBasicInfo,
  upsertMoverProfile,
} from '@/services/moverProfileApi';

const FIELD_CLASSNAME =
  'w-full [&_>div]:min-h-[3.375rem] [&_>div]:w-full [&_>div]:max-w-full lg:[&_>div]:min-h-16 lg:[&_>div]:text-xl-regular';

const TEXTAREA_CLASSNAME =
  'w-full [&_>div]:min-h-40 [&_>div]:w-full [&_>div]:max-w-full [&_textarea]:lg:text-xl-regular';

/** Figma Mobile·Tablet: lg-semibold / Desktop(lg+): xl-semibold */
const LABEL_CLASSNAME = 'text-lg-semibold text-black-300 lg:text-xl-semibold';

/** Figma Mobile·Tablet chip sm / Desktop: md */
const CHIP_CLASSNAME =
  'px-3 py-1.5 text-md-medium lg:px-5 lg:py-2.5 lg:text-2lg-medium';

const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 20;
const CAREER_MAX = 50;
const SHORT_DESCRIPTION_MAX = 20;
const DESCRIPTION_MIN = 8;
const DESCRIPTION_MAX = 200;

const CAREER_FORMAT_ERROR_MESSAGE = `경력은 0~${CAREER_MAX} 사이의 값으로 입력해 주세요.`;
const SHORT_INTRO_FORMAT_ERROR_MESSAGE = `한 줄 소개는 1~${SHORT_DESCRIPTION_MAX}자로 입력해 주세요.`;
const DESCRIPTION_FORMAT_ERROR_MESSAGE = `상세 설명은 ${DESCRIPTION_MIN}~${DESCRIPTION_MAX}자로 입력해 주세요.`;

const toDigits = (value: string): string => value.replace(/\D/g, '');

const toggleChip = <T extends string>(values: T[], value: T): T[] =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];

interface MoverProfileFormProps {
  className?: string;
}

export const MoverProfileForm = ({ className }: MoverProfileFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { showToast } = useToast();
  const imageInputId = useId();
  const phoneInputId = useId();
  const careerInputId = useId();
  const shortIntroInputId = useId();
  const descriptionInputId = useId();

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
  const [career, setCareer] = useState('');
  const [shortIntro, setShortIntro] = useState('');
  const [description, setDescription] = useState('');
  const [selectedServices, setSelectedServices] = useState<ServiceChipValue[]>(
    []
  );
  const [selectedRegions, setSelectedRegions] = useState<RegionChipValue[]>([]);
  const [isPending, setIsPending] = useState(false);

  const phoneNumber =
    phoneDraft ?? formatKrMobileSubscriberInput(user?.phoneNumber ?? '');
  const subscriberDigits = toKrMobileSubscriberDigits(phoneNumber);
  const phoneFieldError = getKrMobileSubscriberError(phoneNumber);
  const isPhoneFormatError = Boolean(phoneFieldError);

  const trimmedShortIntro = shortIntro.trim();
  const trimmedDescription = description.trim();
  const careerValue = career === '' ? null : Number(career);
  const isCareerValid =
    careerValue !== null &&
    Number.isInteger(careerValue) &&
    careerValue >= 0 &&
    careerValue <= CAREER_MAX;

  const isCareerFormatError = career !== '' && !isCareerValid;
  const isShortIntroFormatError =
    trimmedShortIntro.length > SHORT_DESCRIPTION_MAX;
  const isDescriptionFormatError =
    trimmedDescription.length > 0 &&
    (trimmedDescription.length < DESCRIPTION_MIN ||
      trimmedDescription.length > DESCRIPTION_MAX);

  const isSubmitEnabled =
    subscriberDigits.length === KR_MOBILE_SUBSCRIBER_LENGTH &&
    !isPhoneFormatError &&
    isCareerValid &&
    trimmedShortIntro.length > 0 &&
    trimmedShortIntro.length <= SHORT_DESCRIPTION_MAX &&
    trimmedDescription.length >= DESCRIPTION_MIN &&
    trimmedDescription.length <= DESCRIPTION_MAX &&
    selectedServices.length > 0 &&
    selectedRegions.length > 0 &&
    !isPending;

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

  const handleCareerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = toDigits(event.target.value);
    if (digits === '') {
      setCareer('');
      return;
    }

    setCareer(String(Number(digits)));
  };

  const handleShortIntroChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShortIntro(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmitEnabled) return;
    if (careerValue === null) return;

    const fullPhone = composeKrMobilePhone(phoneNumber);
    const phoneDigits = toPhoneDigits(fullPhone);

    // 카카오 가입 닉네임은 최대 50자일 수 있어, 프로필 API(2~20자)에 맞게 자른다.
    const nickname = (user?.nickname?.trim() ?? '').slice(
      0,
      NICKNAME_MAX_LENGTH
    );
    if (nickname.length < NICKNAME_MIN_LENGTH) {
      showToast({
        content: '로그인 정보가 올바르지 않습니다. 다시 로그인해 주세요.',
      });
      return;
    }

    setIsPending(true);

    try {
      let s3Key: string | undefined;

      if (profileImageFile) {
        s3Key = await uploadProfileImage(profileImageFile);
      }

      // 프로필 PATCH에는 phoneNumber가 없다. 전화번호는 basic-info로 저장한다.
      await upsertMoverProfile({
        nickname,
        career: careerValue,
        shortDescription: trimmedShortIntro,
        description: trimmedDescription,
        service: selectedServices,
        serviceRegions: selectedRegions,
        ...(s3Key ? { s3Key } : {}),
      });

      const savedProfile = await getMoverProfileMe();
      if (savedProfile) {
        await updateMoverBasicInfo({
          name: savedProfile.name,
          phoneNumber: phoneDigits,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: moverProfileQueryKeys.all,
      });
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me() });

      showToast({ content: '프로필 등록이 완료되었습니다.' });
      router.replace('/mover/requests');
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
        className={cn(
          'flex w-full max-w-[20.4375rem] flex-col items-stretch gap-6 lg:max-w-[87.5rem] lg:items-end lg:gap-12',
          className
        )}
      >
        <header className="flex w-full flex-col items-start gap-4 lg:gap-8">
          <h1 className="text-2lg-bold text-black-400 lg:text-3xl-semibold">
            기사님 프로필 등록
          </h1>
          <p className="text-xs-regular text-black-100 lg:text-xl-regular lg:text-black-200">
            추가 정보를 입력하여 회원가입을 완료해주세요.
          </p>
          <div className="h-px w-full bg-line-100" aria-hidden />
        </header>

        <div className="flex w-full flex-col items-start gap-5 lg:flex-row lg:justify-between lg:gap-10">
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
                onChange={handlePhoneChange}
                isError={isPhoneFormatError}
                errorMessage={phoneFieldError ?? undefined}
                className={FIELD_CLASSNAME}
              />
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-4">
              <RequiredLabel htmlFor={careerInputId}>경력</RequiredLabel>
              <TextFieldOutlined
                id={careerInputId}
                size="sm"
                name="career"
                inputMode="numeric"
                placeholder="기사님의 경력을 입력해 주세요"
                value={career}
                onChange={handleCareerChange}
                isError={isCareerFormatError}
                errorMessage={
                  isCareerFormatError ? CAREER_FORMAT_ERROR_MESSAGE : undefined
                }
                className={FIELD_CLASSNAME}
              />
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-4">
              <RequiredLabel htmlFor={shortIntroInputId}>
                한 줄 소개
              </RequiredLabel>
              <TextFieldOutlined
                id={shortIntroInputId}
                size="sm"
                name="shortIntro"
                placeholder="한 줄 소개를 입력해 주세요"
                value={shortIntro}
                onChange={handleShortIntroChange}
                isError={isShortIntroFormatError}
                errorMessage={
                  isShortIntroFormatError
                    ? SHORT_INTRO_FORMAT_ERROR_MESSAGE
                    : undefined
                }
                className={FIELD_CLASSNAME}
              />
            </section>
          </div>

          <div className="h-px w-full bg-line-100 lg:hidden" aria-hidden />

          <div className="flex w-full flex-col items-start gap-5 lg:max-w-[40rem] lg:gap-8">
            <section className="flex w-full flex-col items-start gap-4">
              <RequiredLabel htmlFor={descriptionInputId}>
                상세 설명
              </RequiredLabel>
              <TextArea
                id={descriptionInputId}
                size="sm"
                name="description"
                placeholder="상세 내용을 입력해 주세요"
                value={description}
                onChange={handleDescriptionChange}
                isError={isDescriptionFormatError}
                errorMessage={
                  isDescriptionFormatError
                    ? DESCRIPTION_FORMAT_ERROR_MESSAGE
                    : undefined
                }
                className={TEXTAREA_CLASSNAME}
              />
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-4">
              <RequiredLabel>제공 서비스</RequiredLabel>
              <div className="flex flex-wrap gap-1.5 lg:gap-3">
                {SERVICE_CHIP_OPTIONS.map((option) => (
                  <ServiceChip
                    key={option.value}
                    variant="button"
                    isSelected={selectedServices.includes(option.value)}
                    onClick={() =>
                      setSelectedServices((prev) =>
                        toggleChip(prev, option.value)
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

            <section className="flex w-full flex-col items-start gap-4">
              <RequiredLabel>서비스 가능 지역</RequiredLabel>
              <div className="flex flex-wrap gap-x-2 gap-y-3 lg:gap-x-3.5 lg:gap-y-[1.125rem]">
                {REGION_CHIP_OPTIONS.map((option) => (
                  <RegionChip
                    key={option.value}
                    variant="button"
                    isSelected={selectedRegions.includes(option.value)}
                    onClick={() =>
                      setSelectedRegions((prev) =>
                        toggleChip(prev, option.value)
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

        <div className="w-full lg:max-w-[40rem]">
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
