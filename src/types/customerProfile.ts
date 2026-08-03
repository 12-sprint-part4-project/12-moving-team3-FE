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
  phoneNumber?: string;
  currentPassword?: string;
  newPassword?: string;
  newPasswordConfirm?: string;
  region?: CustomerRegion;
  service?: CustomerServiceType[];
  s3Key?: string;
}

export interface CustomerProfile {
  profileId: number;
  userId: string;
  name: string;
  nickname: string;
  email: string;
  phoneNumber: string | null;
  /** Presigned GET URL (1시간), 없으면 null */
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
