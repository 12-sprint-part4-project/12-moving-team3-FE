import { describe, expect, it } from 'vitest';

import { buildCustomerProfileUpdateBody } from './customerProfileUpdate';

import type { CustomerProfileMe } from '@/types/customerProfile';

const createProfile = (
  overrides: Partial<CustomerProfileMe> = {}
): CustomerProfileMe => ({
  profileId: 1,
  userId: 'user-1',
  name: '홍길동',
  nickname: '길동이',
  email: 'hong@example.com',
  phoneNumber: '01012345678',
  profileImageUrl: null,
  service: ['SMALL'],
  region: 'SEOUL',
  updatedAt: '2026-01-01T00:00:00.000Z',
  hasPassword: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const unchangedParams = {
  name: '홍길동',
  nickname: '길동이',
  phoneNumber: '010-1234-5678',
  selectedServices: ['SMALL' as const],
  selectedRegion: 'SEOUL' as const,
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

describe('buildCustomerProfileUpdateBody', () => {
  it('변경이 없으면 null을 반환한다', () => {
    expect(
      buildCustomerProfileUpdateBody({
        profile: createProfile(),
        ...unchangedParams,
      })
    ).toBeNull();
  });

  it('닉네임·전화번호는 항상 포함하고 이름 변경만 추가한다', () => {
    const body = buildCustomerProfileUpdateBody({
      profile: createProfile(),
      ...unchangedParams,
      name: '김철수',
    });

    expect(body).toEqual({
      nickname: '길동이',
      phoneNumber: '01012345678',
      name: '김철수',
    });
  });

  it('서비스 순서가 달라도 같은 값이면 변경으로 보지 않는다', () => {
    expect(
      buildCustomerProfileUpdateBody({
        profile: createProfile({ service: ['SMALL', 'HOME'] }),
        ...unchangedParams,
        selectedServices: ['HOME', 'SMALL'],
      })
    ).toBeNull();
  });

  it('비밀번호를 입력하면 변경 필드를 포함한다', () => {
    const body = buildCustomerProfileUpdateBody({
      profile: createProfile(),
      ...unchangedParams,
      currentPassword: 'OldPass1!',
      newPassword: 'NewPass1!',
      confirmPassword: 'NewPass1!',
    });

    expect(body).toMatchObject({
      currentPassword: 'OldPass1!',
      newPassword: 'NewPass1!',
      newPasswordConfirm: 'NewPass1!',
    });
  });

  it('이미지 변경 플래그만 있어도 body를 반환한다', () => {
    const body = buildCustomerProfileUpdateBody({
      profile: createProfile(),
      ...unchangedParams,
      hasImageChange: true,
    });

    expect(body).toEqual({
      nickname: '길동이',
      phoneNumber: '01012345678',
    });
  });

  it('s3Key가 있으면 포함한다', () => {
    const body = buildCustomerProfileUpdateBody({
      profile: createProfile(),
      ...unchangedParams,
      s3Key: 'profiles/1.png',
    });

    expect(body?.s3Key).toBe('profiles/1.png');
  });
});
