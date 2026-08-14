import { toPhoneDigits } from '@/lib/phoneNumber';

import type {
  RegionChipValue,
  ServiceChipValue,
} from '@/constants/commonOptions';
import type {
  CustomerProfileMe,
  UpsertCustomerProfileRequest,
} from '@/types/customerProfile';

interface BuildCustomerProfileUpdateBodyParams {
  profile: CustomerProfileMe;
  name: string;
  nickname: string;
  phoneNumber: string;
  selectedServices: ServiceChipValue[];
  selectedRegion: RegionChipValue | null;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  s3Key?: string | null;
  /** 이미지 업로드·삭제 전에도 변경 여부를 반영하기 위한 플래그 */
  hasImageChange?: boolean;
}

/** 서비스 배열이 같은 값으로 구성됐는지 비교한다 */
const areServicesEqual = (
  left: ServiceChipValue[],
  right: ServiceChipValue[]
): boolean => {
  if (left.length !== right.length) return false;
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return sortedLeft.every((value, index) => value === sortedRight[index]);
};

/** PATCH body 구성. nickname·phoneNumber는 필수라 항상 포함한다. */
export const buildCustomerProfileUpdateBody = ({
  profile,
  name,
  nickname,
  phoneNumber,
  selectedServices,
  selectedRegion,
  currentPassword,
  newPassword,
  confirmPassword,
  s3Key,
  hasImageChange = false,
}: BuildCustomerProfileUpdateBodyParams): UpsertCustomerProfileRequest | null => {
  const trimmedNickname = nickname.trim();
  const phoneDigits = toPhoneDigits(phoneNumber);
  const body: UpsertCustomerProfileRequest = {
    nickname: trimmedNickname,
    phoneNumber: phoneDigits,
  };

  const trimmedName = name.trim();
  if (trimmedName !== profile.name) {
    body.name = trimmedName;
  }

  if (!areServicesEqual(selectedServices, profile.service)) {
    body.service = selectedServices;
  }

  if (selectedRegion !== null && selectedRegion !== profile.region) {
    body.region = selectedRegion;
  }

  const hasPasswordInput =
    currentPassword.length > 0 ||
    newPassword.length > 0 ||
    confirmPassword.length > 0;

  if (hasPasswordInput) {
    body.currentPassword = currentPassword;
    body.newPassword = newPassword;
    body.newPasswordConfirm = confirmPassword;
  }

  if (s3Key !== undefined) {
    body.s3Key = s3Key;
  }

  const hasOtherChanges =
    body.name !== undefined ||
    trimmedNickname !== profile.nickname ||
    phoneDigits !== toPhoneDigits(profile.phoneNumber ?? '') ||
    body.service !== undefined ||
    body.region !== undefined ||
    body.currentPassword !== undefined ||
    body.s3Key !== undefined ||
    hasImageChange;

  return hasOtherChanges ? body : null;
};
