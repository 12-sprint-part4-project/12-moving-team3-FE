import type {
  RegionChipValue,
  ServiceChipValue,
} from '@/constants/commonOptions';
import type {
  MoverProfileMe,
  UpsertMoverProfileRequest,
} from '@/types/moverProfile';

interface BuildMoverProfileUpdateBodyParams {
  profile: MoverProfileMe;
  nickname: string;
  career: number;
  shortDescription: string;
  description: string;
  selectedServices: ServiceChipValue[];
  selectedRegions: RegionChipValue[];
  s3Key?: string | null;
  /** 이미지 업로드·삭제 전에도 변경 여부를 반영하기 위한 플래그 */
  hasImageChange?: boolean;
}

/** 배열이 같은 값으로 구성됐는지 비교한다 */
const areSortedEqual = (left: string[], right: string[]): boolean => {
  if (left.length !== right.length) return false;
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return sortedLeft.every((value, index) => value === sortedRight[index]);
};

/** PATCH body 구성. 변경이 없으면 null */
export const buildMoverProfileUpdateBody = ({
  profile,
  nickname,
  career,
  shortDescription,
  description,
  selectedServices,
  selectedRegions,
  s3Key,
  hasImageChange = false,
}: BuildMoverProfileUpdateBodyParams): UpsertMoverProfileRequest | null => {
  const trimmedNickname = nickname.trim();
  const trimmedShortIntro = shortDescription.trim();
  const trimmedDescription = description.trim();

  const hasFieldChange =
    trimmedNickname !== profile.nickname ||
    career !== profile.career ||
    trimmedShortIntro !== (profile.shortDescription ?? '') ||
    trimmedDescription !== (profile.description ?? '') ||
    !areSortedEqual(selectedServices, profile.service) ||
    !areSortedEqual(selectedRegions, profile.serviceRegions) ||
    hasImageChange;

  if (!hasFieldChange) {
    return null;
  }

  return {
    nickname: trimmedNickname,
    career,
    shortDescription: trimmedShortIntro,
    description: trimmedDescription,
    service: selectedServices,
    serviceRegions: selectedRegions,
    ...(s3Key !== undefined ? { s3Key } : {}),
  };
};
