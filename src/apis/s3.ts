import { AuthStore } from '../store/AuthStore';
import type { CommonResponse } from '../types/common';
import { api } from './axios';

// S3 이미지 업로드
export const uploadImageToS3 = async (file: File): Promise<CommonResponse<{ url: string }>> => {
  const accessToken = AuthStore.getState().accessToken;

  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post(`${import.meta.env.VITE_API_URL}/api/images`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};
