import axios, { type InternalAxiosRequestConfig } from "axios";
import { AuthStore } from "../store/AuthStore";
import type { LoginData } from "../types/auth";
import type { CommonResponse } from "../types/common";

const baseURL = import.meta.env.VITE_API_URL;

// 인증 없는 API
export const publicApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 인증 있는 API
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<LoginData> | null = null;

// 토큰 재발급
const reissueToken = (refreshToken: string): Promise<LoginData> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const { data } = await publicApi.post<CommonResponse<LoginData>>(
        "/api/auth/reissue",
        { refreshToken },
      );

      if (!data.data?.accessToken || !data.data?.refreshToken) {
        throw new Error("토큰 재발급 응답이 올바르지 않습니다.");
      }

      if (AuthStore.getState().refreshToken !== refreshToken) {
        throw new Error("인증 상태가 변경되었습니다.");
      }

      AuthStore.getState().setAuth(data.data);

      return data.data;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

// 인증 API에만 accessToken 자동 추가
api.interceptors.request.use((config) => {
  const accessToken = AuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryConfig | undefined;

    const errorCode = error.response?.data?.code;

    if (!originalRequest || errorCode !== "AUTH001" || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = AuthStore.getState().refreshToken;

    if (!refreshToken) {
      AuthStore.getState().clearAuth();

      window.location.replace("/login");

      return Promise.reject(error);
    }

    try {
      const newTokens = await reissueToken(refreshToken);

      originalRequest.headers.set(
        "Authorization",
        `Bearer ${newTokens.accessToken}`,
      );

      return api(originalRequest);
    } catch (refreshError) {
      console.error("토큰 재발급 실패:", refreshError);

      if (AuthStore.getState().refreshToken === refreshToken) {
        AuthStore.getState().clearAuth();

        window.location.replace("/login");
      }

      return Promise.reject(refreshError);
    }
  },
);
