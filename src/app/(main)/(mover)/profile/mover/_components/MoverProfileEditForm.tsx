'use client';

import { useQueryClient } from '@tanstack/react-query';
import { redirect, useRouter } from 'next/navigation';
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';

import { ProfileImageCropModal } from '@/app/(main)/(customer)/profile/customer/_components/ProfileImageCropModal';
import { ProfileImageField } from '@/app/(main)/(customer)/profile/customer/_components/ProfileImageField';
import { toggleService } from '@/app/(main)/(customer)/profile/customer/_lib/toggleService';
import { useProfileImageCrop } from '@/app/(main)/(customer)/profile/customer/_lib/useProfileImageCrop';
import { Button } from '@/components/Button/Button';
import { RegionChip, ServiceChip } from '@/components/ui/Chip';
import { TextArea, TextFieldOutlined } from '@/components/ui/Input';
import { RequiredLabel } from '@/components/ui/RequiredLabel/RequiredLabel';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import {
  REGION_CHIP_OPTIONS,
  SERVICE_CHIP_OPTIONS,
  type RegionChipValue,
  type ServiceChipValue,
} from '@/constants/commonOptions';
import { AUTH_QUERY_KEYS, moverProfileQueryKeys } from '@/constants/queryKey';
import { useMoverProfile } from '@/hooks/useMoverProfile';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { isValidKrPhoneNumber } from '@/lib/phoneNumber';
import {
  uploadProfileImage,
  validateProfileImageFile,
} from '@/lib/uploadProfileImage';
import { cn } from '@/lib/utils';
import { upsertMoverProfile } from '@/services/moverProfileApi';
import type { MoverProfileMe } from '@/types/moverProfile';

const FIELD_CLASSNAME =
  'w-full [&_>div]:min-h-[3.375rem] [&_>div]:w-full [&_>div]:max-w-full lg:[&_>div]:min-h-16 lg:[&_>div]:text-xl-regular';

const TEXTAREA_CLASSNAME =
  'w-full [&_>div]:min-h-40 [&_>div]:w-full [&_>div]:max-w-full [&_textarea]:lg:text-xl-regular';

const LABEL_CLASSNAME = 'text-lg-semibold text-black-300 lg:text-xl-semibold';

const CHIP_CLASSNAME =
  'px-3 py-1.5 text-md-medium lg:px-5 lg:py-2.5 lg:text-2lg-medium';

const DIVIDER_CLASS = 'h-px w-full bg-line-100';

const FORM_CLASS =
  'flex w-full max-w-[20.4375rem] flex-col items-stretch gap-8 bg-white lg:max-w-[87.5rem] lg:gap-16 lg:rounded-[2rem] lg:px-6 lg:pt-8 lg:pb-10';

const REGION_CHIP_WRAP_CLASS =
  'flex flex-wrap gap-x-2 gap-y-3 lg:gap-x-3.5 lg:gap-y-[1.125rem]';

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

const toDigits = (value: string): string => value.replace(/\D/g, '');

const areSortedEqual = (left: string[], right: string[]): boolean => {
  if (left.length !== right.length) return false;
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return sortedLeft.every((value, index) => value === sortedRight[index]);
};

interface MoverProfileEditFieldsProps {
  profile: MoverProfileMe;
}

