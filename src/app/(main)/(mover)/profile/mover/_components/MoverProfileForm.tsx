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
import {
  composeKrMobilePhone,
  formatKrMobileSubscriberInput,
  getKrMobileSubscriberError,
  KR_MOBILE_SUBSCRIBER_LENGTH,
  toKrMobileSubscriberDigits,
  toPhoneDigits,
} from '@/lib/phoneNumber';
import { toggleService } from '@/lib/toggleService';
import { validateProfileImageFile } from '@/lib/uploadProfileImage';

import { MoverProfileTextArea } from './MoverProfileTextArea';
import { normalizeCareerInput } from '../_lib/normalizeCareerInput';

import type { MoverRegion, MoverServiceType } from '@/types/moverProfile';

const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 20;
const CAREER_MAX = 50;
const SHORT_DESCRIPTION_MAX = 20;
const DESCRIPTION_MIN = 8;
const DESCRIPTION_MAX = 200;

const CAREER_FORMAT_ERROR_MESSAGE = `경력은 0~${CAREER_MAX} 사이의 값으로 입력해 주세요.`;
const SHORT_INTRO_FORMAT_ERROR_MESSAGE = `한 줄 소개는 1~${SHORT_DESCRIPTION_MAX}자로 입력해 주세요.`;
const DESCRIPTION_FORMAT_ERROR_MESSAGE = `상세 설명은 ${DESCRIPTION_MIN}~${DESCRIPTION_MAX}자로 입력해 주세요.`;

/** `/profile/mover` 기사님 프로필 등록 폼 */
export const MoverProfileForm = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { mutate: createProfile, isPending } = useCreateMoverProfile({
    successMessage: '프로필 등록이 완료되었습니다.',
    errorFallbackMessage:
      '프로필 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.',
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
      NICKNAME_MAX_LENGTH
    );
    if (nickname.length < NICKNAME_MIN_LENGTH) {
      showToast({
        content: '로그인 정보가 올바르지 않습니다. 다시 로그인해 주세요.',
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

            <div className="h-px w-full bg-line-100" aria-hidden />

            <section className="flex w-full flex-col items-start gap-4">
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
          </div>

          <div className="h-px w-full bg-line-100 lg:hidden" aria-hidden />

          <div className="flex w-full flex-col items-start gap-5 lg:max-w-[40rem] lg:gap-8">
            <section className="flex w-full flex-col items-start gap-4">
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

            <div className="h-px w-full bg-line-100" aria-hidden />

            <ProfileServiceField
              selectedServices={selectedServices}
              label="제공 서비스"
              onToggle={handleServiceToggle}
            />

            <div className="h-px w-full bg-line-100" aria-hidden />

            <ProfileRegionField
              selectedRegions={selectedRegions}
              label="서비스 가능 지역"
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
