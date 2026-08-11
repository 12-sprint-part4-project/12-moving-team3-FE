/** BE(INVALID_PASSWORD_FORMAT / INVALID_NEW_PASSWORD)와 동일 정책 */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 20;

/** 8~20자, 영문·숫자·특수문자 각 1자 이상 */
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;

export const PASSWORD_FORMAT_ERROR_MESSAGE =
  '비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.';

export const PASSWORD_MISMATCH_ERROR_MESSAGE =
  '비밀번호가 일치하지 않습니다.';

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