/** profile이 있을 때만 마운트한다. key로 리마운트한다. */
const MoverProfileEditFields = ({ profile }: MoverProfileEditFieldsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
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
  const [selectedServices, setSelectedServices] = useState<ServiceChipValue[]>([
    ...profile.service,
  ]);
  const [selectedRegions, setSelectedRegions] = useState<RegionChipValue[]>([
    ...profile.serviceRegions,
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    !isSubmitting;

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

    if (!isValidKrPhoneNumber(phoneNumber)) {
      showToast({
        content: '등록된 전화번호가 없습니다. 기본정보를 먼저 수정해 주세요.',
      });
      return;
    }

    const hasFieldChange =
      trimmedNickname !== profile.nickname ||
      careerValue !== profile.career ||
      trimmedShortIntro !== (profile.shortDescription ?? '') ||
      trimmedDescription !== (profile.description ?? '') ||
      !areSortedEqual(selectedServices, profile.service) ||
      !areSortedEqual(selectedRegions, profile.serviceRegions) ||
      hasImageChange;

    if (!hasFieldChange) {
      showToast({ content: '변경된 내용이 없습니다.' });
      return;
    }

    if (careerValue === null) return;

    setIsSubmitting(true);

    try {
      let s3Key: string | null | undefined;

      if (profileImageFile) {
        s3Key = await uploadProfileImage(profileImageFile);
      } else if (isImageCleared) {
        s3Key = null;
      }

      await upsertMoverProfile({
        nickname: trimmedNickname,
        career: careerValue,
        shortDescription: trimmedShortIntro,
        description: trimmedDescription,
        service: selectedServices,
        serviceRegions: selectedRegions,
        ...(s3Key !== undefined ? { s3Key } : {}),
      });

      await queryClient.invalidateQueries({
        queryKey: moverProfileQueryKeys.all,
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
        className={FORM_CLASS}
      >
        <div className="flex w-full flex-col items-stretch gap-4 lg:gap-10">
          <header className="flex w-full flex-col items-start gap-4 lg:gap-10">
            <h1 className="text-2lg-bold text-black-400 lg:text-3xl-semibold">
              프로필 수정
            </h1>
            <div className={DIVIDER_CLASS} aria-hidden />
          </header>

          {/* Desktop 2열: 좌 필드 / 우 서비스·지역 */}
          <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start lg:gap-x-10 lg:gap-y-8">
            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <RequiredLabel htmlFor={nicknameInputId}>닉네임</RequiredLabel>
              <TextFieldOutlined
                id={nicknameInputId}
                size="sm"
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
                className={FIELD_CLASSNAME}
              />
            </section>

            <div className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <div className={DIVIDER_CLASS} aria-hidden />
              <ProfileImageField
                imageInputId={imageInputId}
                imageInputRef={imageInputRef}
                displayImageUrl={displayImageUrl}
                labelClassName={LABEL_CLASSNAME}
                onImageChange={handleValidatedImageChange}
                onImageButtonClick={handleImageButtonClick}
                onImageClear={handleImageClear}
              />
            </div>

            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <div className={DIVIDER_CLASS} aria-hidden />
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

            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <div className={DIVIDER_CLASS} aria-hidden />
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

            <section className="flex w-full flex-col items-start gap-4 lg:col-start-2 lg:row-start-1">
              <div className={cn(DIVIDER_CLASS, 'lg:hidden')} aria-hidden />
              <RequiredLabel>제공 서비스</RequiredLabel>
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

            <section className="flex w-full flex-col items-start gap-4 lg:col-start-2 lg:row-start-2">
              <div className={DIVIDER_CLASS} aria-hidden />
              <RequiredLabel>서비스 가능 지역</RequiredLabel>
              <div className={REGION_CHIP_WRAP_CLASS}>
                {REGION_CHIP_OPTIONS.map((option) => (
                  <RegionChip
                    key={option.value}
                    variant="button"
                    isSelected={selectedRegions.includes(option.value)}
                    onClick={() =>
                      setSelectedRegions((prev) =>
                        toggleService(prev, option.value)
                      )
                    }
                    className={CHIP_CLASSNAME}
                  >
                    {option.label}
                  </RegionChip>
                ))}
              </div>
            </section>

            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <div className={DIVIDER_CLASS} aria-hidden />
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
            disabled={isSubmitting}
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

export const MoverProfileEditForm = () => {
  const {
    data: profile,
    isPending,
    isError,
    error,
    refetch,
  } = useMoverProfile();

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
    redirect('/profile/mover');
  }

  return <MoverProfileEditFields key={profile.updatedAt} profile={profile} />;
};
