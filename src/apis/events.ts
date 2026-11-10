import axios from 'axios';
import type { EventRetreiveResponse } from '../types/events';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getEventRetreive = async (): Promise<EventRetreiveResponse> => {
  const response = await api.get('/api/notices');

  return response.data;
};
