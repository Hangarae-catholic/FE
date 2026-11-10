import { api } from "./axios";
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
} from "../types/auth";

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/api/auth/login", body);
  return data;
};

export const signUp = async (body: SignUpRequest): Promise<SignUpResponse> => {
  const { data } = await api.post<SignUpResponse>("/api/auth/sign-up", body);
  return data;
};
