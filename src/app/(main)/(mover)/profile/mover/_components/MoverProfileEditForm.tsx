'use client';

import { redirect, useRouter } from 'next/navigation';
import {
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { ProfileImageCropModal } from '@/app/(main)/(customer)/profile/customer/_components/ProfileImageCropModal';
import { ProfileImageField } from '@/app/(main)/(customer)/profile/customer/_components/ProfileImageField';
import { useProfileImageCrop } from '@/app/(main)/(customer)/profile/customer/_lib/useProfileImageCrop';
import { Button } from '@/components/Button/Button';
import { RegionChip, ServiceChip } from '@/components/ui/Chip';
import { TextArea, TextFieldOutlined } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import {
  REGION_CHIP_OPTIONS,
  SERVICE_CHIP_OPTIONS,
  type RegionChipValue,
  type ServiceChipValue,
} from '@/constants/commonOptions';
import { useAuth } from '@/hooks/useAuth';
import {
  moverProfileQueryKeys,
  useMoverProfile,
} from '@/hooks/useMoverProfile';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { getAuthSession } from '@/lib/authSession';
import { uploadProfileImage } from '@/lib/uploadProfileImage';
import { cn } from '@/lib/utils';
import { upsertMoverProfile } from '@/services/moverProfileApi';
import type { MoverProfileMe } from '@/types/moverProfile';

/** Figma Mobile·Tablet: input sm / Desktop(lg+): md 높이·텍스트 */
const FIELD_CLASSNAME =
  'w-full [&_>div]:min-h-[3.375rem] [&_>div]:w-full [&_>div]:max-w-full lg:[&_>div]:min-h-16 [&_input]:lg:text-xl-regular';

const TEXTAREA_CLASSNAME =
  'w-full [&_>div]:min-h-40 [&_>div]:w-full [&_>div]:max-w-full [&_textarea]:lg:text-xl-regular';

/** Figma Mobile·Tablet: lg-semibold / Desktop(lg+): xl-semibold */
const LABEL_CLASSNAME = 'text-lg-semibold text-black-300 lg:text-xl-semibold';

/** Figma Mobile·Tablet chip sm / Desktop: md */
const CHIP_CLASSNAME =
  'px-3 py-1.5 text-md-medium lg:px-5 lg:py-2.5 lg:text-2lg-medium';

const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 20;
const PHONE_NUMBER_LENGTH = 11;
const CAREER_MAX = 50;
const SHORT_DESCRIPTION_MAX = 20;
const DESCRIPTION_MIN = 8;

const toDigits = (value: string): string => value.replace(/\D/g, '');

const toggleChip = <T extends string>(values: T[], value: T): T[] =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];

interface MoverProfileEditFieldsProps {
  profile: MoverProfileMe;
  className?: string;
}

