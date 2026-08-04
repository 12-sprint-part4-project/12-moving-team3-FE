import { REGION_LABELS, SERVICE_LABELS } from '@/types/mover';
import type { MoverProfileMe } from '@/types/moverProfile';
import type { ReviewStats } from '@/types/mover';

import type { MoverMyProfileCardData } from '../_components/MoverMyProfileCard';

/** 본인 프로필 + 리뷰 통계 → 마이페이지 카드 모델 */
export const toMoverMyProfileCardData = (
  profile: MoverProfileMe,
  reviewStats?: ReviewStats
): MoverMyProfileCardData => {
  const servicesLabel =
    profile.service.length > 0
      ? profile.service.map((service) => SERVICE_LABELS[service]).join(', ')
      : '서비스 미등록';
  const regionsLabel =
    profile.serviceRegions.length > 0
      ? profile.serviceRegions
          .map((region) => REGION_LABELS[region])
          .join(', ')
      : '지역 미등록';

  return {
    nickname: profile.nickname,
    shortDescription:
      profile.shortDescription?.trim() || '등록된 한 줄 소개가 없습니다.',
    profileImageUrl: profile.profileImageUrl,
    averageRating: reviewStats?.averageRating ?? null,
    reviewCount: reviewStats?.totalCount ?? 0,
    career: profile.career,
    confirmedCount: profile.confirmedCount,
    servicesLabel,
    regionsLabel,
  };
};
