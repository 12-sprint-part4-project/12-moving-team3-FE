/** BE(INVALID_PASSWORD_FORMAT / INVALID_NEW_PASSWORD)와 동일 정책 */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 20;

/** 영문·숫자·특수문자 각 1자 이상 + 공개 길이 상수 */
const PASSWORD_REGEX = new RegExp(
  `^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{${PASSWORD_MIN_LENGTH},${PASSWORD_MAX_LENGTH}}$`
);

export const PASSWORD_FORMAT_ERROR_MESSAGE = `비밀번호는 ${PASSWORD_MIN_LENGTH}~${PASSWORD_MAX_LENGTH}자의 영문, 숫자, 특수문자를 포함해야 합니다.`;

export const PASSWORD_MISMATCH_ERROR_MESSAGE =
  '비밀번호가 일치하지 않습니다.';

/** 프로필 수정 폼 필드에 보여주는 짧은 형식 오류 */
export const PASSWORD_FORMAT_FIELD_ERROR_MESSAGE =
  '비밀번호가 올바르지 않습니다.';

/**
 * 회원가입·비밀번호 변경 공통 형식 검증 (BE 규칙과 동일).
 * 실패 시 메시지, 통과 시 null.
 */
export const validatePassword = (password: string): string | null => {
  if (!PASSWORD_REGEX.test(password)) {
    return PASSWORD_FORMAT_ERROR_MESSAGE;
  }

  return null;
};

interface PasswordChangeFields {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** 비밀번호 변경 3필드의 입력·형식·불일치·미완료 상태 */
export const getPasswordChangeFieldState = ({
  currentPassword,
  newPassword,
  confirmPassword,
}: PasswordChangeFields) => {
  const hasPasswordInput =
    currentPassword.length > 0 ||
    newPassword.length > 0 ||
    confirmPassword.length > 0;

  return {
    hasPasswordInput,
    isPasswordFormatError:
      newPassword.length > 0 && Boolean(validatePassword(newPassword)),
    isPasswordMismatchError:
      confirmPassword.length > 0 && newPassword !== confirmPassword,
    isPasswordIncomplete:
      hasPasswordInput &&
      (currentPassword.length === 0 ||
        newPassword.length === 0 ||
        confirmPassword.length === 0),
  };
};
