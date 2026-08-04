import { REGION_LABELS, SERVICE_LABELS } from '@/types/mover';
import type { MoverProfileMe } from '@/types/moverProfile';

import type { MoverMyProfileCardData } from '../_components/MoverMyProfileCard';

export interface MoverMyPageReviewSummary {
  averageRating: number | null;
  reviewCount: number;
}

/** 본인 프로필 + 리뷰 요약 → 마이페이지 카드 모델 */
export const toMoverMyProfileCardData = (
  profile: MoverProfileMe,
  reviewSummary?: MoverMyPageReviewSummary
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
    averageRating: reviewSummary?.averageRating ?? null,
    reviewCount: reviewSummary?.reviewCount ?? 0,
    career: profile.career,
    confirmedCount: profile.confirmedCount ?? null,
    servicesLabel,
    regionsLabel,
  };
};
