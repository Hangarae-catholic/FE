import { useNavigate } from "react-router-dom";

import Calendar from "../../assets/icons/calendar.svg?react";
import Location from "../../assets/icons/marker.svg?react";
import RightArrow from "../../assets/icons/arrow_right.svg?react";

import type { EventRecommend } from "../../types/events";
import { buildingCoordinates } from "../../constants/BUILDING_COORDINATES";

interface MyEventCardProps {
  event: EventRecommend;
}

const formatEventDate = (date: string | Date) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "-";

  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).format(parsed);
};

const getBuildingName = (id: string) => {
  return buildingCoordinates.find((building) => building.id === id)?.name ?? id;
};

const MyEventCard = ({ event }: MyEventCardProps) => {
  const navigate = useNavigate();

  const image = event.imageUrls?.[0];

  const isApproved = event.approved === true;

  return (
    <button
      type="button"
      onClick={() => navigate(`/event-detail/${event.noticeId}`)}
      className="
        flex items-center gap-4
        w-full
        rounded-[20px]
        bg-white
        px-5 py-4
        text-left
        cursor-pointer
        transition-colors duration-200
        active:bg-gray-50
      "
    >
      {image && (
        <img
          src={image}
          alt=""
          className="
            w-[90px] h-[120px]
            shrink-0
            rounded-[10px]
            object-cover
          "
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div>
          <span
            className={`
              inline-flex
              items-center justify-center
              rounded-full
              px-3 py-1
              text-[13px]
              font-medium
              ${
                isApproved
                  ? "bg-[#DAF6DF] text-[#0D8D3D]"
                  : "bg-[#DEE2E6] text-[#868E96]"
              }
            `}
          >
            {isApproved ? "승인" : "승인대기"}
          </span>
        </div>

        <h2
          className="
            truncate
            text-[17px]
            font-semibold
            text-[#343A40]
          "
        >
          {event.name}
        </h2>

        <div className="flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 shrink-0 text-gray-600" />

          <span
            className="
              truncate
              text-[14px]
              text-[#6C757D]
            "
          >
            {formatEventDate(event.startAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Location className="w-4.5 h-4.5 shrink-0 text-gray-600" />

          <span
            className="
    truncate
    text-[14px]
    text-[#6C757D]
  "
          >
            {getBuildingName(event.location)}
          </span>
        </div>
      </div>

      <RightArrow className="w-5 h-5 shrink-0 text-gray-700" />
    </button>
  );
};

export default MyEventCard;
