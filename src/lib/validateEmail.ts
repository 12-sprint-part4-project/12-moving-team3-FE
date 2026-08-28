/** RFC 5321 상한 — 전체 이메일 주소 최대 길이 */
export const EMAIL_MAX_LENGTH = 254;

/** @ 앞(local-part) 최대 길이 */
export const EMAIL_LOCAL_MAX_LENGTH = 64;

/** 도메인 label(. 사이) 최대 길이 */
export const EMAIL_DOMAIN_LABEL_MAX_LENGTH = 63;

export const EMAIL_FORMAT_ERROR_MESSAGE =
  '올바른 이메일 형식으로 입력해 주세요.';

/**
 * 회원가입/로그인 이메일 형식 검증 (BE 규칙과 동일).
 * - 전체 ≤ 254
 * - @ 앞 ≤ 64
 * - 도메인 각 label ≤ 63
 * 실패 시 메시지, 통과 시 null.
 */
export const validateEmail = (email: string): string | null => {
  const trimmed = email.trim();

  if (!trimmed || trimmed.length > EMAIL_MAX_LENGTH) {
    return EMAIL_FORMAT_ERROR_MESSAGE;
  }

  const atIndex = trimmed.indexOf('@');
  if (atIndex <= 0 || atIndex !== trimmed.lastIndexOf('@')) {
    return EMAIL_FORMAT_ERROR_MESSAGE;
  }

  const localPart = trimmed.slice(0, atIndex);
  const domainPart = trimmed.slice(atIndex + 1);

  if (
    localPart.length === 0 ||
    localPart.length > EMAIL_LOCAL_MAX_LENGTH ||
    domainPart.length === 0
  ) {
    return EMAIL_FORMAT_ERROR_MESSAGE;
  }

  const labels = domainPart.split('.');
  if (
    labels.length < 2 ||
    labels.some(
      (label) =>
        label.length === 0 || label.length > EMAIL_DOMAIN_LABEL_MAX_LENGTH
    )
  ) {
    return EMAIL_FORMAT_ERROR_MESSAGE;
  }

  return null;
};
