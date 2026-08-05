'use client';

import { useRouter } from 'next/navigation';
import {
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

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
import { cn } from '@/lib/utils';

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

const NICKNAME_MIN = 2;
const NICKNAME_MAX = 20;
const CAREER_MAX = 50;
const SHORT_DESCRIPTION_MAX = 10;
const DESCRIPTION_MIN = 8;

/** Figma Desktop·Tablet·Mobile 샘플 초기값 — UI 전용 */
const INITIAL_NICKNAME = '김코드';
const INITIAL_CAREER = '13';
const INITIAL_SHORT_INTRO = '안녕하세요';
const INITIAL_DESCRIPTION =
  '안녕하세요. 이사업계 경력 7년으로 안전한 이사를 도와드리는 김코드입니다. 고객님의 물품을 소중하고 안전하게 운송하여 드립니다. 소형이사 및 가정이사 서비스를 제공하며 서비스 가능 지역은 서울과 경기권입니다. 그 외 기타 지역';
const INITIAL_SERVICES: ServiceChipValue[] = ['SMALL'];
const INITIAL_REGIONS: RegionChipValue[] = ['SEOUL'];

const toDigits = (value: string): string => value.replace(/\D/g, '');

const toggleChip = <T extends string>(values: T[], value: T): T[] =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];

interface MoverProfileEditFormProps {
  className?: string;
}

/**
 * 기사님 프로필 수정 폼.
 * Figma: Mobile(1:11040)·Tablet(1:10785) → lg 미만, Desktop(1:10909) → lg+
 * UI만 구현 — 제출 시 API 호출 없음.
 */
export const MoverProfileEditForm = ({
  className,
}: MoverProfileEditFormProps) => {
  const router = useRouter();
  const imageInputId = useId();
  const nicknameInputId = useId();
  const careerInputId = useId();
  const shortIntroInputId = useId();
  const descriptionInputId = useId();

  const {
    imageInputRef,
    previewUrl,
    cropImageSrc,
    handleImageChange,
    handleImageButtonClick,
    handleCropClose,
    handleCropComplete,
  } = useProfileImageCrop();

  const [nickname, setNickname] = useState(INITIAL_NICKNAME);
  const [career, setCareer] = useState(INITIAL_CAREER);
  const [shortIntro, setShortIntro] = useState(INITIAL_SHORT_INTRO);
  const [description, setDescription] = useState(INITIAL_DESCRIPTION);
  const [selectedServices, setSelectedServices] =
    useState<ServiceChipValue[]>(INITIAL_SERVICES);
  const [selectedRegions, setSelectedRegions] =
    useState<RegionChipValue[]>(INITIAL_REGIONS);

  const careerValue = career === '' ? null : Number(career);
  const isNicknameValid =
    nickname.trim().length >= NICKNAME_MIN &&
    nickname.trim().length <= NICKNAME_MAX;
  const isCareerValid =
    careerValue !== null &&
    Number.isInteger(careerValue) &&
    careerValue >= 0 &&
    careerValue <= CAREER_MAX;
  const isShortIntroValid =
    shortIntro.trim().length > 0 &&
    shortIntro.trim().length <= SHORT_DESCRIPTION_MAX;
  const isDescriptionValid = description.trim().length >= DESCRIPTION_MIN;
  const isSubmitEnabled =
    isNicknameValid &&
    isCareerValid &&
    isShortIntroValid &&
    isDescriptionValid &&
    selectedServices.length > 0 &&
    selectedRegions.length > 0;

  const handleCancel = () => {
    router.back();
  };

  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value.slice(0, NICKNAME_MAX));
  };

  const handleCareerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = toDigits(event.target.value);
    if (digits === '') {
      setCareer('');
      return;
    }

    const nextValue = Number(digits);
    if (nextValue > CAREER_MAX) return;
    setCareer(String(nextValue));
  };

  const handleShortIntroChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShortIntro(event.target.value.slice(0, SHORT_DESCRIPTION_MAX));
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmitEnabled) return;
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
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
            — 별명→이미지→경력→한줄소개→서비스→지역→상세설명
            Desktop(1:10909): 2열 — 좌(별명~상세설명) / 우(서비스·지역)
          */}
          <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start lg:gap-x-10 lg:gap-y-8">
            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <label htmlFor={nicknameInputId} className={LABEL_CLASSNAME}>
                별명
              </label>
              <TextFieldOutlined
                id={nicknameInputId}
                size="sm"
                name="nickname"
                autoComplete="nickname"
                placeholder="별명을 입력해 주세요"
                value={nickname}
                onChange={handleNicknameChange}
                className={FIELD_CLASSNAME}
              />
            </section>

            <section className="flex w-full flex-col items-start gap-4 lg:col-start-1">
              <div className="h-px w-full bg-line-100" aria-hidden />
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
                maxLength={SHORT_DESCRIPTION_MAX}
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
            수정하기
          </Button>
          <Button
            type="button"
            variant="outlined"
            size="sm"
            onClick={handleCancel}
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
