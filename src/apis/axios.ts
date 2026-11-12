import axios from 'axios';
import { AuthStore } from '../store/AuthStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청을 보낼 때마다 최신 accessToken 가져오기
api.interceptors.request.use((config) => {
  const accessToken = AuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
