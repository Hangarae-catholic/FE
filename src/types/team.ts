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
  detail: string;
  imageUrl: string;
  createdAt: Date;
};

export type TeamPostRetrieveResponse = CommonResponse<TeamRecruitPost[]>;

// 팀매칭 상세 조회
export type TeamRecruitPostDetail = {
  teamId: number;
  title: string;
  startAt: Date;
  endAt: Date;
  maxMember: number;
  remainingMember: number;
  userName: string;
  studentStatus: string;
  department: string;
  character: string;
  category: string;
  teamStatus: 'RECRUITING' | 'CLOSED';
  detail: string;
  contacts: {
    type: string;
    url: string;
  }[];
  imageUrls: string[];
};

export type TeamPostDetailResponse = CommonResponse<TeamRecruitPostDetail>;

// 팀매칭 생성
export type TeamCreate = {
  title: string;
  startAt: Date | null;
  endAt: Date | null;
  maxMember: number;
  category: string | undefined;
  detail: string;
  contacts: {
    type: string;
    url: string;
  }[];
  imageUrls: string[];
};

export type TeamCreateRequest = CommonResponse<number>;

// 팀매칭 수정
export type TeamEdit = {
  title: string;
  startAt: Date;
  endAt: Date;
  remainingMember: number;
  category: string | undefined;
  detail: string;
  contacts: {
    type: string;
    url: string;
  }[];
  imageUrls: string[];
};

export type TeamEditRequest = CommonResponse<number>;

// 팀매칭 삭제
export type TeamDeleteResponse = CommonResponse<string>;

// 팀매칭 수동 마감
export type TeamPostCloseResponse = CommonResponse<number>;
