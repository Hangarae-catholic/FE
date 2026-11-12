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

// 소셜 로그인
export type OAuthTicketRequest = {
  ticket: string;
};

export type OAuthLoginData = {
  nextStep: "LOGIN" | "SIGN_UP" | "PROFILE_SETUP";
  email: string | null;
  name: string | null;
  tokens: LoginData | null;
};

export type OAuthTicketResponse = CommonResponse<OAuthLoginData>;

// 회원가입
export type SignUpRequest = {
  name: string;
  loginId: string;
  password: string;
  confirmPassword: string;
};

export type SignUpResponse = CommonResponse<string>;

// 이메일 인증
export type EmailPurpose = "JOIN" | "FIND_ID" | "RESET_PASSWORD";

export type SendEmailCodeRequest = {
  email: string;
  purpose: EmailPurpose;
};

export type SendEmailCodeResponse = CommonResponse<null>;

export type VerifyEmailCodeRequest = {
  email: string;
  type: EmailPurpose;
  code: string;
};

export type VerifyEmailCodeData = {
  verified: boolean;
  message: string;
};

export type VerifyEmailCodeResponse = CommonResponse<VerifyEmailCodeData>;
