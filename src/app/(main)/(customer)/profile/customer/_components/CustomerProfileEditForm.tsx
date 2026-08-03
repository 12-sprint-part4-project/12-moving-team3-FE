'use client';

import { useRouter } from 'next/navigation';
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
import { TextFieldOutlined } from '@/components/ui/Input';
import {
  REGION_CHIP_OPTIONS,
  SERVICE_CHIP_OPTIONS,
  type RegionChipValue,
  type ServiceChipValue,
} from '@/constants/chipOptions';
import { cn } from '@/lib/utils';

import { ProfileImageCropModal } from './ProfileImageCropModal';

const FIELD_CLASSNAME =
  'w-full [&_>div]:min-h-16 [&_>div]:w-full [&_>div]:max-w-full [&_input]:text-xl-regular';

const READONLY_FIELD_CLASSNAME = `${FIELD_CLASSNAME} [&_input]:!text-gray-300`;

const LABEL_CLASSNAME = 'text-xl-semibold text-black-300';

const CHIP_CLASSNAME = 'px-5 py-2.5 text-2lg-medium';

const HELPER_CLASSNAME = 'text-lg-regular text-gray-400';

const toggleService = (
  values: ServiceChipValue[],
  value: ServiceChipValue
): ServiceChipValue[] =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];

