import { api } from "./axios";
import type { CommonResponse } from "../types/common";
import type { UserData } from "../types/user";

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
