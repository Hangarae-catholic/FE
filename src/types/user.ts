import type { CommonResponse } from "./common";

export type Department = {
  name: string;
  division: string;
  type: string;
};

export type Interest = {
  name: string;
};

export type UserData = {
  userId: number;
  name: string;
  nickname: string;
  character: string;
  status: string;
  departments: Department[];
  interests: Interest[];
};

export type CreateProfileRequest = {
  nickname: string;
  character: string;
  status: string;
  primaryDepartment: string;
  doubleMajorDepartment?: string | null;
  minorDepartment?: string | null;
  interests: string[];
};

export type CreateProfileResponse = CommonResponse<UserData>;

export type UpdateProfileRequest = CreateProfileRequest;

export type UpdateProfileResponse = CommonResponse<UserData>;

export type ProfileCheckResponse = CommonResponse<boolean>;
