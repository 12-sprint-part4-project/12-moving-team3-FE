import { describe, expect, it } from 'vitest';

import {
  POST_IMAGE_MAX_BYTES,
  validatePostImageFile,
} from './uploadPostImage';

const createImageFile = (size: number, type: string): File =>
  new File([new Uint8Array(size)], 'post-image.jpg', { type });

describe('validatePostImageFile', () => {
  it.each(['image/jpeg', 'image/png', 'image/webp'] as const)(
    '허용 MIME(%s)은 통과한다',
    (type) => {
      expect(validatePostImageFile(createImageFile(1, type))).toBeNull();
    }
  );

  it('지원하지 않는 MIME은 거부한다', () => {
    expect(validatePostImageFile(createImageFile(1, 'image/gif'))).toBe(
      '지원하지 않는 이미지 형식입니다.'
    );
  });

  it('빈 파일은 거부한다', () => {
    expect(validatePostImageFile(createImageFile(0, 'image/jpeg'))).toBe(
      '빈 이미지 파일은 첨부할 수 없어요.'
    );
  });

  it('5MB 이하는 통과한다', () => {
    expect(
      validatePostImageFile(createImageFile(POST_IMAGE_MAX_BYTES, 'image/jpeg'))
    ).toBeNull();
  });

  it('5MB 초과는 거부한다', () => {
    expect(
      validatePostImageFile(
        createImageFile(POST_IMAGE_MAX_BYTES + 1, 'image/jpeg')
      )
    ).toBe('이미지가 너무 커서 첨부할 수 없어요. (5MB 이하)');
  });
});
