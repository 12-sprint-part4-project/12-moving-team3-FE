import { describe, expect, it } from 'vitest';

import {
  buildMoverBasicInfoUpdateBody,
  getMoverBasicInfoUpdateError,
} from './moverBasicInfoUpdate';

import type { MoverProfileMe } from '@/types/moverProfile';

const createProfile = (
  overrides: Partial<MoverProfileMe> = {}
): MoverProfileMe => ({
  profileId: 1,
  userId: 'mover-1',
  name: '김기사',
  nickname: '친절한기사',
  email: 'mover@example.com',
  phoneNumber: '01012345678',
  profileImageUrl: null,
  career: 5,
  shortDescription: '한줄소개입니다',
  description: '상세 설명을 여덟 자 이상.',
  service: ['SMALL'],
  serviceRegions: ['SEOUL'],
  confirmedCount: 0,
  hasPassword: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const unchangedParams = {
  name: '김기사',
  phoneNumber: '01012345678',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

describe('buildMoverBasicInfoUpdateBody', () => {
  it('변경이 없으면 null을 반환한다', () => {
    expect(
      buildMoverBasicInfoUpdateBody({
        profile: createProfile(),
        ...unchangedParams,
      })
    ).toBeNull();
  });

  it('이름만 바뀌면 name과 phoneNumber를 보낸다', () => {
    expect(
      buildMoverBasicInfoUpdateBody({
        profile: createProfile(),
        ...unchangedParams,
        name: '박기사',
      })
    ).toEqual({
      name: '박기사',
      phoneNumber: '01012345678',
    });
  });

  it('비밀번호 입력이 있으면 비밀번호 필드를 포함한다', () => {
    const body = buildMoverBasicInfoUpdateBody({
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
});

describe('getMoverBasicInfoUpdateError', () => {
  it('변경이 없으면 안내 메시지를 반환한다', () => {
    expect(
      getMoverBasicInfoUpdateError({
        profile: createProfile(),
        ...unchangedParams,
      })
    ).toBe('변경된 내용이 없습니다.');
  });

  it('이름이 너무 짧으면 형식 오류이다', () => {
    expect(
      getMoverBasicInfoUpdateError({
        profile: createProfile(),
        ...unchangedParams,
        name: '김',
      })
    ).toBe('이름은 2~20자로 입력해 주세요.');
  });

  it('비밀번호를 일부만 입력하면 미완료 오류이다', () => {
    expect(
      getMoverBasicInfoUpdateError({
        profile: createProfile(),
        ...unchangedParams,
        currentPassword: 'OldPass1!',
      })
    ).toBe('비밀번호 변경 시 현재·새 비밀번호·확인을 모두 입력해 주세요.');
  });

  it('새 비밀번호와 확인이 다르면 불일치 오류이다', () => {
    expect(
      getMoverBasicInfoUpdateError({
        profile: createProfile(),
        ...unchangedParams,
        currentPassword: 'OldPass1!',
        newPassword: 'NewPass1!',
        confirmPassword: 'NewPass2!',
      })
    ).toBe('새 비밀번호와 확인이 일치하지 않습니다.');
  });

  it('유효한 변경은 null을 반환한다', () => {
    expect(
      getMoverBasicInfoUpdateError({
        profile: createProfile(),
        ...unchangedParams,
        name: '박기사',
      })
    ).toBeNull();
  });
});
