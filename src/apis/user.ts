import { api } from "./axios";
import type { CommonResponse } from "../types/common";

import type {
  CreateProfileRequest,
  CreateProfileResponse,
  ProfileCheckResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UserData,
} from "../types/user";

// 프로필 생성 API
export const createProfile = async (
  body: CreateProfileRequest,
): Promise<CreateProfileResponse> => {
  const { data } = await api.post<CreateProfileResponse>(
    "/api/users/profile",
    body,
  );

  return data;
};

// 프로필 조회 API
export const getProfile = async (): Promise<CommonResponse<UserData>> => {
  const { data } =
    await api.get<CommonResponse<UserData>>("/api/users/profile");

  return data;
};

// 프로필 수정 API
export const updateProfile = async (
  body: UpdateProfileRequest,
): Promise<UpdateProfileResponse> => {
  const { data } = await api.put<UpdateProfileResponse>(
    "/api/users/profile",
    body,
  );

  return data;
};

// 프로필 생성 여부 확인 API
export const checkProfile = async (): Promise<ProfileCheckResponse> => {
  const { data } = await api.get<ProfileCheckResponse>(
    "/api/users/profile/check",
  );

  return data;
};
