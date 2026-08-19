export const CAREER_MAX = 50;
export const SHORT_DESCRIPTION_MAX = 20;
export const DESCRIPTION_MIN = 8;
export const DESCRIPTION_MAX = 200;

export const CAREER_FORMAT_ERROR_MESSAGE = `경력은 0~${CAREER_MAX} 사이의 값으로 입력해 주세요.`;
export const SHORT_INTRO_FORMAT_ERROR_MESSAGE = `한 줄 소개는 1~${SHORT_DESCRIPTION_MAX}자로 입력해 주세요.`;
export const DESCRIPTION_FORMAT_ERROR_MESSAGE = `상세 설명은 ${DESCRIPTION_MIN}~${DESCRIPTION_MAX}자로 입력해 주세요.`;

interface MoverProfileTextFields {
  career: string;
  shortIntro: string;
  description: string;
}

/** 경력·한 줄 소개·상세 설명 필드의 형식·제출 가능 상태 */
export const getMoverProfileTextFieldState = ({
  career,
  shortIntro,
  description,
}: MoverProfileTextFields) => {
  const trimmedShortIntro = shortIntro.trim();
  const trimmedDescription = description.trim();
  const careerValue = career === '' ? null : Number(career);
  const isCareerValid =
    careerValue !== null &&
    Number.isInteger(careerValue) &&
    careerValue >= 0 &&
    careerValue <= CAREER_MAX;

  return {
    trimmedShortIntro,
    trimmedDescription,
    careerValue,
    isCareerValid,
    isCareerFormatError: career !== '' && !isCareerValid,
    isShortIntroFormatError: trimmedShortIntro.length > SHORT_DESCRIPTION_MAX,
    isShortIntroValid:
      trimmedShortIntro.length > 0 &&
      trimmedShortIntro.length <= SHORT_DESCRIPTION_MAX,
    isDescriptionFormatError:
      trimmedDescription.length > 0 &&
      (trimmedDescription.length < DESCRIPTION_MIN ||
        trimmedDescription.length > DESCRIPTION_MAX),
    isDescriptionValid:
      trimmedDescription.length >= DESCRIPTION_MIN &&
      trimmedDescription.length <= DESCRIPTION_MAX,
  };
};
