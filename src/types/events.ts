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
};

export type EventRecommendResponse = CommonResponse<EventRecommend[]>;
