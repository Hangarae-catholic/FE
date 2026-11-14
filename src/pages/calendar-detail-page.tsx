import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getEventCalendarFile, getEventDetail } from "../apis/events";
import type { EventDetail } from "../types/events";

import { buildingCoordinates } from "../constants/BUILDING_COORDINATES";
import { Department } from "../constants/DEPARTMENT";

import TopBar from "../components/common/TopBar";
import LoadingSpinner from "../components/common/LoadingSpinner";

import CalendarPlus from "../assets/icons/calendar_plus.svg?react";
import Calendar from "../assets/icons/calendar-calendar.svg?react";
import Marker from "../assets/icons/location-calendar.svg?react";
import Member from "../assets/icons/member-calendar.svg?react";
import Link from "../assets/icons/link.svg?react";
import Download from "../assets/icons/download-check.svg?react";

// 날짜 포맷
const formatDateTime = (dateTime: string | Date) => {
  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) return "-";

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[date.getDay()];

  const hour = date.getHours();
  const minute = date.getMinutes();

  const time =
    minute === 0
      ? `${hour}시`
      : `${hour}시 ${String(minute).padStart(2, "0")}분`;

  return `${year}.${month}.${day}(${weekday}) ${time}`;
};

// 행사 기간
const formatPeriod = (startAt: string | Date, endAt: string | Date) => {
  return `${formatDateTime(startAt)} - ${formatDateTime(endAt)}`;
};

// 건물 이름 변환
const getLocationName = (location: string) => {
  return (
    buildingCoordinates.find((building) => building.id === location)?.name ??
    location
  );
};

// 학부 이름 변환
const getDepartmentName = (department: string) => {
  return Department.find((item) => item.id === department)?.name ?? department;
};

const CalendarDetailPage = () => {
  const navigate = useNavigate();
  const { noticeId, postId } = useParams();

  const eventId = Number(noticeId ?? postId);

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // 행사 상세 조회
  useEffect(() => {
    let cancelled = false;

    const fetchEventDetail = async () => {
      if (!Number.isSafeInteger(eventId) || eventId <= 0) {
        setError("올바르지 않은 행사 번호예요.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        setEvent(null);

        const response = await getEventDetail(eventId);

        if (cancelled) return;

        if (!response.data) {
          throw new Error("행사 상세 데이터가 없습니다.");
        }

        setEvent(response.data);
      } catch (error) {
        if (cancelled) return;

        console.error("행사 상세 조회 실패:", error);
        setError("행사 정보를 불러오지 못했어요.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchEventDetail();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  // 토스트 자동 닫기
  useEffect(() => {
    if (!showToast) return;

    const timeout = window.setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [showToast]);

  // 일정 다운로드
  const handleDownload = async () => {
    if (!event || isDownloading) return;

    setIsDownloading(true);

    try {
      const blob = await getEventCalendarFile(event.noticeId);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `hangarae-event-${event.noticeId}.ics`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setShowToast(true);
    } catch (error) {
      console.error("일정 파일 다운로드 실패:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // 로딩
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 에러 및 데이터 없음
  if (error || !event) {
    return (
      <main
        className="
          w-[calc(100%+40px)] -mx-5 -mt-15
          flex h-dvh flex-col bg-bg font-pretendard
        "
      >
        <TopBar title="행사 상세" />

        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-[16px] text-[#868E96]">
            {error ?? "행사 정보를 찾을 수 없어요."}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[14px] font-semibold text-main"
          >
            이전 화면으로 돌아가기
          </button>
        </div>
      </main>
    );
  }

  // 행사 정보
  const infoItems = [
    {
      icon: Calendar,
      label: "기간",
      value: formatPeriod(event.startAt, event.endAt),
    },
    {
      icon: Marker,
      label: "장소",
      value: getLocationName(event.location),
    },
    {
      icon: Member,
      label: "담당 기관 및 부서",
      value:
        [
          event.responsible,
          event.department ? getDepartmentName(event.department) : null,
        ]
          .filter(Boolean)
          .join(" · ") || "-",
    },
  ];

  return (
    <main
      className="
        relative flex flex-none flex-col
        w-[calc(100%+40px)] -mx-5 -mt-15
        h-dvh min-h-0 overflow-hidden
        bg-bg font-pretendard
      "
    >
      <TopBar
        title={event.name}
        rightIcon={CalendarPlus}
        rightOnClick={handleDownload}
      />

      <div
        className="
          min-h-0 flex-1 overflow-y-auto
          px-5 pt-20 pb-12
          [&::-webkit-scrollbar]:hidden
        "
      >
        {/* 행사 제목 */}
        <h2 className="mb-7 text-[18px] font-semibold leading-[1.4] text-[#343A40]">
          {event.name}
        </h2>

        {/* 행사 정보 */}
        <div className="flex flex-col gap-6">
          {infoItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="flex items-start gap-4">
                <div className="mt-2 shrink-0 text-[#8F9AA3]">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-[14px] text-[#5C636A]">
                    {item.label}
                  </p>

                  <p className="break-words text-[16px] font-medium leading-6 text-[#343A40]">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}

          {event.url && (
            <div className="flex items-start gap-4">
              <div className="mt-2 shrink-0 text-[#8F9AA3]">
                <Link className="h-5.5 w-5.5" />
              </div>

              <div className="min-w-0 flex-1 ml-0.5">
                <p className="mb-1 text-[14px] text-[#6C757D]">관련 링크</p>

                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    block truncate text-[16px]
                    font-medium text-[#343A40]
                    underline underline-offset-2
                  "
                >
                  {event.url}
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="my-7 h-px w-full bg-[#DEE2E6]" />

        {/* 세부 내용 */}
        <section>
          <h3 className="mb-3 text-[14px] font-medium text-[#343A40]">
            세부 내용
          </h3>

          <p
            className="
              whitespace-pre-line break-words
              text-[14px] leading-6 text-[#5C636A]
            "
          >
            {event.information
              ? event.information.replace(/<br\s*\/?>/gi, "\n")
              : "등록된 행사 내용이 없어요."}
          </p>
        </section>
      </div>

      {showToast && (
        <div
          role="status"
          className="
            fixed top-[74px] left-1/2 z-50
            flex w-[calc(100%-40px)] max-w-[440px]
            -translate-x-1/2 items-center gap-3
            rounded-full bg-[#343A40]
            px-5 py-3 text-white shadow-md
          "
        >
          <div className="shrink-0">
            <Download className="w-6 h-6" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium">
              일정 파일을 다운로드했어요!
            </p>

            <p className="mt-0.5 text-[11px] font-normal">
              파일을 열어 기기 캘린더에 등록할 수 있어요.
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default CalendarDetailPage;
