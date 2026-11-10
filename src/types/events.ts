import type { CommonResponse } from './common';

type EventInfo = {
  noticeId: number;
  name: string;
  startAt: Date;
  endAt: Date;
  location: string;
  summary: string;
  approved: boolean;
};

export type EventRetreiveResponse = CommonResponse<EventInfo[]>;
