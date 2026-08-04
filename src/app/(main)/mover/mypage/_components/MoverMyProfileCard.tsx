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

/**
 * 기사님 마이페이지 프로필 카드.
 * Figma Card-list/profile (내 프로필 Desktop).
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

  return (
    <section
      className={cn(
        'flex w-full flex-col gap-6 rounded-2xl border-[0.5px] border-gray-100 bg-background-100 p-4 md:p-6',
        className
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <h2 className="text-2xl-semibold text-black-300">
            {profile.nickname}
          </h2>
          <p className="text-xl-regular text-gray-400">
            {profile.shortDescription}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end lg:w-auto lg:gap-4">
          <Button
            type="button"
            size="md"
            showIcon
            onClick={onEditBasicInfo}
            className="w-full border border-gray-200 bg-background-200 text-gray-300 hover:bg-background-200 sm:w-[17.5rem] lg:w-[17.5rem]"
          >
            기본 정보 수정
          </Button>
          <Button
            type="button"
            size="md"
            showIcon
            onClick={onEditProfile}
            className="w-full sm:w-[17.5rem] lg:w-[17.5rem]"
          >
            내 프로필 수정
          </Button>
        </div>
      </div>

      <div className="flex w-full items-center gap-4 rounded-md border border-line-200 bg-background-100 px-[1.125rem] py-4 shadow-request-card-body md:gap-6 md:py-6">
        <div className="size-14 shrink-0 overflow-hidden rounded-full lg:size-20">
          {profile.profileImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- CDN 도메인 미확정
            <img
              src={profile.profileImageUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <ProfileIcon className="size-full" aria-hidden />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 lg:gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg-medium sm:gap-x-4">
            <span className="inline-flex items-center gap-1.5">
              <StarIcon
                className="size-5 shrink-0 text-yellow-100 lg:size-6"
                aria-hidden
              />
              <span className="text-black-300">{ratingLabel}</span>
              <span className="text-gray-300">({profile.reviewCount})</span>
            </span>
            <span
              aria-hidden
              className="hidden h-3.5 w-px bg-line-200 sm:block"
            />
            <span className="inline-flex items-center gap-1.5">
              <span className="text-gray-300">경력</span>
              <span className="text-black-300">{careerLabel}</span>
            </span>
            <span
              aria-hidden
              className="hidden h-3.5 w-px bg-line-200 sm:block"
            />
            <span className="inline-flex items-center gap-1.5">
              <span className="text-black-300">{confirmedLabel}</span>
              <span className="text-gray-300">확정</span>
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <dl className="inline-flex items-center gap-3">
              <dt className="inline-flex items-center rounded-sm border border-line-100 bg-background-200 px-1.5 py-1 text-2lg-regular text-gray-500">
                제공 서비스
              </dt>
              <dd className="text-2lg-medium text-black-300">
                {profile.servicesLabel}
              </dd>
            </dl>
            <span
              aria-hidden
              className="hidden h-4 w-px bg-line-200 sm:block"
            />
            <dl className="inline-flex items-center gap-3">
              <dt className="inline-flex items-center rounded-sm border border-line-100 bg-background-200 px-1.5 py-1 text-2lg-regular text-gray-500">
                지역
              </dt>
              <dd className="text-2lg-medium text-black-300">
                {profile.regionsLabel}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};
