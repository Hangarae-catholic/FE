import { api } from "./axios";
import type {
  OAuthTicketRequest,
  OAuthTicketResponse,
  LoginRequest,
  LoginResponse,
  SendEmailCodeRequest,
  SendEmailCodeResponse,
  SignUpRequest,
  SignUpResponse,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResponse,
  WithdrawResponse,
} from "../types/auth";

// 로컬 로그인 API
export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/api/auth/login", body);
  return data;
};

// 소셜 로그인 API
export const getOAuthTicket = async (
  body: OAuthTicketRequest,
): Promise<OAuthTicketResponse> => {
  const { data } = await api.post<OAuthTicketResponse>(
    "/api/auth/oauth/ticket",
    body,
  );
  return data;
};

// 회원가입 API
export const signUp = async (body: SignUpRequest): Promise<SignUpResponse> => {
  const { data } = await api.post<SignUpResponse>("/api/auth/sign-up", body);
  return data;
};

// 이메일 인증번호 발송 API
export const sendEmailCode = async (
  body: SendEmailCodeRequest,
): Promise<SendEmailCodeResponse> => {
  const { data } = await api.post<SendEmailCodeResponse>(
    "/api/auth/verify-code/send",
    body,
  );
  return data;
};

export const verifyEmailCode = async (
  body: VerifyEmailCodeRequest,
): Promise<VerifyEmailCodeResponse> => {
  const { data } = await api.post<VerifyEmailCodeResponse>(
    "/api/auth/verify-code/confirm",
    body,
  );
  return data;
};

// 계정 삭제
export const withdraw = async (
  accessToken: string,
): Promise<WithdrawResponse> => {
  const { data } = await api.delete<WithdrawResponse>("/api/auth/withdraw", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
};
