import ProfileIcon from '@/assets/icons/profile.svg';
import StarIcon from '@/assets/icons/star.svg';
import { Button } from '@/components/Button/Button';
import { cn } from '@/lib/utils';

export interface MoverMyProfileCardData {
  nickname: string;
  shortDescription: string;
  profileImageUrl: string | null;
  averageRating: number | null;
  reviewCount: number;
  career: number | null;
  confirmedCount: number | null;
  servicesLabel: string;
  regionsLabel: string;
}

export interface MoverMyProfileCardProps {
  profile: MoverMyProfileCardData;
  onEditBasicInfo?: () => void;
  onEditProfile?: () => void;
  className?: string;
}

interface ProfileAvatarProps {
  profileImageUrl: string | null;
  className?: string;
}

const ProfileAvatar = ({
  profileImageUrl,
  className = '',
}: ProfileAvatarProps) => (
  <div className={cn('shrink-0 overflow-hidden rounded-full', className)}>
    {profileImageUrl ? (
      // eslint-disable-next-line @next/next/no-img-element -- CDN 도메인 미확정
      <img
        src={profileImageUrl}
        alt=""
        className="size-full object-cover"
      />
    ) : (
      <ProfileIcon className="size-full" aria-hidden />
    )}
  </div>
);

/**
 * 기사님 마이페이지 프로필 카드.
 * Figma Card-list/profile — Mobile(1:8552) · Tablet(1:8521) · Desktop(1:8536).
 */
export const MoverMyProfileCard = ({
  profile,
  onEditBasicInfo,
  onEditProfile,
  className = '',
}: MoverMyProfileCardProps) => {
  const ratingLabel =
    profile.averageRating === null
      ? '-'
      : profile.averageRating.toFixed(1);
  const careerLabel =
    profile.career === null ? '-' : `${profile.career}년`;
  const confirmedLabel =
    profile.confirmedCount === null
      ? '-'
      : `${profile.confirmedCount}건`;

  const editButtonsMobileAndTablet = (
    <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between lg:hidden">
      <Button
        type="button"
        size="sm"
        showIcon
        onClick={onEditProfile}
        className="w-full md:min-w-0 md:flex-1 md:max-w-[18.5rem]"
      >
        내 프로필 수정
      </Button>
      <Button
        type="button"
        size="sm"
        showIcon
        onClick={onEditBasicInfo}
        className="w-full border border-gray-200 bg-white text-gray-300 hover:bg-white md:min-w-0 md:flex-1 md:max-w-[18.5rem]"
      >
        기본 정보 수정
      </Button>
    </div>
  );

  const editButtonsDesktop = (
    <div className="hidden shrink-0 gap-4 lg:flex">
      <Button
        type="button"
        size="md"
        showIcon
        onClick={onEditBasicInfo}
        className="w-[17.5rem] border border-gray-200 bg-background-200 text-gray-300 hover:bg-background-200"
      >
        기본 정보 수정
      </Button>
      <Button
        type="button"
        size="md"
        showIcon
        onClick={onEditProfile}
        className="w-[17.5rem]"
      >
        내 프로필 수정
      </Button>
    </div>
  );

  return (
    <section className={cn('flex w-full flex-col gap-2.5 lg:gap-0', className)}>
      <div className="flex w-full flex-col gap-4 rounded-2xl border-[0.5px] border-gray-100 bg-background-100 px-3.5 py-4 md:gap-4 lg:gap-6 lg:p-6">
        {/* Tablet · Mobile: 아바타 + 닉네임/소개 */}
        <div className="flex w-full items-center gap-4 lg:hidden">
          <ProfileAvatar
            profileImageUrl={profile.profileImageUrl}
            className="size-[2.875rem]"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 className="text-lg-semibold text-black-300">
              {profile.nickname}
            </h2>
            <p className="truncate text-md-regular text-gray-400">
              {profile.shortDescription}
            </p>
          </div>
        </div>

        {/* Desktop: 닉네임/소개 + 수정 버튼 */}
        <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <h2 className="text-2xl-semibold text-black-300">
              {profile.nickname}
            </h2>
            <p className="text-xl-regular text-gray-400">
              {profile.shortDescription}
            </p>
          </div>
          {editButtonsDesktop}
        </div>

        {/* 통계 · 서비스 · 지역 */}
        <div className="flex w-full flex-col gap-3.5 rounded-md border border-line-100 bg-background-100 p-2.5 shadow-request-card-body md:gap-3.5 lg:flex-row lg:items-center lg:gap-6 lg:border-line-200 lg:px-[1.125rem] lg:py-6">
          <ProfileAvatar
            profileImageUrl={profile.profileImageUrl}
            className="hidden size-20 lg:block"
          />

          <div className="flex min-w-0 flex-1 flex-col gap-3.5 lg:gap-4">
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-sm-medium md:gap-x-3.5 lg:gap-x-4 lg:text-lg-medium">
              <span className="inline-flex items-center gap-0.5 lg:gap-1.5">
                <StarIcon
                  className="size-5 shrink-0 text-yellow-100 lg:size-6"
                  aria-hidden
                />
                <span className="text-black-300">{ratingLabel}</span>
                <span className="text-gray-300">({profile.reviewCount})</span>
              </span>
              <span aria-hidden className="h-3.5 w-px bg-line-200" />
              <span className="inline-flex items-center gap-1 lg:gap-1.5">
                <span className="text-gray-300">경력</span>
                <span className="text-black-300">{careerLabel}</span>
              </span>
              <span aria-hidden className="h-3.5 w-px bg-line-200" />
              <span className="inline-flex items-center gap-1 lg:gap-1.5">
                <span className="text-black-300">{confirmedLabel}</span>
                <span className="text-gray-300">확정</span>
              </span>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-3.5 lg:gap-4">
              <dl className="inline-flex items-center gap-2 lg:gap-3">
                <dt className="inline-flex items-center rounded-sm border border-line-100 bg-background-200 px-1.5 py-0.5 text-md-medium text-gray-400 lg:py-1 lg:text-2lg-regular lg:text-gray-500">
                  제공 서비스
                </dt>
                <dd className="text-md-medium text-black-300 lg:text-2lg-medium">
                  {profile.servicesLabel}
                </dd>
              </dl>
              <span
                aria-hidden
                className="hidden h-3.5 w-px bg-line-200 md:block lg:h-4"
              />
              <dl className="inline-flex items-center gap-2 lg:gap-3">
                <dt className="inline-flex items-center rounded-sm border border-line-100 bg-background-200 px-1.5 py-0.5 text-md-medium text-gray-400 lg:py-1 lg:text-2lg-regular lg:text-gray-500">
                  지역
                </dt>
                <dd className="text-md-medium text-black-300 lg:text-2lg-medium">
                  {profile.regionsLabel}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {editButtonsMobileAndTablet}
    </section>
  );
};
