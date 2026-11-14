import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomSheet from "../components/common/BottomSheet/BottomSheet";
import NavBar from "../components/common/NavBar";

import type { AcademicSchedule, CalendarEvent } from "../types/calendar";
import { getAcademicCalendar, getCalendar } from "../apis/calendar";

import { Division } from "../constants/DIVISION";

import RightArrow from "../assets/icons/arrow_right.svg?react";
import Filter from "../assets/icons/filter.svg?react";
import FilterOrange from "../assets/icons/filter-orange.svg?react";
import LoadingSpinner from "../components/common/LoadingSpinner";

// 필터 유형
const calendarTypes = [
  "전체",
  "일반",
  "학과·학사",
  "장학",
  "취창업",
  "공모전",
] as const;

const categoryMap: Record<string, string> = {
  일반: "GENERAL",
  "학과·학사": "DEPARTMENT_ACADEMIC",
  장학: "SCHOLARSHIP",
  취창업: "EMPLOYMENT_STARTUP",
  공모전: "CONTEST",
};

type CalendarType = (typeof calendarTypes)[number];

const majorOptions = [
  "경영대학",
  "글로벌경영학부",
  "바이오헬스융합",
  "AI전자정보융합",
  "약학",
  "인문계열",
  "어문계열",
  "사회과학계열",
  "특수교육",
  "국제, 법정경계열",
  "글로벌경영학",
  "자연과학계열",
  "공학계열",
  "생활과학계열",
  "음악",
  "응용예술",
  "융합전공",
  "교직과정",
  "자유전공",
];

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

interface CalendarEvents {
  id: string;
  noticeId?: number;

  name: string;
  startAt: string;
  endAt: string;

  category: string;
  division: string | null;

  type: "ACADEMIC" | "NOTICE";
}

const convertAcademicEvents = (
  schedules: AcademicSchedule[],
): CalendarEvents[] => {
  return schedules.map((schedule, index) => ({
    id: `academic-${schedule.startDate}-${index}`,

    name: schedule.name,

    startAt: `${schedule.startDate}T00:00:00`,
    endAt: `${schedule.endDate}T23:59:59`,

    category: "ACADEMIC",
    division: null,

    type: "ACADEMIC",
  }));
};

const convertCalendarEvents = (events: CalendarEvent[]): CalendarEvents[] => {
  return events.map((event) => ({
    id: `notice-${event.noticeId}`,
    noticeId: event.noticeId,

    name: event.name,

    startAt: event.startAt,
    endAt: event.endAt,

    category: event.category,
    division: event.division,

    type: "NOTICE",
  }));
};

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatTime = (dateTime: string) => {
  const time = dateTime.split("T")[1] ?? "00:00";
  const [hours, minutes] = time.split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
};

const formatSelectedDate = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return `${year}년 ${month}월 ${day}일(${weekdays[date.getDay()]})`;
};

const formatShortDate = (dateTime: string) => {
  const [year, month, day] = getDatePart(dateTime).split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return `${day}일(${weekdays[date.getDay()]})`;
};

// 날짜 부분만 추출 (YYYY-MM-DD)
const getDatePart = (dateTime: string) => {
  return dateTime.slice(0, 10);
};

const isEventOnDate = (event: CalendarEvents, dateKey: string) => {
  const startDate = getDatePart(event.startAt);
  const endDate = getDatePart(event.endAt);

  return startDate <= dateKey && dateKey <= endDate;
};

const getEventColor = (event: CalendarEvents) => {
  return event.type === "ACADEMIC" ? "green" : "orange";
};

interface WeekBar {
  event: CalendarEvents;
  startColumn: number;
  endColumn: number;
  lane: number;
  continuesFromPrevious: boolean;
  continuesToNext: boolean;
}

