import axios from 'axios';
import type { TeamPostRetrieveResponse } from '../types/team';

// 임시 키값을 활용한 axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: import.meta.env.VITE_AUTH_KEY,
  },
});

// 팀매칭 목록 조회
export const getTeamPosts = async (category?: string, keyword?: string): Promise<TeamPostRetrieveResponse> => {
  const { data } = await api.get(`/api/teams`, {
    params: {
      category,
      keyword,
    },
  });

  return data;
};
