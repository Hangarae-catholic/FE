import type { CommonResponse } from "./common";

// 학사일정
export type AcademicScheduleRequest = {
  year: number;
  month: number;
};

export type AcademicSchedule = {
  name: string;
  startDate: string;
  endDate: string;
};

export type AcademicCalendarResponse = CommonResponse<AcademicSchedule[]>;

// 교내 행사
export type CalendarRequest = {
  year: number;
  month: number;
  divisions: string[];
  categories: string[];
};

export type CalendarEvent = {
  noticeId: number;
  name: string;
  startAt: string;
  endAt: string;
  location: string;
  category: string;
  scheduleType: string;
  division: string;
};

export type CalendarResponse = CommonResponse<CalendarEvent[]>;
