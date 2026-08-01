'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import NoImageIcon from '@/assets/icons/no-image.svg';
import { Button } from '@/components/Button/Button';
import { RegionChip, ServiceChip } from '@/components/ui/Chip';
import {
  REGION_CHIP_OPTIONS,
  SERVICE_CHIP_OPTIONS,
} from '@/constants/chipOptions';
import { cn } from '@/lib/utils';

const toggleValue = (values: string[], value: string): string[] =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];

/**
 * 일반유저 프로필 등록 폼 (UI only).
 * Figma: 프로필 등록_일반유저/Desktop (1:9898)
 */
export const CustomerProfileForm = () => {
  const imageInputId = useId();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const isSubmitEnabled =
    selectedServices.length > 0 && selectedRegion !== null;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[40rem] flex-col items-center gap-14"
    >
      <div className="flex w-full flex-col items-center gap-16">
        <header className="flex w-full flex-col items-start gap-8">
          <h1 className="text-3xl-semibold text-black-400">프로필 등록</h1>
          <p className="text-xl-regular text-black-200">
            추가 정보를 입력하여 회원가입을 완료해주세요.
          </p>
          <div className="h-px w-full bg-line-100" aria-hidden />
        </header>

        <div className="flex w-full flex-col items-start gap-8">
          <section className="flex flex-col items-start gap-6">
            <h2 className="text-xl-semibold text-black-300">프로필 이미지</h2>
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
                'flex size-40 items-center justify-center overflow-hidden rounded-md bg-background-200',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300'
              )}
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- 로컬 미리보기 blob URL
                <img
                  src={previewUrl}
                  alt="선택한 프로필 이미지 미리보기"
                  className="size-full object-cover"
                />
              ) : (
                <NoImageIcon className="size-10 text-gray-300" aria-hidden />
              )}
            </button>
          </section>

          <div className="h-px w-full bg-line-100" aria-hidden />

          <section className="flex w-full flex-col items-start gap-8">
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-xl-semibold text-black-300">이용 서비스</h2>
              <p className="text-lg-regular text-gray-400">
                *이용 서비스는 중복 선택 가능하며, 언제든 수정 가능해요!
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {SERVICE_CHIP_OPTIONS.map((option) => (
                <ServiceChip
                  key={option.value}
                  variant="button"
                  isSelected={selectedServices.includes(option.value)}
                  onClick={() =>
                    setSelectedServices((prev) =>
                      toggleValue(prev, option.value)
                    )
                  }
                >
                  {option.label}
                </ServiceChip>
              ))}
            </div>
          </section>

          <div className="h-px w-full bg-line-100" aria-hidden />

          <section className="flex w-full flex-col items-start gap-8">
            <div className="flex w-full flex-col items-start gap-2">
              <h2 className="text-xl-semibold text-black-300">
                내가 사는 지역
              </h2>
              <p className="text-lg-regular text-gray-400">
                *내가 사는 지역은 언제든 수정 가능해요!
              </p>
            </div>
            <div className="flex flex-wrap gap-x-3.5 gap-y-[1.125rem]">
              {REGION_CHIP_OPTIONS.map((option) => (
                <RegionChip
                  key={option.value}
                  variant="button"
                  isSelected={selectedRegion === option.value}
                  onClick={() =>
                    setSelectedRegion((prev) =>
                      prev === option.value ? null : option.value
                    )
                  }
                >
                  {option.label}
                </RegionChip>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="w-full">
        <Button
          type="submit"
          variant="solid"
          size="md"
          disabled={!isSubmitEnabled}
        >
          시작하기
        </Button>
      </div>
    </form>
  );
};
