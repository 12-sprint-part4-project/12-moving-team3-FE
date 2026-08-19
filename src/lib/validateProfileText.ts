export const PROFILE_TEXT_MIN_LENGTH = 2;
export const PROFILE_TEXT_MAX_LENGTH = 20;

export const PROFILE_NAME_FORMAT_ERROR_MESSAGE = `이름은 ${PROFILE_TEXT_MIN_LENGTH}~${PROFILE_TEXT_MAX_LENGTH}자로 입력해 주세요.`;
export const PROFILE_NICKNAME_FORMAT_ERROR_MESSAGE = `닉네임은 ${PROFILE_TEXT_MIN_LENGTH}~${PROFILE_TEXT_MAX_LENGTH}자로 입력해 주세요.`;

/** 입력 중 길이 오류. 비어 있으면 아직 에러로 보지 않는다. */
export const isProfileTextFormatError = (value: string): boolean => {
  const trimmed = value.trim();
  return (
    trimmed.length > 0 &&
    (trimmed.length < PROFILE_TEXT_MIN_LENGTH ||
      trimmed.length > PROFILE_TEXT_MAX_LENGTH)
  );
};

/** 제출 가능 길이(2~20자)인지 판별한다 */
export const isProfileTextValid = (value: string): boolean => {
  const trimmed = value.trim();
  return (
    trimmed.length >= PROFILE_TEXT_MIN_LENGTH &&
    trimmed.length <= PROFILE_TEXT_MAX_LENGTH
  );
};
