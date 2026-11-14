import type {
  EventDetailResponse,
  EventLikeRequest,
  EventLikeResponse,
  EventRecommendResponse,
  EventRegister,
  EventRegisterRequest,
  EventRetreiveResponse,
} from "../types/events";
import { api } from "./axios";

// 행사 조회
export const getEventRetreive = async (): Promise<EventRetreiveResponse> => {
  const { data } = await api.get("/api/notices");

  return data;
};

// 행사 추천
export const getEventRecommend = async (): Promise<EventRecommendResponse> => {
  const { data } = await api.get(`/api/notices/recommend`, {
    params: {
      size: 2,
    },
  });

  return data;
};

// 행사 추천/비추천 조회
export const getEventLikes = async (
  noticeId: number,
): Promise<EventLikeResponse> => {
  const { data } = await api.get(`/api/notices/${noticeId}/reaction`);

  return data;
};

// 행사 추천/비추천 등록
export const postEventLikes = async (
  noticeId: number,
  type: "LIKE" | "DISLIKE",
): Promise<EventLikeRequest> => {
  const { data } = await api.post(`/api/notices/${noticeId}/reaction`, {
    type,
  });

  return data;
};

// 행사 상세 조회
export const getEventDetail = async (
  noticeId: number,
): Promise<EventDetailResponse> => {
  const { data } = await api.get(`/api/notices/${noticeId}`);

  return data;
};

// 행사 등록
export const postEventRegister = async (
  eventRegister: EventRegister,
): Promise<EventRegisterRequest> => {
  const { data } = await api.post(`/api/notices`, {
    ...eventRegister,
  });

  return data;
};

// 내가 작성한 행사 조회
export const getMyEvent = async (): Promise<EventRecommendResponse> => {
  const { data } = await api.get<EventRecommendResponse>("/api/notices/my");
  return data;
};
