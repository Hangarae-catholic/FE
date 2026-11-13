import type { CommonResponse } from './common';

// 행사 목록 조회
export type EventInfo = {
  noticeId: number;
  name: string;
  startAt: Date;
  endAt: Date;
  location: string;
  summary: string;
  approved: boolean;
  imageUrls: string[];
};

export type EventRetreiveResponse = CommonResponse<EventInfo[]>;

// 행사 추천
export type EventRecommend = {
  noticeId: number;
  name: string;
  startAt: Date;
  endAt: Date;
  location: string;
  approved: boolean;
  imageUrls: string[];
};

export type EventRecommendResponse = CommonResponse<EventRecommend[]>;

// 행사 추천/비추천 조회
export type EventLike = {
  likeCount: number;
  dislikeCount: number;
  userReaction: 'LIKE' | 'DISLIKE';
};

export type EventLikeResponse = CommonResponse<EventLike>;

// 행사 추천/비추천 등록
export type EventLikeRequest = CommonResponse<{
  type: 'LIKE' | 'DISLIKE';
}>;

// 행사 상세 조회
export type EventDetail = {
  noticeId: number;
  name: string;
  startAt: Date;
  endAt: Date;
  location: string;
  information: string;
  responsible: string;
  url: string;
  type: string;
  category: string;
  scheduleType: string;
  approved: boolean;
  division: string;
  department: string;
  imageUrls: string[];
};

export type EventDetailResponse = CommonResponse<EventDetail>;

// 행사 등록
export type EventRegister = {
  name: string;
  responsible: string;
  startAt: string;
  endAt: string;
  location: string;
  information: string;
  imageUrls: string[];
};
export type EventRegisterRequest = CommonResponse<number>;
