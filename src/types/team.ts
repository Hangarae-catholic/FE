import type { CommonResponse } from './common';

// 팀매칭 목록 조회
export type TeamRecruitPost = {
  teamId: number;
  title: string;
  startAt: Date;
  endAt: Date;
  maxMember: number;
  remainingMember: number;
  userName: string;
  studentStatus: string;
  department: string;
  category: 'COURSE' | 'CONTEST_COMPETITION' | 'STUDY' | 'OTHER';
  teamStatus: 'RECRUITING' | 'CLOSED';
};

export type TeamPostRetrieveResponse = CommonResponse<TeamRecruitPost[]>;
