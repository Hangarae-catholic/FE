import { useNavigate } from "react-router-dom";

import Calendar from "../../assets/icons/calendar.svg?react";
import Marker from "../../assets/icons/marker.svg?react";
import RightArrow from "../../assets/icons/arrow_right.svg?react";
import ThumbsUp from "../../assets/icons/thumbs-up.svg?react";
import ThumbsDown from "../../assets/icons/thumbs-down.svg?react";

type EventStatus = "PENDING" | "APPROVED" | "REJECTED";

interface EventCardProps {
  id: number;
  image?: string | null;
  title: string;
  date: string;
  location: string;
  likeCount: number;
  dislikeCount: number;
  status: EventStatus;
  onClick?: (id: number) => void;
}

const statusStyles: Record<EventStatus, { label: string; className: string }> =
  {
    PENDING: {
      label: "승인대기",
      className: "bg-gray-200 text-gray-600",
    },
    APPROVED: {
      label: "승인",
      className: "bg-[#DAF6DF] text-[#0D8D3D]",
    },
    REJECTED: {
      label: "승인거절",
      className: "bg-[#FFF0F0] text-[#F04438]",
    },
  };

export default function EventCard({
  id,
  image,
  title,
  date,
  location,
  likeCount,
  dislikeCount,
  status,
  onClick,
}: EventCardProps) {
  const navigate = useNavigate();
  const statusInfo = statusStyles[status];

  return (
    <button
      type="button"
      onClick={() => {
        if (onClick) {
          onClick(id);
        } else {
          navigate(`/event-detail/${id}`);
        }
      }}
      className="
        flex w-full items-center gap-3
        rounded-[20px]
        bg-white
        px-5 py-3.5
        text-left
        font-pretendard
        cursor-pointer
      "
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="
            w-22 h-28
            shrink-0
            rounded-sm
            object-cover
          "
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="flex items-center gap-1 text-[13px] text-main">
            <ThumbsUp
              className="w-4 h-4 shrink-0 text-main"
              aria-hidden="true"
            />
            {likeCount}
          </span>

          <span className="flex items-center gap-1 text-[13px] text-gray-600">
            <ThumbsDown
              className="w-4 h-4 shrink-0 text-main"
              aria-hidden="true"
            />
            {dislikeCount}
          </span>

          <span
            className={`
              rounded-full
              px-2.5 py-1
              font-pretendard
              text-xs font-normal
              whitespace-nowrap
              ${statusInfo.className}
            `}
          >
            {statusInfo.label}
          </span>
        </div>

        <h3
          className="
            line-clamp-2
            font-pretendard
            text-base font-medium
            leading-6
            text-[#343A40]
            text-[16px]
            break-keep
          "
        >
          {title}
        </h3>

        <div className="flex min-w-0 items-center gap-1.5">
          <Calendar
            className="w-5 h-5 shrink-0 text-gray-600"
            aria-hidden="true"
          />

          <span
            className="
              min-w-0 truncate
              font-pretendard
              text-[13px]
              text-gray-700
            "
          >
            {date}
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-1.5">
          <Marker
            className="w-5 h-5 shrink-0 text-gray-600"
            aria-hidden="true"
          />

          <span
            className="
              min-w-0 truncate
              font-pretendard
              text-[13px]
              text-gray-700
            "
          >
            {location}
          </span>
        </div>
      </div>

      <RightArrow
        className="w-4 h-4 shrink-0 text-gray-800"
        aria-hidden="true"
      />
    </button>
  );
}
