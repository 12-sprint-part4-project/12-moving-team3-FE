import { describe, expect, it } from 'vitest';

import { normalizeCareerInput } from './normalizeCareerInput';

describe('normalizeCareerInput', () => {
  it('숫자가 없으면 빈 문자열을 반환한다', () => {
    expect(normalizeCareerInput('abc')).toBe('');
    expect(normalizeCareerInput('')).toBe('');
  });

  it('숫자만 남기고 선행 0을 제거한다', () => {
    expect(normalizeCareerInput('007')).toBe('7');
    expect(normalizeCareerInput('12년')).toBe('12');
  });

  it('0은 유지한다', () => {
    expect(normalizeCareerInput('0')).toBe('0');
  });
});
