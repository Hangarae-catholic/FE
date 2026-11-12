import type { CommonResponse } from '../types/common';
import { api } from './team';

// 토큰을 헤더에 포함하는 함수
const getAuthHeaders = () => {
  // const token = localStorage.getItem('accessToken');
  // return token ? { Authorization: `Bearer ${token}` } : {};
  return { Authorization: `${import.meta.env.VITE_AUTH_KEY}` };
};

// S3 이미지 업로드
export const uploadImageToS3 = async (file: File): Promise<CommonResponse<{ url: string }>> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post(`${import.meta.env.VITE_API_URL}/api/images`, formData, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};