/** 고객 프로필 수정 폼 (UI only). Figma 내 프로필/Desktop */
export const CustomerProfileEditForm = () => {
  const router = useRouter();
  const imageInputId = useId();
  const nameInputId = useId();
  const nicknameInputId = useId();
  const emailInputId = useId();
  const phoneInputId = useId();
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [name, setName] = useState('김코드');
  const [nickname, setNickname] = useState('김가나');
  const [email] = useState('codeit@email.com');
  const [phoneNumber, setPhoneNumber] = useState('010-1234-5678');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedServices, setSelectedServices] = useState<ServiceChipValue[]>([
    'SMALL',
  ]);
  const [selectedRegion, setSelectedRegion] = useState<RegionChipValue | null>(
    'SEOUL'
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (cropImageSrc) URL.revokeObjectURL(cropImageSrc);
    };
  }, [cropImageSrc]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setCropImageSrc(URL.createObjectURL(file));
  };

  const handleCropClose = () => {
    setCropImageSrc(null);
  };

  const handleCropComplete = (blob: Blob) => {
    setPreviewUrl(URL.createObjectURL(blob));
    setCropImageSrc(null);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[87.5rem] flex-col items-stretch gap-10 rounded-[2rem] bg-white px-6 pt-8 pb-10 lg:gap-16"
      >
        <div className="flex w-full flex-col items-stretch gap-10">
          <header className="flex w-full flex-col items-start gap-10">
            <h1 className="text-3xl-semibold text-black-400">프로필 수정</h1>
            <div className="h-px w-full bg-line-100" aria-hidden />
          </header>

          <div className="flex w-full flex-col items-stretch gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex w-full flex-col items-start gap-8 lg:max-w-[40rem]">
              <section className="flex w-full flex-col items-start gap-4">
                <label htmlFor={nameInputId} className={LABEL_CLASSNAME}>
                  이름
                </label>
                <TextFieldOutlined
                  id={nameInputId}
                  size="md"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={FIELD_CLASSNAME}
                />
              </section>

              <div className="h-px w-full bg-line-100" aria-hidden />

              <section className="flex w-full flex-col items-start gap-4">
                <label htmlFor={nicknameInputId} className={LABEL_CLASSNAME}>
                  닉네임
                </label>
                <TextFieldOutlined
                  id={nicknameInputId}
                  size="md"
                  name="nickname"
                  autoComplete="nickname"
                  placeholder="닉네임을 입력해 주세요"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  className={FIELD_CLASSNAME}
                />
              </section>

              <div className="h-px w-full bg-line-100" aria-hidden />

              <section className="flex w-full flex-col items-start gap-4">
                <label htmlFor={emailInputId} className={LABEL_CLASSNAME}>
                  이메일
                </label>
                <TextFieldOutlined
                  id={emailInputId}
                  size="md"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  readOnly
                  className={READONLY_FIELD_CLASSNAME}
                />
              </section>

              <div className="h-px w-full bg-line-100" aria-hidden />

              <section className="flex w-full flex-col items-start gap-4">
                <label htmlFor={phoneInputId} className={LABEL_CLASSNAME}>
                  전화번호
                </label>
                <TextFieldOutlined
                  id={phoneInputId}
                  size="md"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className={FIELD_CLASSNAME}
                />
              </section>

              <div className="h-px w-full bg-line-100" aria-hidden />

              <section className="flex w-full flex-col items-start gap-4">
                <label htmlFor={currentPasswordId} className={LABEL_CLASSNAME}>
                  현재 비밀번호
                </label>
                <TextFieldOutlined
                  id={currentPasswordId}
                  size="md"
                  type="password"
                  name="currentPassword"
                  autoComplete="current-password"
                  placeholder="현재 비밀번호를 입력해주세요"
                  showVisibilityToggle
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className={FIELD_CLASSNAME}
                />
              </section>

              <div className="h-px w-full bg-line-100" aria-hidden />

              <section className="flex w-full flex-col items-start gap-4">
                <label htmlFor={newPasswordId} className={LABEL_CLASSNAME}>
                  새 비밀번호
                </label>
                <TextFieldOutlined
                  id={newPasswordId}
                  size="md"
                  type="password"
                  name="newPassword"
                  autoComplete="new-password"
                  placeholder="새 비밀번호를 입력해주세요"
                  showVisibilityToggle
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className={FIELD_CLASSNAME}
                />
              </section>

              <div className="h-px w-full bg-line-100" aria-hidden />

              <section className="flex w-full flex-col items-start gap-4">
                <label htmlFor={confirmPasswordId} className={LABEL_CLASSNAME}>
                  새 비밀번호 확인
                </label>
                <TextFieldOutlined
                  id={confirmPasswordId}
                  size="md"
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="새 비밀번호를 다시 한번 입력해주세요"
                  showVisibilityToggle
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className={FIELD_CLASSNAME}
                />
              </section>
            </div>

            <div className="flex w-full flex-col items-start gap-8 lg:max-w-[40rem]">
              <section className="flex flex-col items-start gap-6">
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
                  onClick={() => imageInputRef.current?.click()}
                  aria-label="프로필 이미지 업로드"
                  className={cn(
                    'flex size-40 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-background-200',
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
                      className="size-10 text-gray-300"
                      aria-hidden
                    />
                  )}
                </button>
              </section>

              <div className="h-px w-full bg-line-100" aria-hidden />

              <section className="flex w-full flex-col items-start gap-8">
                <div className="flex flex-col items-start gap-2">
                  <h2 className={LABEL_CLASSNAME}>이용 서비스</h2>
                  <p className={HELPER_CLASSNAME}>
                    *견적 요청 시 이용 서비스를 선택할 수 있어요.
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

              <div className="h-px w-full bg-line-100" aria-hidden />

              <section className="flex w-full flex-col items-start gap-8">
                <div className="flex w-full flex-col items-start gap-2">
                  <h2 className={LABEL_CLASSNAME}>내가 사는 지역</h2>
                  <p className={HELPER_CLASSNAME}>
                    *견적 요청 시 지역을 설정할 수 있어요.
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
                      className={CHIP_CLASSNAME}
                    >
                      {option.label}
                    </RegionChip>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 lg:flex-row lg:justify-between">
          <Button
            type="button"
            variant="outlined"
            size="md"
            onClick={handleCancel}
            className="border-gray-200 text-gray-300 shadow-cta hover:border-gray-200 hover:bg-transparent hover:text-gray-300 hover:shadow-cta lg:max-w-[41.25rem]"
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="solid"
            size="md"
            className="lg:max-w-[41.25rem]"
          >
            수정하기
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
