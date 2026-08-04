'use client';

import {
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
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

const toDigits = (value: string): string => value.replace(/\D/g, '');

const toggleChip = <T extends string>(values: T[], value: T): T[] =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];

interface RequiredLabelProps {
  htmlFor?: string;
  children: ReactNode;
}

const RequiredLabel = ({ htmlFor, children }: RequiredLabelProps) => {
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
        className={cn(LABEL_CLASSNAME, 'flex items-center gap-1')}
      >
        {content}
      </label>
    );
  }

  return (
    <h2 className={cn(LABEL_CLASSNAME, 'flex items-center gap-1')}>
      {content}
    </h2>
  );
};

export const MoverProfileForm = () => {
  const imageInputId = useId();
  const phoneInputId = useId();
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

  const [phoneNumber, setPhoneNumber] = useState('');
  const [career, setCareer] = useState('');
  const [shortIntro, setShortIntro] = useState('');
  const [description, setDescription] = useState('');
  const [selectedServices, setSelectedServices] = useState<ServiceChipValue[]>(
    []
  );
  const [selectedRegions, setSelectedRegions] = useState<RegionChipValue[]>([]);

  const isPhoneValid = phoneNumber.length === PHONE_NUMBER_LENGTH;
  const isSubmitEnabled =
    isPhoneValid &&
    career.trim().length > 0 &&
    shortIntro.trim().length > 0 &&
    description.trim().length > 0 &&
    selectedServices.length > 0 &&
    selectedRegions.length > 0;

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(toDigits(event.target.value).slice(0, PHONE_NUMBER_LENGTH));
  };

  const handleCareerChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCareer(event.target.value);
  };

  const handleShortIntroChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShortIntro(event.target.value);
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
            시작하기
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