const getWeekBars = (
  weekDates: Date[],
  events: CalendarEvents[],
): WeekBar[] => {
  const weekStart = formatDateKey(weekDates[0]);
  const weekEnd = formatDateKey(weekDates[6]);

  const overlappingEvents = events
    .filter((event) => {
      const start = getDatePart(event.startAt);
      const end = getDatePart(event.endAt);

      return start <= weekEnd && end >= weekStart;
    })
    .sort((a, b) => {
      return a.startAt.localeCompare(b.startAt);
    });

  const occupied: boolean[][] = [];
  const bars: WeekBar[] = [];

  for (const event of overlappingEvents) {
    const start = getDatePart(event.startAt);
    const end = getDatePart(event.endAt);

    // 해당 주에서 시작하는 칸
    const startColumn = weekDates.findIndex(
      (date) => formatDateKey(date) >= start,
    );

    let endColumn = -1;

    for (let i = 0; i < weekDates.length; i++) {
      if (formatDateKey(weekDates[i]) <= end) {
        endColumn = i;
      }
    }

    if (startColumn === -1 || endColumn < startColumn) {
      continue;
    }

    let lane = 0;

    while (true) {
      if (!occupied[lane]) {
        occupied[lane] = Array(7).fill(false);
      }

      const available = occupied[lane]
        .slice(startColumn, endColumn + 1)
        .every((value) => !value);

      if (available) break;

      lane++;
    }

    // 날짜별 사용 위치 기록
    for (let column = startColumn; column <= endColumn; column++) {
      occupied[lane][column] = true;
    }

    bars.push({
      event,
      startColumn,
      endColumn,
      lane,
      continuesFromPrevious: start < weekStart,
      continuesToNext: end > weekEnd,
    });
  }

  return bars;
};