/** 쿼리 데이터로 초기화된 수정 폼. 마운트 시점에 profile이 이미 존재한다. */
const MoverProfileEditFields = ({
  profile,
  className,
}: MoverProfileEditFieldsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setSession } = useAuth();
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
  const [isPending, setIsPending] = useState(false);

  const phoneNumber = toDigits(profile.phoneNumber ?? '');
  const careerValue = career === '' ? null : Number(career);
  const isSubmitEnabled =
    nickname.trim().length > 0 &&
    career !== '' &&
    shortIntro.trim().length > 0 &&
    description.trim().length > 0 &&
    selectedServices.length > 0 &&
    selectedRegions.length > 0 &&
    !isPending;

  const handleCancel = () => {
    router.back();
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
    if (isPending) return;

    const trimmedNickname = nickname.trim();
    if (
      trimmedNickname.length < NICKNAME_MIN_LENGTH ||
      trimmedNickname.length > NICKNAME_MAX_LENGTH
    ) {
      showToast({
        content: `닉네임은 ${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}자로 입력해 주세요.`,
      });
      return;
    }

    const isCareerValid =
      careerValue !== null &&
      Number.isInteger(careerValue) &&
      careerValue >= 0 &&
      careerValue <= CAREER_MAX;
    if (!isCareerValid || careerValue === null) {
      showToast({
        content: `경력은 0~${CAREER_MAX}년으로 입력해 주세요.`,
      });
      return;
    }

    const trimmedShortIntro = shortIntro.trim();
    if (
      trimmedShortIntro.length === 0 ||
      trimmedShortIntro.length > SHORT_DESCRIPTION_MAX
    ) {
      showToast({
        content: `한 줄 소개는 1~${SHORT_DESCRIPTION_MAX}자로 입력해 주세요.`,
      });
      return;
    }

    const trimmedDescription = description.trim();
    if (trimmedDescription.length < DESCRIPTION_MIN) {
      showToast({
        content: `상세 설명은 ${DESCRIPTION_MIN}자 이상 입력해 주세요.`,
      });
      return;
    }

    if (selectedServices.length === 0) {
      showToast({ content: '제공 서비스를 선택해 주세요.' });
      return;
    }

    if (selectedRegions.length === 0) {
      showToast({ content: '서비스 가능 지역을 선택해 주세요.' });
      return;
    }

    if (phoneNumber.length !== PHONE_NUMBER_LENGTH) {
      showToast({
        content: '등록된 전화번호가 없습니다. 기본정보를 먼저 수정해 주세요.',
      });
      return;
    }

    setIsPending(true);

    try {
      let s3Key: string | null | undefined;

      if (profileImageFile) {
        s3Key = await uploadProfileImage(profileImageFile);
      } else if (isImageCleared) {
        s3Key = null;
      }

      const response = await upsertMoverProfile({
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

      const session = getAuthSession();
      if (session) {
        setSession({
          ...session,
          user: {
            ...session.user,
            nickname: response.data.nickname,
          },
        });
      }

      showToast({ content: '프로필이 수정되었습니다.' });
      router.back();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '프로필 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.';
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
          'flex w-full max-w-[20.4375rem] flex-col items-stretch gap-8 bg-white lg:max-w-[87.5rem] lg:gap-16 lg:rounded-[2rem] lg:px-6 lg:pt-8 lg:pb-10',
          className
        )}
      >
        <div className="flex w-full flex-col items-stretch gap-4 lg:gap-10">
          <header className="flex w-full flex-col items-start gap-4 lg:gap-10">
            <h1 className="text-2lg-bold text-black-400 lg:text-3xl-semibold">
              프로필 수정
            </h1>
            <div className="h-px w-full bg-line-100" aria-hidden />
          </header>

          {/*
            Mobile(1:11040)·Tablet(1:10785): 단일 컬럼
            — 닉네임→이미지→경력→한줄소개→서비스→지역→상세설명
            Desktop(1:10909): 2열 — 좌(닉네임~상세설명) / 우(서비스·지역)
          */}
          <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start lg:gap-x-10 lg:gap-y-8">
            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <label htmlFor={nicknameInputId} className={LABEL_CLASSNAME}>
                닉네임
              </label>
              <TextFieldOutlined
                id={nicknameInputId}
                size="sm"
                name="nickname"
                autoComplete="nickname"
                placeholder="닉네임을 입력해 주세요"
                value={nickname}
                onChange={handleNicknameChange}
                className={FIELD_CLASSNAME}
              />
            </section>

            <div className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <div className="h-px w-full bg-line-100" aria-hidden />
              <ProfileImageField
                imageInputId={imageInputId}
                imageInputRef={imageInputRef}
                displayImageUrl={displayImageUrl}
                labelClassName={LABEL_CLASSNAME}
                onImageChange={handleImageChange}
                onImageButtonClick={handleImageButtonClick}
                onImageClear={handleImageClear}
              />
            </div>

            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <div className="h-px w-full bg-line-100" aria-hidden />
              <label htmlFor={careerInputId} className={LABEL_CLASSNAME}>
                경력
              </label>
              <TextFieldOutlined
                id={careerInputId}
                size="sm"
                name="career"
                inputMode="numeric"
                placeholder="기사님의 경력을 입력해 주세요"
                value={career}
                onChange={handleCareerChange}
                className={FIELD_CLASSNAME}
              />
            </section>

            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <div className="h-px w-full bg-line-100" aria-hidden />
              <label htmlFor={shortIntroInputId} className={LABEL_CLASSNAME}>
                한 줄 소개
              </label>
              <TextFieldOutlined
                id={shortIntroInputId}
                size="sm"
                name="shortIntro"
                placeholder="한 줄 소개를 입력해 주세요"
                value={shortIntro}
                onChange={handleShortIntroChange}
                className={FIELD_CLASSNAME}
              />
            </section>

            <section className="flex w-full flex-col items-start gap-4 lg:col-start-2 lg:row-start-1">
              <div className="h-px w-full bg-line-100 lg:hidden" aria-hidden />
              <h2 className={LABEL_CLASSNAME}>제공 서비스</h2>
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

            <section className="flex w-full flex-col items-start gap-4 lg:col-start-2 lg:row-start-2">
              <div className="h-px w-full bg-line-100" aria-hidden />
              <h2 className={LABEL_CLASSNAME}>서비스 가능 지역</h2>
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

            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <div className="h-px w-full bg-line-100" aria-hidden />
              <label htmlFor={descriptionInputId} className={LABEL_CLASSNAME}>
                상세 설명
              </label>
              <TextArea
                id={descriptionInputId}
                size="sm"
                name="description"
                placeholder="상세 내용을 입력해 주세요"
                value={description}
                onChange={handleDescriptionChange}
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
            {isPending ? '수정 중...' : '수정하기'}
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

interface MoverProfileEditFormProps {
  className?: string;
}

/** 기사님 프로필 수정. useMoverProfile로 조회 후 폼에 전달 */
export const MoverProfileEditForm = ({
  className,
}: MoverProfileEditFormProps) => {
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

  return (
    <MoverProfileEditFields
      key={profile.updatedAt}
      profile={profile}
      className={className}
    />
  );
};
