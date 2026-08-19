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
import { ApiError } from '@/lib/apiClient';
import { isValidKrPhoneNumber } from '@/lib/phoneNumber';
import { validateProfileImageFile } from '@/lib/uploadProfileImage';

import { MoverProfileTextArea } from './MoverProfileTextArea';
import { buildMoverProfileUpdateBody } from '../_lib/moverProfileUpdate';
import { normalizeCareerInput } from '../_lib/normalizeCareerInput';
import { toggleService } from '../_lib/toggleService';

import type {
  MoverProfileMe,
  MoverRegion,
  MoverServiceType,
} from '@/types/moverProfile';

const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 20;
const CAREER_MAX = 50;
const SHORT_DESCRIPTION_MAX = 20;
const DESCRIPTION_MIN = 8;
const DESCRIPTION_MAX = 200;

const NICKNAME_FORMAT_ERROR_MESSAGE = `닉네임은 ${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}자로 입력해 주세요.`;
const CAREER_FORMAT_ERROR_MESSAGE = `경력은 0~${CAREER_MAX} 사이의 값으로 입력해 주세요.`;
const SHORT_INTRO_FORMAT_ERROR_MESSAGE = `한 줄 소개는 1~${SHORT_DESCRIPTION_MAX}자로 입력해 주세요.`;
const DESCRIPTION_FORMAT_ERROR_MESSAGE = `상세 설명은 ${DESCRIPTION_MIN}~${DESCRIPTION_MAX}자로 입력해 주세요.`;

interface MoverProfileEditFieldsProps {
  profile: MoverProfileMe;
}

/** profile이 있을 때만 마운트한다. key로 리마운트한다. */
const MoverProfileEditFields = ({ profile }: MoverProfileEditFieldsProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const { mutate: upsertProfile, isPending } = useUpsertMoverProfile({
    successMessage: '프로필이 수정되었습니다.',
    errorFallbackMessage:
      '프로필 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.',
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
  const trimmedNickname = nickname.trim();
  const trimmedShortIntro = shortIntro.trim();
  const trimmedDescription = description.trim();
  const careerValue = career === '' ? null : Number(career);
  const isCareerValid =
    careerValue !== null &&
    Number.isInteger(careerValue) &&
    careerValue >= 0 &&
    careerValue <= CAREER_MAX;
  const isNicknameFormatError =
    trimmedNickname.length > 0 &&
    (trimmedNickname.length < NICKNAME_MIN_LENGTH ||
      trimmedNickname.length > NICKNAME_MAX_LENGTH);
  const isCareerFormatError = career !== '' && !isCareerValid;
  const isShortIntroFormatError =
    trimmedShortIntro.length > SHORT_DESCRIPTION_MAX;
  const isDescriptionFormatError =
    trimmedDescription.length > 0 &&
    (trimmedDescription.length < DESCRIPTION_MIN ||
      trimmedDescription.length > DESCRIPTION_MAX);
  const isSubmitEnabled =
    trimmedNickname.length >= NICKNAME_MIN_LENGTH &&
    trimmedNickname.length <= NICKNAME_MAX_LENGTH &&
    isCareerValid &&
    trimmedShortIntro.length > 0 &&
    trimmedShortIntro.length <= SHORT_DESCRIPTION_MAX &&
    trimmedDescription.length >= DESCRIPTION_MIN &&
    trimmedDescription.length <= DESCRIPTION_MAX &&
    selectedServices.length > 0 &&
    selectedRegions.length > 0 &&
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
        content: '등록된 전화번호가 없습니다. 기본정보를 먼저 수정해 주세요.',
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
        <div className="flex w-full flex-col items-stretch gap-4 lg:gap-10">
          <header className="flex w-full flex-col items-start gap-4 lg:gap-10">
            <h1 className="text-2lg-bold text-black-400 lg:text-3xl-semibold">
              프로필 수정
            </h1>
            <div className="h-px w-full bg-line-100" aria-hidden />
          </header>

          <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start lg:gap-x-10 lg:gap-y-8">
            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <RequiredLabel htmlFor={nicknameInputId}>닉네임</RequiredLabel>
              <ProfileTextField
                id={nicknameInputId}
                name="nickname"
                autoComplete="nickname"
                placeholder="닉네임을 입력해 주세요"
                value={nickname}
                onChange={handleNicknameChange}
                isError={isNicknameFormatError}
                errorMessage={
                  isNicknameFormatError
                    ? NICKNAME_FORMAT_ERROR_MESSAGE
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
              <RequiredLabel htmlFor={careerInputId}>경력</RequiredLabel>
              <ProfileTextField
                id={careerInputId}
                name="career"
                inputMode="numeric"
                placeholder="기사님의 경력을 입력해 주세요"
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
                한 줄 소개
              </RequiredLabel>
              <ProfileTextField
                id={shortIntroInputId}
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
              />
            </section>

            <div className="flex w-full flex-col items-start gap-4 lg:col-start-2 lg:row-start-1">
              <div className="h-px w-full bg-line-100 lg:hidden" aria-hidden />
              <ProfileServiceField
                selectedServices={selectedServices}
                label="제공 서비스"
                onToggle={handleServiceToggle}
              />
            </div>

            <div className="flex w-full flex-col items-start gap-4 lg:col-start-2 lg:row-start-2">
              <div className="h-px w-full bg-line-100" aria-hidden />
              <ProfileRegionField
                selectedRegions={selectedRegions}
                label="서비스 가능 지역"
                onSelect={handleRegionToggle}
              />
            </div>

            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <div className="h-px w-full bg-line-100" aria-hidden />
              <RequiredLabel htmlFor={descriptionInputId}>
                상세 설명
              </RequiredLabel>
              <MoverProfileTextArea
                id={descriptionInputId}
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

/** `/profile/mover/edit` 프로필 조회·로딩·에러 가드. 성공 시 수정 폼을 마운트한다. */
export const MoverProfileEditForm = () => {
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
    redirect('/profile/mover');
  }

  return <MoverProfileEditFields key={profile.updatedAt} profile={profile} />;
};
