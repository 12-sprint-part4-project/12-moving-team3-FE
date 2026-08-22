import { describe, expect, it } from 'vitest';

import { DEFAULT_LANGUAGE, resolveLanguage } from './config';

describe('resolveLanguage', () => {
  it.each(['ko', 'en', 'zh-CN'] as const)(
    '지원하는 언어 %s를 그대로 반환한다',
    (language) => {
      expect(resolveLanguage(language)).toBe(language);
    }
  );

  it.each([null, '', 'zh', 'zh-TW', 'invalid'] as const)(
    '지원하지 않는 언어 %s는 기본 언어로 대체한다',
    (language) => {
      expect(resolveLanguage(language)).toBe(DEFAULT_LANGUAGE);
    }
  );
});
