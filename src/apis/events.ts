import type { EventRecommendResponse, EventRetreiveResponse } from '../types/events';
import { api } from './team';

// 행사 조회
export const getEventRetreive = async (): Promise<EventRetreiveResponse> => {
  const response = await api.get('/api/notices');

  return response.data;
};

// 행사 추천
export const getEventRecommend = async (): Promise<EventRecommendResponse> => {
  const response = await api.get(`/api/notices/recommend`, {
    params: {
      size: 2,
    },
  });

  return response.data;
};
