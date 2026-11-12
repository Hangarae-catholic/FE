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
  accessToken: string,
): Promise<CreateProfileResponse> => {
  const { data } = await api.post<CreateProfileResponse>(
    "/api/users/profile",
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return data;
};

// 프로필 조회 API
export const getProfile = async (
  accessToken: string,
): Promise<CommonResponse<UserData>> => {
  const { data } = await api.get<CommonResponse<UserData>>(
    "/api/users/profile",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return data;
};

export const updateProfile = async (
  body: UpdateProfileRequest,
  accessToken: string,
): Promise<UpdateProfileResponse> => {
  const { data } = await api.put<UpdateProfileResponse>(
    "/api/users/profile",
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return data;
};

// 프로필 생성 여부 확인 API
export const checkProfile = async (
  accessToken: string,
): Promise<ProfileCheckResponse> => {
  const { data } = await api.get<ProfileCheckResponse>(
    "/api/users/profile/check",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return data;
};
