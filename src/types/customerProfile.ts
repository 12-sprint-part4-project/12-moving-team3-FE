import type {
  RegionChipValue,
  ServiceChipValue,
} from '@/constants/chipOptions';
import type { ApiSuccessResponse } from '@/types/api';

export type CustomerServiceType = ServiceChipValue;
export type CustomerRegion = RegionChipValue;

export interface UpsertCustomerProfileRequest {
  name?: string;
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
  email: string;
  phoneNumber: string | null;
  /** Presigned GET URL (1시간), 없으면 null */
  profileImageUrl: string | null;
  service: CustomerServiceType[];
  region: CustomerRegion | null;
  updatedAt: string;
}

export interface CustomerProfileMe extends CustomerProfile {
  createdAt: string;
}

export type CustomerProfileResponse = ApiSuccessResponse<CustomerProfile>;
export type CustomerProfileMeResponse = ApiSuccessResponse<CustomerProfileMe>;
