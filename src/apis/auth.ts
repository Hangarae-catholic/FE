import { api } from "./axios";
import type {
  KakaoCallbackRequest,
  KakaoLoginResponse,
  LoginRequest,
  LoginResponse,
  SendEmailCodeRequest,
  SendEmailCodeResponse,
  SignUpRequest,
  SignUpResponse,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResponse,
} from "../types/auth";

// 로컬 로그인 API
export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/api/auth/login", body);
  return data;
};

// 카카오 로그인
export const kakaoCallback = async (
  body: KakaoCallbackRequest,
): Promise<KakaoLoginResponse> => {
  const { data } = await api.post<KakaoLoginResponse>(
    "/api/auth/kakao/callback",
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
