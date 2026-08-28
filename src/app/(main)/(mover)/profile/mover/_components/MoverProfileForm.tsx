'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';

import { Button } from '@/components/Button/Button';
import { ProfileImageCropModal } from '@/components/profile/ProfileImageCropModal';
import { ProfileImageField } from '@/components/profile/ProfileImageField';
import { ProfilePhoneField } from '@/components/profile/ProfilePhoneField';
import { ProfileRegionField } from '@/components/profile/ProfileRegionField';
import { ProfileServiceField } from '@/components/profile/ProfileServiceField';
import { ProfileTextField } from '@/components/profile/ProfileTextField';
import { RequiredLabel } from '@/components/ui/RequiredLabel/RequiredLabel';
import { useAuth } from '@/hooks/useAuth';
import { useCreateMoverProfile } from '@/hooks/useMoverProfile';
import { useProfileImageCrop } from '@/hooks/useProfileImageCrop';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/i18n/useTranslation';
import {
  composeKrMobilePhone,
  formatKrMobileSubscriberInput,
  getKrMobileFieldState,
  toPhoneDigits,
} from '@/lib/phoneNumber';
import { toggleService } from '@/lib/toggleService';
import { validateProfileImageFile } from '@/lib/uploadProfileImage';
import {
  isProfileTextValid,
  PROFILE_TEXT_MAX_LENGTH,
} from '@/lib/validateProfileText';

import { MoverProfileTextArea } from './MoverProfileTextArea';
import { normalizeCareerInput } from '../_lib/normalizeCareerInput';
import {
  CAREER_FORMAT_ERROR_MESSAGE,
  DESCRIPTION_FORMAT_ERROR_MESSAGE,
  getMoverProfileTextFieldState,
  SHORT_INTRO_FORMAT_ERROR_MESSAGE,
} from '../_lib/validateMoverProfileText';

import type { MoverRegion, MoverServiceType } from '@/types/moverProfile';

