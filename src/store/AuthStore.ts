import { create } from "zustand";
import type { LoginData } from "../types/auth";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setAuth: (tokens: LoginData) => void;
  clearAuth: () => void;
};

export const AuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  // 로그인 성공 시
  setAuth: ({ accessToken, refreshToken }) =>
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    }),
}));
