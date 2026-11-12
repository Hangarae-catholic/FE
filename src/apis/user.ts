import { api } from "./axios";
import type { CommonResponse } from "../types/common";
import type { ProfileCheckResponse, UserData } from "../types/user";

export const getMyProfile = async (
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