const CalendarPage = () => {
  const navigate = useNavigate();

  const calendarRef = useRef<HTMLDivElement>(null);

  const lastSwipeTime = useRef(0);
  const swipeAmount = useRef(0);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const suppressClick = useRef(false);

  // 기본 학사일정
  const [academicEvents, setAcademicEvents] = useState<CalendarEvents[]>([]);

  // 필터로 조회한 교내 행사
  const [noticeEvents, setNoticeEvents] = useState<CalendarEvents[]>([]);

  // 로딩 상태
  const [isAcademicLoading, setIsAcademicLoading] = useState(false);
  const [isNoticeLoading, setIsNoticeLoading] = useState(false);

  // 에러 상태
  const [academicError, setAcademicError] = useState<string | null>(null);

  const isCalendarLoading = isAcademicLoading || isNoticeLoading;

  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [calendarType, setCalendarType] = useState<CalendarType>("전체");
  const [calendarCollege, setCalendarCollege] = useState("전체");

  const [draftType, setDraftType] = useState<CalendarType>("전체");
  const [draftCollege, setDraftCollege] = useState("전체");

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekCount = Math.max(5, Math.ceil((firstDayOfWeek + daysInMonth) / 7));

  const calendarDays = Array.from({ length: weekCount * 7 }, (_, index) => {
    return new Date(year, month, index - firstDayOfWeek + 1);
  });

  const calendarWeeks = Array.from({ length: weekCount }, (_, index) =>
    calendarDays.slice(index * 7, index * 7 + 7),
  );

  const filteredEvents: CalendarEvents[] = [...academicEvents, ...noticeEvents];

  const selectedEvents = selectedDate
    ? filteredEvents
        .filter((event) => isEventOnDate(event, selectedDate))
        .sort((a, b) => a.startAt.localeCompare(b.startAt))
    : [];

  const isFilterActive = calendarType !== "전체" || calendarCollege !== "전체";

  const changeMonth = (offset: number) => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1),
    );

    setSelectedDate(null);
  };

  // 날짜 선택
  const handleSelectDate = (date: Date) => {
    const clickedYear = date.getFullYear();
    const clickedMonth = date.getMonth();

    if (clickedYear !== year || clickedMonth !== month) {
      setCurrentMonth(new Date(clickedYear, clickedMonth, 1));
    }

    const key = formatDateKey(date);

    setSelectedDate((prev) => (prev === key ? null : key));
  };

  // 필터 열기
  const openFilter = () => {
    setDraftType(calendarType);
    setDraftCollege(calendarCollege);
    setIsFilterOpen(true);
  };

  // 필터 적용
  const applyFilter = () => {
    setCalendarType(draftType);
    setCalendarCollege(draftCollege);
    setIsFilterOpen(false);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0].clientX;
    touchStartY.current = event.changedTouches[0].clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) {
      return;
    }

    const distanceX = event.changedTouches[0].clientX - touchStartX.current;

    const distanceY = event.changedTouches[0].clientY - touchStartY.current;

    // 세로 스크롤보다 가로 스와이프가 확실히 클 때만 처리
    if (Math.abs(distanceX) > 60 && Math.abs(distanceX) > Math.abs(distanceY)) {
      suppressClick.current = true;

      // 왼쪽 → 다음 달 / 오른쪽 → 이전 달
      changeMonth(distanceX < 0 ? 1 : -1);

      window.setTimeout(() => {
        suppressClick.current = false;
      }, 100);
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  useEffect(() => {
    let cancelled = false;

    const fetchAcademicEvents = async () => {
      if (year !== 2026) {
        setAcademicEvents([]);
        return;
      }

      setIsAcademicLoading(true);
      setAcademicError(null);

      try {
        const response = await getAcademicCalendar({
          year,
          month: month + 1,
        });

        if (cancelled) return;

        setAcademicEvents(convertAcademicEvents(response.data ?? []));
      } catch (error) {
        if (cancelled) return;

        console.error("학사일정 조회 실패:", error);

        setAcademicEvents([]);
        setAcademicError("학사일정을 불러오지 못했어요.");
      } finally {
        if (!cancelled) {
          setIsAcademicLoading(false);
        }
      }
    };

    void fetchAcademicEvents();

    return () => {
      cancelled = true;
    };
  }, [year, month]);

  useEffect(() => {
    let cancelled = false;

    const fetchCalendarEvents = async () => {
      // 필터가 모두 '전체'면 교내 행사 조회하지 않음
      if (calendarType === "전체" && calendarCollege === "전체") {
        setNoticeEvents([]);
        setIsNoticeLoading(false);
        return;
      }

      const category = categoryMap[calendarType];

      const division = Division.find(
        (item) => item.name === calendarCollege,
      )?.id;

      console.log("선택한 계열:", calendarCollege);
      console.log("전체 계열 상수:", Division);
      console.log("변환된 계열 ID:", division);

      setIsNoticeLoading(true);

      try {
        const request = {
          year,
          month: month + 1,
          divisions: division ? [division] : [],
          categories: category ? [category] : [],
        };

        // API 요청 데이터 확인
        console.log("📤 캘린더 필터 요청:", request);

        const response = await getCalendar(request);

        if (cancelled) return;

        // API 응답 데이터 확인
        console.log("📥 캘린더 필터 응답:", response.data);

        setNoticeEvents(convertCalendarEvents(response.data ?? []));
      } catch (error) {
        if (cancelled) return;

        console.error("교내 행사 조회 실패:", error);

        setNoticeEvents([]);
      } finally {
        if (!cancelled) {
          setIsNoticeLoading(false);
        }
      }
    };

    void fetchCalendarEvents();

    return () => {
      cancelled = true;
    };
  }, [year, month, calendarType, calendarCollege]);

  useEffect(() => {
    const element = calendarRef.current;

    if (!element) return;

    const handleTrackpadSwipe = (event: WheelEvent) => {
      // 가로 스와이프만 처리
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
        return;
      }

      // 브라우저 기본 가로 스크롤 방지
      if (event.cancelable) {
        event.preventDefault();
      }

      swipeAmount.current += event.deltaX;

      const now = Date.now();

      // 연속 월 이동 방지
      if (now - lastSwipeTime.current < 700) {
        return;
      }

      // 일정 거리 이상 스와이프했을 때 이동
      if (Math.abs(swipeAmount.current) < 40) {
        return;
      }

      lastSwipeTime.current = now;

      if (swipeAmount.current > 0) {
        changeMonth(1);
      } else {
        changeMonth(-1);
      }

      swipeAmount.current = 0;
    };

    element.addEventListener("wheel", handleTrackpadSwipe, {
      passive: false,
    });

    return () => {
      element.removeEventListener("wheel", handleTrackpadSwipe);
    };
  }, []);

  return (
    <main
      className="
        relative flex flex-none flex-col
        w-[calc(100%+40px)] -mx-5 -mt-15
        h-dvh min-h-0 overflow-hidden
        bg-bg font-pretendard
      "
    >
      <header
        className="
    fixed top-0 left-1/2 -translate-x-1/2
    z-30 flex h-11 w-full max-w-120
    items-center justify-center
    bg-bg px-5 py-2.5
  "
      >
        <h1 className="font-pretendard text-[18px] font-semibold text-[#343A40]">
          캘린더
        </h1>

        <button
          type="button"
          onClick={openFilter}
          aria-label="캘린더 필터 열기"
          className={`
      absolute right-5
      flex items-center gap-2
      rounded-[8px] px-2 py-1
      cursor-pointer
      ${
        isFilterActive
          ? "border border-main bg-[#FFEAD7] text-main"
          : "border border-transparent text-[#5C636A]"
      }
    `}
        >
          {isFilterActive ? (
            <FilterOrange className="w-4 h-4 shrink-0" aria-hidden="true" />
          ) : (
            <Filter className="w-4 h-4 shrink-0" aria-hidden="true" />
          )}

          <span className="text-[15px] font-medium">필터</span>
        </button>
      </header>

      <div className="shrink-0 px-5 pt-15 pb-3">
        <h2 className="text-[28px] font-bold leading-none text-[#202124]">
          {month + 1}
        </h2>
      </div>

      <div
        className="
          min-h-0 flex-1 overflow-y-auto
          px-5 pb-[110px]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <div className="grid grid-cols-7 border-t border-l border-[#E5E8EB]">
          {weekdays.map((day, index) => (
            <div
              key={day}
              className="
                flex h-[25px] items-center
                border-r border-b border-[#E5E8EB]
                bg-[#F5F6F8]
                px-1
              "
            >
              <span
                className={`
                  text-[12px]
                  ${
                    index === 0
                      ? "text-[#FF625D]"
                      : index === 6
                        ? "text-[#5B9DFF]"
                        : "text-[#868E96]"
                  }
                `}
              >
                {day}
              </span>
            </div>
          ))}
        </div>

        {isCalendarLoading && (
          <div
            role="status"
            className="
      flex items-center justify-center
      py-10
    "
          >
            <LoadingSpinner />
          </div>
        )}

        {academicError && (
          <p role="alert" className="mt-3 text-center text-[14px] text-error">
            {academicError}
          </p>
        )}

        <div
          ref={calendarRef}
          className="
    bg-white
    overscroll-x-none
    touch-pan-y
  "
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {calendarWeeks.map((weekDates, weekIndex) => {
            const weekBars = getWeekBars(weekDates, filteredEvents);

            const laneCount =
              weekBars.length > 0
                ? Math.max(...weekBars.map((bar) => bar.lane)) + 1
                : 0;

            const rowHeight = Math.max(84, 30 + laneCount * 22 + 8);

            return (
              <div
                key={`${year}-${month}-${weekIndex}`}
                className="relative"
                style={{ height: `${rowHeight}px` }}
              >
                <div className="grid h-full grid-cols-7">
                  {weekDates.map((date) => {
                    const dateKey = formatDateKey(date);

                    const isCurrentMonth =
                      date.getMonth() === month && date.getFullYear() === year;

                    const isSelected = selectedDate === dateKey;

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        onClick={() => handleSelectDate(date)}
                        aria-label={`${formatSelectedDate(dateKey)} 선택`}
                        aria-pressed={isSelected}
                        className={`
                  flex min-w-0 flex-col
                  items-start px-1 pt-1.5
                  text-left cursor-pointer border
                  ${
                    isSelected
                      ? "border-[#F36B0A] bg-[#FFEAD7]"
                      : "border-transparent bg-white"
                  }
                `}
                      >
                        <span
                          className={`
                    text-[14px] leading-5
                    ${isCurrentMonth ? "text-[#202124]" : "text-[#ADB5BD]"}
                  `}
                        >
                          {date.getDate()}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {weekBars.map((bar) => {
                    const color = getEventColor(bar.event);

                    return (
                      <div
                        key={bar.event.id}
                        className={`
    absolute
    h-[18px]
    min-w-0
    overflow-hidden
    px-1
    text-[10px]
    leading-[18px]
    whitespace-nowrap
    text-white
    box-border
    ${color === "green" ? "bg-[#22B85A]" : "bg-main"}
    ${bar.continuesFromPrevious ? "rounded-l-none" : "rounded-l-[3px]"}
    ${bar.continuesToNext ? "rounded-r-none" : "rounded-r-[3px]"}
  `}
                        style={{
                          left: `${(bar.startColumn / 7) * 100}%`,
                          width: `${
                            ((bar.endColumn - bar.startColumn + 1) / 7) * 100
                          }%`,
                          top: `${30 + bar.lane * 22}px`,
                        }}
                      >
                        <span className="block w-full truncate">
                          {bar.event.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <section className="mt-5">
            <h2
              className="
        mb-3 text-[18px]
        font-semibold text-[#202124]
      "
            >
              {formatSelectedDate(selectedDate)}
            </h2>

            {selectedEvents.length > 0 ? (
              <div className="flex flex-col gap-3">
                {selectedEvents.map((event) => {
                  const startDate = getDatePart(event.startAt);
                  const endDate = getDatePart(event.endAt);

                  const isStartingDay = selectedDate === startDate;
                  const isEndingDay = selectedDate === endDate;

                  const color = getEventColor(event);

                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => {
                        if (event.type === "NOTICE" && event.noticeId != null) {
                          navigate(`/event-detail/${event.noticeId}`);
                        }
                      }}
                      className="
                flex w-full items-center
                gap-4 rounded-[12px]
                bg-[#E9ECEF]
                px-3 py-3
                text-left cursor-pointer
              "
                    >
                      <div className="flex w-[72px] shrink-0 flex-col gap-1">
                        <span className="text-[13px] text-[#343A40]">
                          {isStartingDay
                            ? formatTime(event.startAt)
                            : formatShortDate(event.startAt)}
                        </span>

                        <span className="text-[12px] text-[#868E96]">
                          {isEndingDay
                            ? formatTime(event.endAt)
                            : formatShortDate(event.endAt)}
                        </span>
                      </div>

                      <span
                        className={`
                  h-9 w-[2px] shrink-0
                  ${color === "green" ? "bg-[#22B85A]" : "bg-main"}
                `}
                      />

                      <span
                        className="
                  min-w-0 flex-1
                  text-[15px] font-semibold
                  text-[#343A40]
                "
                      >
                        {event.name}
                      </span>

                      <RightArrow
                        className="h-4 w-4 shrink-0 text-[#343A40]"
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="py-5 text-center text-[14px] text-[#868E96]">
                선택한 날짜에 일정이 없어요.
              </p>
            )}
          </section>
        )}
      </div>

      <BottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="캘린더 필터"
        initialHeight={0.65}
        footer={
          <button
            type="button"
            onClick={applyFilter}
            className="
              h-[52px] w-full
              rounded-xl bg-main
              text-white font-semibold
              cursor-pointer
            "
          >
            적용
          </button>
        }
      >
        <div className="flex flex-col gap-6">
          <section>
            <h3 className="mb-4 text-[16px] font-semibold text-[#343A40]">
              유형
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {calendarTypes.map((type) => {
                const isSelected = draftType === type;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDraftType(type)}
                    aria-pressed={isSelected}
                    className={`
                      flex h-[40px] min-w-0 w-full
                      items-center justify-center
                      rounded-[10px] border px-1
                      whitespace-nowrap
                      text-[14px] font-normal
                      cursor-pointer
                      ${
                        isSelected
                          ? "border-[#F36B0A] bg-[#FFEAD7] text-[#F36B0A]"
                          : "border-transparent bg-[#E9ECEF] text-[#5C636A]"
                      }
                    `}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-[16px] font-semibold text-[#343A40]">
              학과 계열
            </h3>

            <div className="flex flex-col gap-1">
              {["전체", ...majorOptions].map((college) => {
                const isSelected = draftCollege === college;

                return (
                  <button
                    key={college}
                    type="button"
                    onClick={() => setDraftCollege(college)}
                    aria-pressed={isSelected}
                    className="
                      flex min-h-[46px] w-full
                      items-center gap-3
                      py-2 text-left
                      cursor-pointer
                    "
                  >
                    <span
                      className={`
                        flex h-6 w-6 min-w-6 shrink-0
                        items-center justify-center
                        rounded-full border-2
                        ${
                          isSelected
                            ? "border-main bg-main"
                            : "border-[#CED4DA] bg-white"
                        }
                      `}
                    >
                      {isSelected && (
                        <span className="h-3 w-3 rounded-full bg-white" />
                      )}
                    </span>

                    <span className="min-w-0 text-[16px] text-[#343A40]">
                      {college}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </BottomSheet>

      <NavBar />
    </main>
  );
};

export default CalendarPage;