/** `/profile/mover` 기사님 프로필 등록 폼 */
export const MoverProfileForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { mutate: createProfile, isPending } = useCreateMoverProfile({
    successMessage: t('profile.registerSuccess'),
    errorFallbackMessage: t('profile.registerError'),
  });
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
  const [selectedServices, setSelectedServices] = useState<MoverServiceType[]>(
    []
  );
  const [selectedRegions, setSelectedRegions] = useState<MoverRegion[]>([]);

  // 세션 번호는 effect로 복사하지 않고, 미입력 시 표시값 fallback으로 사용
  const phoneNumber =
    phoneDraft ?? formatKrMobileSubscriberInput(user?.phoneNumber ?? '');
  const { phoneFieldError, isPhoneComplete } =
    getKrMobileFieldState(phoneNumber);
  const {
    trimmedShortIntro,
    trimmedDescription,
    careerValue,
    isCareerValid,
    isCareerFormatError,
    isShortIntroFormatError,
    isShortIntroValid,
    isDescriptionFormatError,
    isDescriptionValid,
  } = getMoverProfileTextFieldState({
    career,
    shortIntro,
    description,
  });
  const isSubmitEnabled =
    isPhoneComplete &&
    isCareerValid &&
    isShortIntroValid &&
    isDescriptionValid &&
    selectedServices.length > 0 &&
    selectedRegions.length > 0 &&
    !isPending;
  const submitLabel = isPending
    ? t('profile.submitting')
    : t('auth.signup.submit');

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
    setCareer(normalizeCareerInput(event.target.value));
  };

  const handleShortIntroChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShortIntro(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleServiceToggle = (value: MoverServiceType) => {
    setSelectedServices((prev) => toggleService(prev, value));
  };

  const handleRegionToggle = (value: MoverRegion) => {
    setSelectedRegions((prev) => toggleService(prev, value));
  };

  /** 전화·경력·소개·서비스·지역을 검증한 뒤 프로필을 등록하고 요청 목록으로 이동한다 */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmitEnabled || careerValue === null) return;

    const fullPhone = composeKrMobilePhone(phoneNumber);
    const phoneDigits = toPhoneDigits(fullPhone);

    // 카카오 가입 닉네임은 최대 50자일 수 있어, 프로필 API(2~20자)에 맞게 자른다.
    const nickname = (user?.nickname?.trim() ?? '').slice(
      0,
      PROFILE_TEXT_MAX_LENGTH
    );
    if (!isProfileTextValid(nickname)) {
      showToast({
        content: t('profile.invalidSession'),
      });
      return;
    }

    createProfile(
      {
        body: {
          nickname,
          career: careerValue,
          shortDescription: trimmedShortIntro,
          description: trimmedDescription,
          service: selectedServices,
          serviceRegions: selectedRegions,
        },
        imageFile: profileImageFile,
        phoneDigits,
      },
      {
        onSuccess: () => {
          router.replace('/mover/requests');
        },
      }
    );
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[20.4375rem] flex-col items-stretch gap-6 lg:max-w-[87.5rem] lg:items-end lg:gap-12"
      >
        <header className="flex w-full flex-col items-start gap-4 lg:gap-8">
          <h1 className="text-2lg-bold text-black-400 lg:text-3xl-semibold">
            {t('profile.registerMoverTitle')}
          </h1>
          <p className="text-xs-regular text-black-100 lg:text-xl-regular lg:text-black-200">
            {t('profile.registerSubtitle')}
          </p>
          <div className="h-px w-full bg-line-100" aria-hidden />
        </header>

        <div className="flex w-full flex-col items-start gap-5 lg:flex-row lg:justify-between lg:gap-10">
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

            <ProfilePhoneField
              id={phoneInputId}
              value={phoneNumber}
              errorMessage={phoneFieldError ?? undefined}
              onChange={handlePhoneChange}
            />

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-4">
              <RequiredLabel htmlFor={careerInputId}>
                {t('profile.career')}
              </RequiredLabel>
              <ProfileTextField
                id={careerInputId}
                name="career"
                inputMode="numeric"
                placeholder={t('profile.careerPlaceholder')}
                value={career}
                onChange={handleCareerChange}
                isError={isCareerFormatError}
                errorMessage={
                  isCareerFormatError ? CAREER_FORMAT_ERROR_MESSAGE : undefined
                }
              />
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-4">
              <RequiredLabel htmlFor={shortIntroInputId}>
                {t('profile.shortIntro')}
              </RequiredLabel>
              <ProfileTextField
                id={shortIntroInputId}
                name="shortIntro"
                placeholder={t('profile.shortIntroPlaceholder')}
                value={shortIntro}
                onChange={handleShortIntroChange}
                isError={isShortIntroFormatError}
                errorMessage={
                  isShortIntroFormatError
                    ? SHORT_INTRO_FORMAT_ERROR_MESSAGE
                    : undefined
                }
              />
            </section>
          </div>

          <div className="h-px w-full bg-line-100 lg:hidden" aria-hidden />

          <div className="flex w-full flex-col items-start gap-5 lg:max-w-[40rem] lg:gap-8">
            <section className="flex w-full flex-col items-start gap-4">
              <RequiredLabel htmlFor={descriptionInputId}>
                {t('profile.description')}
              </RequiredLabel>
              <MoverProfileTextArea
                id={descriptionInputId}
                name="description"
                placeholder={t('profile.descriptionPlaceholder')}
                value={description}
                onChange={handleDescriptionChange}
                isError={isDescriptionFormatError}
                errorMessage={
                  isDescriptionFormatError
                    ? DESCRIPTION_FORMAT_ERROR_MESSAGE
                    : undefined
                }
              />
            </section>

            <div className="h-px w-full bg-line-100" aria-hidden />

            <ProfileServiceField
              selectedServices={selectedServices}
              label={t('movers.providedServices')}
              onToggle={handleServiceToggle}
            />

            <div className="h-px w-full bg-line-100" aria-hidden />

            <ProfileRegionField
              selectedRegions={selectedRegions}
              label={t('movers.availableRegions')}
              onSelect={handleRegionToggle}
            />
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
