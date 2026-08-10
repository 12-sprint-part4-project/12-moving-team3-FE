import type {
  RegionChipValue,
  ServiceChipValue,
} from '@/constants/commonOptions';
import type { ApiSuccessResponse } from '@/types/api';

export type MoverServiceType = ServiceChipValue;
export type MoverRegion = RegionChipValue;

/** PATCH /api/users/movers/profile 요청 본문 */
export interface UpsertMoverProfileRequest {
  /** 사이트 노출 닉네임 (2~20자) */
  nickname: string;
  /** 경력(년), 0~50 */
  career: number;
  /** 한 줄 소개 (1~20자) */
  shortDescription: string;
  /** 상세 소개 (최소 8자) */
  description: string;
  /** 제공 서비스 (최소 1개) */
  service: MoverServiceType[];
  /** 서비스 가능 지역 (최소 1개) */
  serviceRegions: MoverRegion[];
  /** Presigned 업로드 후 s3Key. null이면 이미지 삭제, 미전송 시 기존 유지 */
  s3Key?: string | null;
}

/** PATCH 응답 data */
export interface MoverProfile {
  nickname: string;
  career: number;
  shortDescription: string;
  description: string;
  service: MoverServiceType[];
  serviceRegions: MoverRegion[];
  /** 공개/CDN URL. 이미지 없으면 null */
  profileImageUrl: string | null;
  updatedAt: string;
}

/** GET /api/users/movers/profile 응답 data */
export interface MoverProfileMe {
  profileId: number;
  userId: string;
  name: string;
  nickname: string;
  email: string;
  phoneNumber: string | null;
  /** 공개/CDN URL. 이미지 없으면 null */
  profileImageUrl: string | null;
  career: number | null;
  shortDescription: string | null;
  description: string | null;
  service: MoverServiceType[];
  serviceRegions: MoverRegion[];
  /** 확정 견적(CONFIRMED) 건수 */
  confirmedCount: number;
  /** LOCAL 비밀번호 보유 여부 (카카오 전용 계정이면 false) */
  hasPassword: boolean;
  createdAt: string;
  updatedAt: string;
}

/** PATCH /api/users/movers/basic-info 요청 */
export interface UpdateMoverBasicInfoRequest {
  /** 2~20자 */
  name: string;
  /** 숫자 11자리 */
  phoneNumber: string;
  currentPassword?: string;
  newPassword?: string;
  newPasswordConfirm?: string;
}

/** PATCH /api/users/movers/basic-info 응답 data */
export interface MoverBasicInfo {
  name: string;
  email: string;
  phoneNumber: string | null;
  updatedAt: string;
}

export type MoverProfileResponse = ApiSuccessResponse<MoverProfile>;
export type MoverProfileMeResponse = ApiSuccessResponse<MoverProfileMe>;
export type MoverBasicInfoResponse = ApiSuccessResponse<MoverBasicInfo>;
