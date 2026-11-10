import type { CommonResponse } from "./common";

// 로컬 로그인
export type LoginRequest = {
  loginId: string;
  password: string;
};

export type LoginData = {
  accessToken: string;
  refreshToken: string;
};

export type LoginResponse = CommonResponse<LoginData>;

// 회원가입
export type SignUpRequest = {
  name: string;
  loginId: string;
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignUpResponse = CommonResponse<string>;
