import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TopBar from "../components/common/TopBar";
import TeamCard from "../components/TeamMatch/TeamCard";
import TeamImage from "../assets/images/event-detail_ex.png";
import CalendarPlus from "../assets/icons/calendar_plus.svg?react";
import Calendar from "../assets/icons/calendar-calendar.svg?react";
import Marker from "../assets/icons/location-calendar.svg?react";
import Member from "../assets/icons/member-calendar.svg?react";
import Link from "../assets/icons/link.svg?react";
import Download from "../assets/icons/download-check.svg?react";

interface CalendarDetail {
  noticeId: number;
  name: string;
  startAt: string;
  endAt: string;
  location: string;
  department: string;
  link: string | null;
  content: string;
}

// 관련 팀 매칭 게시글 타입
interface RelatedTeam {
  id: number;
  image: string;
  title: string;
  content: string;
  date: string;
  writerName: string;
  writerMajor: string;
  writerGrage: number;
  limitMember: number;
  currentMember: number;
  category: string;
}

// TODO: 실제 상세 조회 API로 교체
const mockDetails: Record<number, CalendarDetail> = {
  1: {
    noticeId: 1,
    name: "컴퓨터정보공학부 학술제",
    startAt: "2026-11-24T14:00:00",
    endAt: "2026-11-24T18:00:00",
    location: "김수환관(K) 컨퍼런스홀",
    department: "컴퓨터정보공학부",
    link: "https://csie.catholic.ac.kr/csie/community",
    content: `안녕하세요! 컴퓨터정보공학부 학생회 연아입니다!
이번 2026 학술제는 COMA, UMC, 멋쟁이사자처럼과 함께 진행합니다! 많은 관심 부탁드립니다!

학술제 일정은 다음과 같습니다.
12:00 - 14:00 본선 진출 팀 부스 세팅
14:00 - 18:00 팀별 성과와 소개 발표
18:30 시상자 발표 및 폐회`,
  },
  2: {
    noticeId: 2,
    name: "정보통신전자공학부 학술제",
    startAt: "2026-11-24T13:00:00",
    endAt: "2026-11-25T18:00:00",
    location: "니콜스관(N) 302호",
    department: "정보통신전자공학부",
    link: "https://csie.catholic.ac.kr/csie/community",
    content: `안녕하세요! 정보통신전자공학부 학술제 안내입니다.

학술제 기간 동안 다양한 프로젝트와 연구 성과를 발표합니다.
많은 참여 부탁드립니다.`,
  },
  3: {
    noticeId: 3,
    name: "2학기 수강신청",
    startAt: "2026-11-02T09:00:00",
    endAt: "2026-11-04T18:00:00",
    location: "온라인",
    department: "학사지원팀",
    link: null,
    content: "2학기 수강신청 기간입니다.",
  },
};

// TODO: 관련 팀 매칭 조회 API로 교체
const mockRelatedTeams: Record<number, RelatedTeam[]> = {
  1: [
    {
      id: 101,
      image: TeamImage,
      title: "컴퓨터공학부 학술제",
      content: "학술제 같이 나가실 분 구해요! 성실히 참여하실 분",
      date: "26.11.04. ~ 26.11.08",
      writerName: "정다민",
      writerMajor: "미디어기술콘텐츠학부",
      writerGrage: 4,
      limitMember: 6,
      currentMember: 2,
      category: "공모전·대회",
    },
    {
      id: 102,
      image: TeamImage,
      title: "컴퓨터공학부 학술제",
      content: "학술제에 함께 참여할 팀원을 모집합니다.",
      date: "26.11.04. ~ 26.11.08",
      writerName: "정다민",
      writerMajor: "미디어기술콘텐츠학부",
      writerGrage: 4,
      limitMember: 6,
      currentMember: 2,
      category: "공모전·대회",
    },
  ],
  2: [],
  3: [],
};

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

const parseDate = (dateTime: string) => {
  const [date, time] = dateTime.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const [hours = 0, minutes = 0] = (time ?? "").split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes);
};

