import { describe, expect, it } from 'vitest';

import {
  isProfileTextFormatError,
  isProfileTextValid,
} from './validateProfileText';

describe('isProfileTextFormatError', () => {
  it('비어 있으면 입력 중 오류로 보지 않는다', () => {
    expect(isProfileTextFormatError('')).toBe(false);
    expect(isProfileTextFormatError('   ')).toBe(false);
  });

  it('1자면 오류이다', () => {
    expect(isProfileTextFormatError('가')).toBe(true);
  });

  it('21자면 오류이다', () => {
    expect(isProfileTextFormatError('가'.repeat(21))).toBe(true);
  });

  it('2~20자면 오류가 아니다', () => {
    expect(isProfileTextFormatError('가나')).toBe(false);
    expect(isProfileTextFormatError('가'.repeat(20))).toBe(false);
  });
});

describe('isProfileTextValid', () => {
  it('공백만 있으면 유효하지 않다', () => {
    expect(isProfileTextValid('  ')).toBe(false);
  });

  it('2~20자면 유효하다', () => {
    expect(isProfileTextValid(' 가나 ')).toBe(true);
  });
});
