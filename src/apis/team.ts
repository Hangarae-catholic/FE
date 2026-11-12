import type { TeamCreate, TeamCreateRequest } from './../types/team';
import axios from 'axios';
import type { TeamPostDetailResponse, TeamPostRetrieveResponse } from '../types/team';

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

// 팀매칭 상세 조회
export const getTeamPostDetail = async (teamId: number): Promise<TeamPostDetailResponse> => {
  const { data } = await api.get(`/api/teams/${teamId}`);

  return data;
};

// 팀 생성 등록
export const postTeamCreate = async (TeamCreate: TeamCreate): Promise<TeamCreateRequest> => {
  const { data } = await api.post(`/api/teams`, {
    ...TeamCreate,
  });

  return data;
};
