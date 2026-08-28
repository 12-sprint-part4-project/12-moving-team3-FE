import { describe, expect, it } from 'vitest';

import { buildMoverProfileUpdateBody } from './moverProfileUpdate';

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
  nickname: '친절한기사',
  career: 5,
  shortDescription: '한줄소개입니다',
  description: '상세 설명을 여덟 자 이상.',
  selectedServices: ['SMALL' as const],
  selectedRegions: ['SEOUL' as const],
};

describe('buildMoverProfileUpdateBody', () => {
  it('변경이 없으면 null을 반환한다', () => {
    expect(
      buildMoverProfileUpdateBody({
        profile: createProfile(),
        ...unchangedParams,
      })
    ).toBeNull();
  });

  it('지역 순서가 달라도 같은 값이면 변경으로 보지 않는다', () => {
    expect(
      buildMoverProfileUpdateBody({
        profile: createProfile({ serviceRegions: ['SEOUL', 'BUSAN'] }),
        ...unchangedParams,
        selectedRegions: ['BUSAN', 'SEOUL'],
      })
    ).toBeNull();
  });

  it('닉네임이 바뀌면 전체 프로필 필드를 보낸다', () => {
    const body = buildMoverProfileUpdateBody({
      profile: createProfile(),
      ...unchangedParams,
      nickname: '새닉네임',
    });

    expect(body).toEqual({
      nickname: '새닉네임',
      career: 5,
      shortDescription: '한줄소개입니다',
      description: '상세 설명을 여덟 자 이상.',
      service: ['SMALL'],
      serviceRegions: ['SEOUL'],
    });
  });

  it('이미지 변경만 있어도 body를 반환한다', () => {
    expect(
      buildMoverProfileUpdateBody({
        profile: createProfile(),
        ...unchangedParams,
        hasImageChange: true,
        s3Key: null,
      })
    ).toMatchObject({ s3Key: null });
  });
});
