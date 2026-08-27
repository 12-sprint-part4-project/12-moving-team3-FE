import { describe, expect, it } from 'vitest';

import {
  PROFILE_IMAGE_MAX_BYTES,
  validateProfileImageFile,
} from './uploadProfileImage';

const createImageFile = (size: number, type: string): File =>
  new File([new Uint8Array(size)], 'profile.jpg', { type });

describe('validateProfileImageFile', () => {
  it.each(['image/jpeg', 'image/png', 'image/webp'] as const)(
    '허용 MIME(%s)은 통과한다',
    (type) => {
      expect(validateProfileImageFile(createImageFile(1, type))).toBeNull();
    }
  );

  it('지원하지 않는 MIME은 거부한다', () => {
    expect(validateProfileImageFile(createImageFile(1, 'image/gif'))).toBe(
      'JPG, PNG, WEBP 이미지만 업로드할 수 있습니다.'
    );
  });

  it('빈 파일은 거부한다', () => {
    expect(validateProfileImageFile(createImageFile(0, 'image/jpeg'))).toBe(
      '빈 이미지 파일은 업로드할 수 없습니다.'
    );
  });

  it('5MB 이하는 통과한다', () => {
    expect(
      validateProfileImageFile(
        createImageFile(PROFILE_IMAGE_MAX_BYTES, 'image/jpeg')
      )
    ).toBeNull();
  });

  it('5MB 초과는 거부한다', () => {
    expect(
      validateProfileImageFile(
        createImageFile(PROFILE_IMAGE_MAX_BYTES + 1, 'image/jpeg')
      )
    ).toBe('이미지는 5MB 이하만 업로드할 수 있습니다.');
  });
});
