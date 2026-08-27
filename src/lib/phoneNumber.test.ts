import { describe, expect, it } from 'vitest';

import {
  composeKrMobilePhone,
  formatKrMobileSubscriberInput,
  getKrMobileFieldState,
  getKrMobileSubscriberError,
  getPhoneNumberError,
  PHONE_SUBSCRIBER_LENGTH_ERROR_MESSAGE,
  toKrMobileSubscriberDigits,
  toPhoneDigits,
} from './phoneNumber';

describe('toKrMobileSubscriberDigits', () => {
  it('010을 떼고 최대 8자리만 남긴다', () => {
    expect(toKrMobileSubscriberDigits('01012345678')).toBe('12345678');
    expect(toKrMobileSubscriberDigits('123456789')).toBe('12345678');
  });
});

describe('formatKrMobileSubscriberInput', () => {
  it('4자리 이하는 하이픈 없이 보여준다', () => {
    expect(formatKrMobileSubscriberInput('1234')).toBe('1234');
  });

  it('5자리 이상은 하이픈을 넣는다', () => {
    expect(formatKrMobileSubscriberInput('12345678')).toBe('1234-5678');
  });
});

describe('composeKrMobilePhone / toPhoneDigits', () => {
  it('가입자 번호로 전체 번호를 만든다', () => {
    expect(composeKrMobilePhone('1234-5678')).toBe('01012345678');
  });

  it('숫자만 남긴다', () => {
    expect(toPhoneDigits('010-1234-5678')).toBe('01012345678');
  });
});

describe('getKrMobileSubscriberError', () => {
  it('비어 있으면 오류를 내지 않는다', () => {
    expect(getKrMobileSubscriberError('')).toBeNull();
  });

  it('8자리 미만이면 길이 메시지를 반환한다', () => {
    expect(getKrMobileSubscriberError('123')).toBe(
      PHONE_SUBSCRIBER_LENGTH_ERROR_MESSAGE
    );
  });

  it('유효한 8자리는 통과한다', () => {
    expect(getKrMobileSubscriberError('12345678')).toBeNull();
  });
});

describe('getPhoneNumberError', () => {
  it('비어 있거나 010만 있으면 입력을 요구한다', () => {
    expect(getPhoneNumberError('')).toBe('전화번호를 입력해 주세요.');
    expect(getPhoneNumberError('010')).toBe('전화번호를 입력해 주세요.');
  });

  it('유효한 번호는 통과한다', () => {
    expect(getPhoneNumberError('01012345678')).toBeNull();
  });
});

describe('getKrMobileFieldState', () => {
  it('8자리이고 형식이 맞으면 완료로 본다', () => {
    const state = getKrMobileFieldState('12345678');
    expect(state.isPhoneComplete).toBe(true);
    expect(state.isPhoneFormatError).toBe(false);
  });

  it('입력이 짧으면 완료가 아니다', () => {
    expect(getKrMobileFieldState('1234').isPhoneComplete).toBe(false);
  });
});
