import type { CommonResponse } from "./common";

export type CreateProfileRequest = {
  nickname: string;
  character: string;
  status: string;
  primaryDepartmentId: string;
  doubleMajorDepartmentId?: string | null;
  minorDepartmentId?: string | null;
  interestIds: string[];
};

export type Department = {
  departmentId: string;
  name: string;
  division: string;
  type: string;
};

export type Interest = {
  interestId: string;
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

export type CreateProfileResponse = CommonResponse<UserData>;

export type ProfileCheckResponse = CommonResponse<boolean>;
