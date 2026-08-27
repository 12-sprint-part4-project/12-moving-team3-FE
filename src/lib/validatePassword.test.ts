import { describe, expect, it } from 'vitest';

import {
  getPasswordChangeFieldState,
  PASSWORD_FORMAT_ERROR_MESSAGE,
  validatePassword,
} from './validatePassword';

describe('validatePassword', () => {
  it('영문·숫자·특수문자를 포함한 8~20자는 통과한다', () => {
    expect(validatePassword('Abcd1234!')).toBeNull();
  });

  it.each(['short1!', 'abcdefgh', 'abcd1234', '12345678!', 'Abcd1234!xxxxxxxxxxxx'])(
    '%s는 형식 오류이다',
    (password) => {
      expect(validatePassword(password)).toBe(PASSWORD_FORMAT_ERROR_MESSAGE);
    }
  );
});

describe('getPasswordChangeFieldState', () => {
  it('세 필드가 모두 비어 있으면 입력이 없다고 본다', () => {
    expect(
      getPasswordChangeFieldState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    ).toEqual({
      hasPasswordInput: false,
      isPasswordFormatError: false,
      isPasswordMismatchError: false,
      isPasswordIncomplete: false,
    });
  });

  it('새 비밀번호 형식이 틀리면 형식 오류이다', () => {
    const state = getPasswordChangeFieldState({
      currentPassword: 'old',
      newPassword: 'plain',
      confirmPassword: 'plain',
    });
    expect(state.isPasswordFormatError).toBe(true);
  });

  it('확인 값이 다르면 불일치 오류이다', () => {
    const state = getPasswordChangeFieldState({
      currentPassword: 'oldPass1!',
      newPassword: 'Abcd1234!',
      confirmPassword: 'Abcd1234?',
    });
    expect(state.isPasswordMismatchError).toBe(true);
  });

  it('일부만 입력하면 미완료이다', () => {
    const state = getPasswordChangeFieldState({
      currentPassword: 'oldPass1!',
      newPassword: 'Abcd1234!',
      confirmPassword: '',
    });
    expect(state.isPasswordIncomplete).toBe(true);
  });
});
