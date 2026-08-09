'use client';

import { useRouter } from 'next/navigation';
import {
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { ProfileImageCropModal } from '@/app/(main)/(customer)/profile/customer/_components/ProfileImageCropModal';
import { useProfileImageCrop } from '@/app/(main)/(customer)/profile/customer/_lib/useProfileImageCrop';
import NoImageIcon from '@/assets/icons/no-image.svg';
import { Button } from '@/components/Button/Button';
import { RegionChip, ServiceChip } from '@/components/ui/Chip';
import { TextArea, TextFieldOutlined } from '@/components/ui/Input';
import {
  REGION_CHIP_OPTIONS,
  SERVICE_CHIP_OPTIONS,
  type RegionChipValue,
  type ServiceChipValue,
} from '@/constants/commonOptions';
import { useAuth } from '@/hooks/useAuth';
import { moverProfileQueryKeys } from '@/hooks/useMoverProfile';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { getAuthSession } from '@/lib/authSession';
import { uploadProfileImage } from '@/lib/uploadProfileImage';
import { cn } from '@/lib/utils';
import { upsertMoverProfile } from '@/services/moverProfileApi';

const FIELD_CLASSNAME =
  'w-full [&_>div]:min-h-[3.375rem] [&_>div]:w-full [&_>div]:max-w-full lg:[&_>div]:min-h-16 [&_input]:lg:text-xl-regular';

const TEXTAREA_CLASSNAME =
  'w-full [&_>div]:min-h-40 [&_>div]:w-full [&_>div]:max-w-full [&_textarea]:lg:text-xl-regular';

/** Figma Mobile·Tablet: lg-semibold / Desktop(lg+): xl-semibold */
const LABEL_CLASSNAME = 'text-lg-semibold text-black-300 lg:text-xl-semibold';

/** Figma Mobile·Tablet chip sm / Desktop: md */
const CHIP_CLASSNAME =
  'px-3 py-1.5 text-md-medium lg:px-5 lg:py-2.5 lg:text-2lg-medium';

const PHONE_NUMBER_LENGTH = 11;
const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 20;
const CAREER_MAX = 50;
const SHORT_DESCRIPTION_MAX = 20;
const DESCRIPTION_MIN = 8;

const toDigits = (value: string): string => value.replace(/\D/g, '');

const toggleChip = <T extends string>(values: T[], value: T): T[] =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];

interface RequiredLabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

const RequiredLabel = ({
  htmlFor,
  children,
  className,
}: RequiredLabelProps) => {
  const content = (
    <>
      <span>{children}</span>
      <span className="text-blue-300" aria-hidden>
        *
      </span>
    </>
  );

  if (htmlFor) {
    return (
      <label
        htmlFor={htmlFor}
        className={cn(LABEL_CLASSNAME, 'flex items-center gap-1', className)}
      >
        {content}
      </label>
    );
  }

  return (
    <h2
      className={cn(LABEL_CLASSNAME, 'flex items-center gap-1', className)}
    >
      {content}
    </h2>
  );
};

interface MoverProfileFormProps {
  className?: string;
}

export const MoverProfileForm = ({ className }: MoverProfileFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setSession } = useAuth();
  const { showToast } = useToast();
  const imageInputId = useId();
  const phoneInputId = useId();
  const careerInputId = useId();
  const shortIntroInputId = useId();
  const descriptionInputId = useId();

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

  const [phoneDraft, setPhoneDraft] = useState<string | null>(null);
  const [career, setCareer] = useState('');
  const [shortIntro, setShortIntro] = useState('');
  const [description, setDescription] = useState('');
  const [selectedServices, setSelectedServices] = useState<ServiceChipValue[]>(
    []
  );
  const [selectedRegions, setSelectedRegions] = useState<RegionChipValue[]>([]);
  const [isPending, setIsPending] = useState(false);

  const phoneNumber = phoneDraft ?? toDigits(user?.phoneNumber ?? '');
  const careerValue = career === '' ? null : Number(career);
  const isSubmitEnabled =
    phoneNumber.length > 0 &&
    career !== '' &&
    shortIntro.trim().length > 0 &&
    description.trim().length > 0 &&
    selectedServices.length > 0 &&
    selectedRegions.length > 0 &&
    !isPending;

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneDraft(toDigits(event.target.value).slice(0, PHONE_NUMBER_LENGTH));
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

    if (phoneNumber.length !== PHONE_NUMBER_LENGTH) {
      showToast({
        content: `전화번호는 ${PHONE_NUMBER_LENGTH}자리로 입력해 주세요.`,
      });
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

    setIsPending(true);

    try {
      let s3Key: string | undefined;

      if (profileImageFile) {
        s3Key = await uploadProfileImage(profileImageFile);
      }

      await upsertMoverProfile({
        nickname,
        phoneNumber,
        career: careerValue,
        shortDescription: trimmedShortIntro,
        description: trimmedDescription,
        service: selectedServices,
        serviceRegions: selectedRegions,
        ...(s3Key ? { s3Key } : {}),
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
            phoneNumber,
            isProfileCompleted: true,
          },
        });
      }

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
            <section className="flex flex-col items-start gap-4">
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

            <section className="flex w-full flex-col items-start gap-4">
              <RequiredLabel htmlFor={phoneInputId}>전화번호</RequiredLabel>
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
