import { describe, expect, it } from 'vitest';

import {
  EMAIL_FORMAT_ERROR_MESSAGE,
  EMAIL_LOCAL_MAX_LENGTH,
  validateEmail,
} from './validateEmail';

describe('validateEmail', () => {
  it('올바른 이메일은 null을 반환한다', () => {
    expect(validateEmail('user@example.com')).toBeNull();
    expect(validateEmail('  user@example.com  ')).toBeNull();
  });

  it.each(['', '   ', 'user', 'user@', '@example.com', 'a@b@c.com', 'user@com'])(
    '%s는 형식 오류이다',
    (email) => {
      expect(validateEmail(email)).toBe(EMAIL_FORMAT_ERROR_MESSAGE);
    }
  );

  it('local-part가 64자를 넘으면 오류이다', () => {
    const local = 'a'.repeat(EMAIL_LOCAL_MAX_LENGTH + 1);
    expect(validateEmail(`${local}@example.com`)).toBe(
      EMAIL_FORMAT_ERROR_MESSAGE
    );
  });

  it('도메인 label이 비어 있으면 오류이다', () => {
    expect(validateEmail('user@example..com')).toBe(EMAIL_FORMAT_ERROR_MESSAGE);
  });
});
