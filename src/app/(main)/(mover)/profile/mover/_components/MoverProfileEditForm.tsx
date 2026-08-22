'use client';

import { redirect, useRouter } from 'next/navigation';
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';

import { Button } from '@/components/Button/Button';
import { ProfileImageCropModal } from '@/components/profile/ProfileImageCropModal';
import { ProfileImageField } from '@/components/profile/ProfileImageField';
import { ProfileRegionField } from '@/components/profile/ProfileRegionField';
import { ProfileServiceField } from '@/components/profile/ProfileServiceField';
import { ProfileTextField } from '@/components/profile/ProfileTextField';
import { RequiredLabel } from '@/components/ui/RequiredLabel/RequiredLabel';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import {
  useMoverProfile,
  useUpsertMoverProfile,
} from '@/hooks/useMoverProfile';
import { useProfileImageCrop } from '@/hooks/useProfileImageCrop';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/i18n/useTranslation';
import { ApiError } from '@/lib/apiClient';
import { isValidKrPhoneNumber } from '@/lib/phoneNumber';
import { toggleService } from '@/lib/toggleService';
import { validateProfileImageFile } from '@/lib/uploadProfileImage';
import {
  isProfileTextFormatError,
  isProfileTextValid,
  PROFILE_NICKNAME_FORMAT_ERROR_MESSAGE,
} from '@/lib/validateProfileText';

import { MoverProfileTextArea } from './MoverProfileTextArea';
import { buildMoverProfileUpdateBody } from '../_lib/moverProfileUpdate';
import { normalizeCareerInput } from '../_lib/normalizeCareerInput';
import {
  CAREER_FORMAT_ERROR_MESSAGE,
  DESCRIPTION_FORMAT_ERROR_MESSAGE,
  getMoverProfileTextFieldState,
  SHORT_INTRO_FORMAT_ERROR_MESSAGE,
} from '../_lib/validateMoverProfileText';

import type {
  MoverProfileMe,
  MoverRegion,
  MoverServiceType,
} from '@/types/moverProfile';

interface MoverProfileEditFieldsProps {
  profile: MoverProfileMe;
}

/** profile이 있을 때만 마운트한다. key로 리마운트한다. */
const MoverProfileEditFields = ({ profile }: MoverProfileEditFieldsProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { showToast } = useToast();
  const { mutate: upsertProfile, isPending } = useUpsertMoverProfile({
    successMessage: t('profile.editSuccess'),
    errorFallbackMessage: t('profile.editError'),
  });
  const imageInputId = useId();
  const nicknameInputId = useId();
  const careerInputId = useId();
  const shortIntroInputId = useId();
  const descriptionInputId = useId();
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

  const [nickname, setNickname] = useState(profile.nickname);
  const [career, setCareer] = useState(
    profile.career !== null ? String(profile.career) : ''
  );
  const [shortIntro, setShortIntro] = useState(profile.shortDescription ?? '');
  const [description, setDescription] = useState(profile.description ?? '');
  const [selectedServices, setSelectedServices] = useState<MoverServiceType[]>([
    ...profile.service,
  ]);
  const [selectedRegions, setSelectedRegions] = useState<MoverRegion[]>([
    ...profile.serviceRegions,
  ]);

  const phoneNumber = profile.phoneNumber ?? '';
  const isNicknameFormatError = isProfileTextFormatError(nickname);
  const {
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
    isProfileTextValid(nickname) &&
    isCareerValid &&
    isShortIntroValid &&
    isDescriptionValid &&
    selectedServices.length > 0 &&
    selectedRegions.length > 0 &&
    !isPending;
  const submitLabel = isPending ? t('profile.editing') : t('profile.submitEdit');

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

  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
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

  /** 변경분만 제출한다. 변경이 없으면 토스트를 띄운다 */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmitEnabled) return;

    if (!isValidKrPhoneNumber(phoneNumber)) {
      showToast({
        content: t('profile.noPhone'),
      });
      return;
    }

    if (careerValue === null) return;

    const body = buildMoverProfileUpdateBody({
      profile,
      nickname,
      career: careerValue,
      shortDescription: shortIntro,
      description,
      selectedServices,
      selectedRegions,
      hasImageChange,
      s3Key: isImageCleared && !profileImageFile ? null : undefined,
    });

    if (!body) {
      showToast({ content: t('profile.noChanges') });
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
        <div className="flex w-full flex-col items-stretch gap-4 lg:gap-10">
          <header className="flex w-full flex-col items-start gap-4 lg:gap-10">
            <h1 className="text-2lg-bold text-black-400 lg:text-3xl-semibold">
              {t('nav.profile.edit')}
            </h1>
            <div className="h-px w-full bg-line-100" aria-hidden />
          </header>

          <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start lg:gap-x-10 lg:gap-y-8">
            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <RequiredLabel htmlFor={nicknameInputId}>
                {t('auth.nickname.label')}
              </RequiredLabel>
              <ProfileTextField
                id={nicknameInputId}
                name="nickname"
                autoComplete="nickname"
                placeholder={t('auth.nickname.placeholder')}
                value={nickname}
                onChange={handleNicknameChange}
                isError={isNicknameFormatError}
                errorMessage={
                  isNicknameFormatError
                    ? PROFILE_NICKNAME_FORMAT_ERROR_MESSAGE
                    : undefined
                }
              />
            </section>

            <div className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <div className="h-px w-full bg-line-100" aria-hidden />
              <ProfileImageField
                imageInputId={imageInputId}
                imageInputRef={imageInputRef}
                displayImageUrl={displayImageUrl}
                onImageChange={handleValidatedImageChange}
                onImageButtonClick={handleImageButtonClick}
                onImageClear={handleImageClear}
              />
            </div>

            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <div className="h-px w-full bg-line-100" aria-hidden />
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

            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <div className="h-px w-full bg-line-100" aria-hidden />
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

            <div className="flex w-full flex-col items-start gap-4 lg:col-start-2 lg:row-start-1">
              <div className="h-px w-full bg-line-100 lg:hidden" aria-hidden />
              <ProfileServiceField
                selectedServices={selectedServices}
              label={t('movers.providedServices')}
                onToggle={handleServiceToggle}
              />
            </div>

            <div className="flex w-full flex-col items-start gap-4 lg:col-start-2 lg:row-start-2">
              <div className="h-px w-full bg-line-100" aria-hidden />
              <ProfileRegionField
                selectedRegions={selectedRegions}
              label={t('movers.availableRegions')}
                onSelect={handleRegionToggle}
              />
            </div>

            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <div className="h-px w-full bg-line-100" aria-hidden />
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
            className="order-2 border-gray-200 text-gray-300 shadow-cta hover:border-gray-200 hover:bg-transparent hover:text-gray-300 hover:shadow-cta lg:order-1 lg:h-16 lg:max-w-[41.25rem] lg:text-xl-semibold"
          >
            {t('common.cancel')}
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

/** `/profile/mover/edit` 프로필 조회·로딩·에러 가드. 성공 시 수정 폼을 마운트한다. */
export const MoverProfileEditForm = () => {
  const { t } = useTranslation();
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
    return <Spinner message={t('profile.loading')} />;
  }

  if (isError) {
    const message =
      error instanceof ApiError
        ? error.message
        : t('profile.loadError');

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
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  if (profile === null) {
    redirect('/profile/mover');
  }

  return <MoverProfileEditFields key={profile.updatedAt} profile={profile} />;
};