const formatDateTime = (dateTime: string) => {
  const date = parseDate(dateTime);

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = weekdays[date.getDay()];
  const hour = date.getHours();
  const minute = date.getMinutes();

  const time =
    minute === 0
      ? `${hour}시`
      : `${hour}시 ${String(minute).padStart(2, "0")}분`;

  return `${year}.${month}.${day}(${weekday}) ${time}`;
};

const formatPeriod = (startAt: string, endAt: string) => {
  return `${formatDateTime(startAt)} - ${formatDateTime(endAt)}`;
};

const escapeIcsText = (value: string) => {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
};

const toIcsUtc = (dateTime: string) => {
  const utcDate = new Date(`${dateTime}+09:00`);

  return utcDate
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
};

const downloadIcs = (event: CalendarDetail) => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HANGARAE//Calendar//KO",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:notice-${event.noticeId}@hangarae`,
    `DTSTAMP:${new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")}`,
    `DTSTART:${toIcsUtc(event.startAt)}`,
    `DTEND:${toIcsUtc(event.endAt)}`,
    `SUMMARY:${escapeIcsText(event.name)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    `DESCRIPTION:${escapeIcsText(event.content)}`,
    ...(event.link ? [`URL:${event.link}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");

  const blob = new Blob([ics], {
    type: "text/calendar;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `hangarae-event-${event.noticeId}.ics`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const CalendarDetailPage = () => {
  const navigate = useNavigate();
  const { noticeId, postId } = useParams();

  const eventId = Number(noticeId ?? postId);

  const event = mockDetails[eventId];
  const relatedTeams = mockRelatedTeams[eventId] ?? [];

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) return;

    const timeout = window.setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [showToast]);

  const handleDownload = () => {
    if (!event) return;

    try {
      downloadIcs(event);
      setShowToast(true);
    } catch (error) {
      console.error("일정 파일 다운로드 실패:", error);
    }
  };

  if (!event) {
    return (
      <main
        className="
          w-[calc(100%+40px)] -mx-5 -mt-15
          flex h-dvh flex-col bg-bg font-pretendard
        "
      >
        <TopBar />

        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-[16px] text-[#868E96]">
            행사 정보를 찾을 수 없어요.
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

  const infoItems = [
    {
      icon: Calendar,
      label: "기간",
      value: formatPeriod(event.startAt, event.endAt),
    },
    {
      icon: Marker,
      label: "장소",
      value: event.location,
    },
    {
      icon: Member,
      label: "담당 기관 및 부서",
      value: event.department,
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
        <h2 className="mb-7 text-[18px] font-semibold leading-[1.4] text-[#343A40]">
          {event.name}
        </h2>

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

          {event.link && (
            <div className="flex items-start gap-4">
              <div className="mt-2 shrink-0 text-[#8F9AA3]">
                <Link className="h-5.5 w-5.5" />
              </div>

              <div className="min-w-0 flex-1 ml-0.5">
                <p className="mb-1 text-[14px] text-[#6C757D]">관련 링크</p>

                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    block truncate text-[16px]
                    font-medium text-[#343A40]
                    underline underline-offset-2
                  "
                >
                  {event.link}
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="my-7 h-px w-full bg-[#DEE2E6]" />

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
            {event.content}
          </p>
        </section>

        <section className="mt-7">
          <h3 className="mb-4 text-[14px] font-medium text-[#343A40]">
            관련 팀 매칭 게시글
          </h3>

          {relatedTeams.length > 0 ? (
            <div className="flex flex-col gap-3">
              {relatedTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  id={team.id}
                  image={team.image}
                  title={team.title}
                  content={team.content}
                  date={team.date}
                  writerName={team.writerName}
                  writerMajor={team.writerMajor}
                  writerGrage={team.writerGrage}
                  limitMember={team.limitMember}
                  currentMember={team.currentMember}
                  category={team.category}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-[15px] text-[#868E96]">
              관련 팀 매칭 게시글이 없어요.
            </p>
          )}
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
