import type {
  RegionChipValue,
  ServiceChipValue,
} from '@/constants/commonOptions';
import { getPhoneNumberError, toPhoneDigits } from '@/lib/phoneNumber';
import { validatePassword } from '@/lib/validatePassword';
import type {
  CustomerProfileMe,
  UpsertCustomerProfileRequest,
} from '@/types/customerProfile';

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 20;
const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 20;

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

/** 수정 요청 전 클라이언트 검증. 통과 시 null */
export const getCustomerProfileUpdateError = ({
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
  hasImageChange,
}: BuildCustomerProfileUpdateBodyParams): string | null => {
  const trimmedName = name.trim();
  if (
    trimmedName.length < NAME_MIN_LENGTH ||
    trimmedName.length > NAME_MAX_LENGTH
  ) {
    return `이름은 ${NAME_MIN_LENGTH}~${NAME_MAX_LENGTH}자로 입력해 주세요.`;
  }

  const trimmedNickname = nickname.trim();
  if (
    trimmedNickname.length < NICKNAME_MIN_LENGTH ||
    trimmedNickname.length > NICKNAME_MAX_LENGTH
  ) {
    return `닉네임은 ${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}자로 입력해 주세요.`;
  }

  const phoneError = getPhoneNumberError(phoneNumber);
  if (phoneError) {
    return phoneError;
  }

  if (
    !areServicesEqual(selectedServices, profile.service) &&
    selectedServices.length === 0
  ) {
    return '이용 서비스를 한 개 이상 선택해 주세요.';
  }

  if (selectedRegion === null && profile.region !== null) {
    return '내가 사는 지역을 선택해 주세요.';
  }

  const hasPasswordInput =
    currentPassword.length > 0 ||
    newPassword.length > 0 ||
    confirmPassword.length > 0;

  if (hasPasswordInput) {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return '비밀번호 변경 시 현재·새 비밀번호·확인을 모두 입력해 주세요.';
    }
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return passwordError;
    }
    if (newPassword !== confirmPassword) {
      return '새 비밀번호와 확인이 일치하지 않습니다.';
    }
  }

  const body = buildCustomerProfileUpdateBody({
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
    hasImageChange,
  });

  if (!body) {
    return '변경된 내용이 없습니다.';
  }

  return null;
};
