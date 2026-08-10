import type {
  RegionChipValue,
  ServiceChipValue,
} from '@/constants/commonOptions';
import type { ApiSuccessResponse } from '@/types/api';

export type CustomerServiceType = ServiceChipValue;
export type CustomerRegion = RegionChipValue;

export interface UpsertCustomerProfileRequest {
  name?: string;
  nickname: string;
  /** 숫자 11자리. 등록·수정 모두 필수 */
  phoneNumber: string;
  currentPassword?: string;
  newPassword?: string;
  newPasswordConfirm?: string;
  region?: CustomerRegion;
  service?: CustomerServiceType[];
  /** Presigned 업로드 후 s3Key. null이면 이미지 삭제, 미전송 시 기존 유지 */
  s3Key?: string | null;
}

export interface CustomerProfile {
  profileId: number;
  userId: string;
  name: string;
  nickname: string;
  email: string;
  phoneNumber: string | null;
  /** 공개/CDN URL. 이미지 없으면 null */
  profileImageUrl: string | null;
  service: CustomerServiceType[];
  region: CustomerRegion | null;
  updatedAt: string;
}

export interface CustomerProfileMe extends CustomerProfile {
  /** LOCAL 비밀번호 존재 여부. false면 소셜 전용 가입자 */
  hasPassword: boolean;
  createdAt: string;
}

export type CustomerProfileResponse = ApiSuccessResponse<CustomerProfile>;
export type CustomerProfileMeResponse = ApiSuccessResponse<CustomerProfileMe>;
