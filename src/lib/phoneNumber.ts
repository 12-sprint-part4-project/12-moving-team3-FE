import { isValidPhoneNumber } from 'libphonenumber-js';

const DEFAULT_COUNTRY = 'KR' as const;
const KR_MOBILE_PREFIX = '010';
const INVALID_PHONE_NUMBER_MESSAGE = '올바른 전화번호를 입력해 주세요.';

/** 010 뒤에 사용자가 입력하는 가입자 번호 길이 */
export const KR_MOBILE_SUBSCRIBER_LENGTH = 8;

export const PHONE_SUBSCRIBER_LENGTH_ERROR_MESSAGE =
  '8자리를 입력해 주세요.';

/** 입력 필드 왼쪽 고정 표시 */
export const KR_MOBILE_PREFIX_LABEL = `${KR_MOBILE_PREFIX}-`;

/** 전체 번호에서 010 뒤 가입자 번호 숫자만 (최대 8자리) */
export const toKrMobileSubscriberDigits = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith(KR_MOBILE_PREFIX)) {
    return digits.slice(
      KR_MOBILE_PREFIX.length,
      KR_MOBILE_PREFIX.length + KR_MOBILE_SUBSCRIBER_LENGTH
    );
  }
  return digits.slice(0, KR_MOBILE_SUBSCRIBER_LENGTH);
};

/** 가입자 번호 입력 표시 (예: 1234-5678) */
export const formatKrMobileSubscriberInput = (value: string): string => {
  const digits = toKrMobileSubscriberDigits(value);
  if (digits.length <= 4) {
    return digits;
  }
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
};

/** 고정 010 + 가입자 번호 → 전체 번호 */
export const composeKrMobilePhone = (subscriber: string): string =>
  `${KR_MOBILE_PREFIX}${toKrMobileSubscriberDigits(subscriber)}`;

/** API 전송용 국내 번호 숫자만 (예: 01012345678) */
export const toPhoneDigits = (value: string): string =>
  value.replace(/\D/g, '');

export const isValidKrPhoneNumber = (value: string): boolean => {
  if (!value.trim()) {
    return false;
  }
  return isValidPhoneNumber(value, DEFAULT_COUNTRY);
};

/**
 * 010 고정 필드용 가입자 번호 검증.
 * 비어 있으면 null(필수 미입력은 버튼 비활성으로 처리),
 * 1~7자리면 길이 메시지, 8자리면 null.
 */
export const getKrMobileSubscriberError = (
  subscriber: string
): string | null => {
  const digits = toKrMobileSubscriberDigits(subscriber);
  if (
    digits.length === 0 ||
    digits.length === KR_MOBILE_SUBSCRIBER_LENGTH
  ) {
    return null;
  }
  return PHONE_SUBSCRIBER_LENGTH_ERROR_MESSAGE;
};

/** 검증 실패 시 메시지, 통과 시 null */
export const getPhoneNumberError = (value: string): string | null => {
  if (!value.trim() || toPhoneDigits(value) === KR_MOBILE_PREFIX) {
    return '전화번호를 입력해 주세요.';
  }
  if (!isValidKrPhoneNumber(value)) {
    return INVALID_PHONE_NUMBER_MESSAGE;
  }
  return null;
};
