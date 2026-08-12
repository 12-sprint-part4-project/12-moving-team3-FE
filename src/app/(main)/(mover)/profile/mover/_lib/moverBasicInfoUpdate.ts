import { getPhoneNumberError, toPhoneDigits } from '@/lib/phoneNumber';
import { validatePassword } from '@/lib/validatePassword';
import type {
  MoverProfileMe,
  UpdateMoverBasicInfoRequest,
} from '@/types/moverProfile';

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 20;

interface BuildMoverBasicInfoUpdateParams {
  profile: MoverProfileMe;
  name: string;
  phoneNumber: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** PATCH body. 변경 없으면 null */
export const buildMoverBasicInfoUpdateBody = ({
  profile,
  name,
  phoneNumber,
  currentPassword,
  newPassword,
  confirmPassword,
}: BuildMoverBasicInfoUpdateParams): UpdateMoverBasicInfoRequest | null => {
  const trimmedName = name.trim();
  const phoneDigits = toPhoneDigits(phoneNumber);

  const hasPasswordInput =
    currentPassword.length > 0 ||
    newPassword.length > 0 ||
    confirmPassword.length > 0;

  const hasBasicChange =
    trimmedName !== profile.name ||
    phoneDigits !== toPhoneDigits(profile.phoneNumber ?? '');

  if (!hasBasicChange && !hasPasswordInput) {
    return null;
  }

  const body: UpdateMoverBasicInfoRequest = {
    name: trimmedName,
    phoneNumber: phoneDigits,
  };

  if (hasPasswordInput) {
    body.currentPassword = currentPassword;
    body.newPassword = newPassword;
    body.newPasswordConfirm = confirmPassword;
  }

  return body;
};

/** 클라이언트 검증. 통과 시 null */
export const getMoverBasicInfoUpdateError = ({
  profile,
  name,
  phoneNumber,
  currentPassword,
  newPassword,
  confirmPassword,
}: BuildMoverBasicInfoUpdateParams): string | null => {
  const trimmedName = name.trim();
  if (
    trimmedName.length < NAME_MIN_LENGTH ||
    trimmedName.length > NAME_MAX_LENGTH
  ) {
    return `이름은 ${NAME_MIN_LENGTH}~${NAME_MAX_LENGTH}자로 입력해 주세요.`;
  }

  const phoneError = getPhoneNumberError(phoneNumber);
  if (phoneError) {
    return phoneError;
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

  const body = buildMoverBasicInfoUpdateBody({
    profile,
    name,
    phoneNumber,
    currentPassword,
    newPassword,
    confirmPassword,
  });

  if (!body) {
    return '변경된 내용이 없습니다.';
  }

  return null;
};
