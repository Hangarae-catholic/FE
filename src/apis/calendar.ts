import { api } from "./axios";

import type {
  AcademicScheduleRequest,
  AcademicCalendarResponse,
  CalendarRequest,
  CalendarResponse,
} from "../types/calendar";

// 월별 학사일정 조회
export const getAcademicCalendar = async (
  params: AcademicScheduleRequest,
): Promise<AcademicCalendarResponse> => {
  const { data } = await api.get<AcademicCalendarResponse>(
    "/api/calendar/academic",
    {
      params,
    },
  );

  return data;
};

// 월별 교내 행사 조회
export const getCalendar = async (
  params: CalendarRequest,
): Promise<CalendarResponse> => {
  const { data } = await api.get<CalendarResponse>("/api/calendar", {
    params,
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();

      searchParams.append("year", String(params.year));
      searchParams.append("month", String(params.month));

      params.divisions.forEach((division: string) => {
        searchParams.append("divisions", division);
      });

      params.categories.forEach((category: string) => {
        searchParams.append("categories", category);
      });

      return searchParams.toString();
    },
  });

  return data;
};
