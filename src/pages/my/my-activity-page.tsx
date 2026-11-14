import { useEffect, useState } from "react";

import TopBar from "../../components/common/TopBar";
import CategoryGroup from "../../components/TeamMatch/Category/Category";
import TeamCard from "../../components/TeamMatch/TeamCard";
import MyEventCard from "../../components/AddEventPage/MyEventCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import Capybara from "../../assets/images/capy_face_surprise.svg?react";
import type { TeamRecruitPost } from "../../types/team";
import type { EventRecommend } from "../../types/events";

import { CATEGORIES } from "../../constants/CATEGORY";
import { getMyTeamPosts } from "../../apis/team";
import { getMyEvent } from "../../apis/events";

type ActivityTab = "team" | "event";

const MyActivityPage = () => {
  const [myTeams, setMyTeams] = useState<TeamRecruitPost[]>([]);
  const [myEvents, setMyEvents] = useState<EventRecommend[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ActivityTab>(() => {
    const savedTab = sessionStorage.getItem("myActivityTab");

    return savedTab === "event" ? "event" : "team";
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  useEffect(() => {
    let cancelled = false;

    const fetchMyActivities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [teamsResponse, eventsResponse] = await Promise.all([
          getMyTeamPosts(),
          getMyEvent(),
        ]);

        if (cancelled) return;

        setMyTeams(teamsResponse.data ?? []);
        setMyEvents(eventsResponse.data ?? []);
      } catch (error) {
        if (cancelled) return;

        console.error("나의 활동 조회 실패:", error);

        setError("활동 내역을 불러오지 못했어요.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchMyActivities();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTeams = myTeams.filter((team) => {
    if (selectedCategory === "전체") return true;

    const category = CATEGORIES.find((item) => item.id === team.category);

    return category?.type === selectedCategory;
  });

  const handleTabChange = (tab: ActivityTab) => {
    setActiveTab(tab);
    sessionStorage.setItem("myActivityTab", tab);
    setSelectedCategory("전체");
  };

  const renderEmptyState = (message: string) => (
    <div
      className="
        flex min-h-0 flex-1
        flex-col items-center justify-center
        gap-4 px-5 pb-12
      "
    >
      <Capybara className="w-[110px] h-auto" aria-hidden="true" />

      <p
        className="
          text-center
          text-[16px] font-medium
          text-[#5C636A]
        "
      >
        {message}
      </p>
    </div>
  );

  return (
    <main
      className="
        relative flex flex-none flex-col
        w-[calc(100%+40px)] -mx-5 -mt-15
        h-dvh min-h-0 overflow-hidden
        bg-bg font-pretendard
      "
    >
      <TopBar title="나의 활동" />

      <div className="shrink-0 pt-15">
        <div
          role="tablist"
          aria-label="나의 활동 종류"
          className="
            grid grid-cols-2
            w-full h-[50px]
            border-b border-[#DEE2E6]
          "
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "team"}
            onClick={() => handleTabChange("team")}
            className={`
              relative
              flex items-center justify-center
              h-full
              text-[17px] font-semibold
              cursor-pointer
              ${activeTab === "team" ? "text-main" : "text-[#868E96]"}
            `}
          >
            팀 매칭
            {activeTab === "team" && (
              <span
                className="
                  absolute bottom-[-1px] left-0
                  w-full h-[2px] bg-main
                "
              />
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "event"}
            onClick={() => handleTabChange("event")}
            className={`
              relative
              flex items-center justify-center
              h-full
              text-[17px] font-semibold
              cursor-pointer
              ${activeTab === "event" ? "text-main" : "text-[#868E96]"}
            `}
          >
            교내 행사
            {activeTab === "event" && (
              <span
                className="
                  absolute bottom-[-1px] left-0
                  w-full h-[2px] bg-main
                "
              />
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div
          className="
            flex flex-1 flex-col
            items-center justify-center gap-3
          "
        >
          <p className="text-[15px] text-gray-600">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="
              text-[14px] font-medium
              text-main underline
              cursor-pointer
            "
          >
            다시 시도하기
          </button>
        </div>
      ) : activeTab === "team" ? (
        <>
          <div className="shrink-0 px-5">
            <CategoryGroup
              selected={selectedCategory}
              setSelected={setSelectedCategory}
            />
          </div>

          {filteredTeams.length > 0 ? (
            <div
              className="
                min-h-0 flex-1
                overflow-y-auto
                px-5 pb-8
                [&::-webkit-scrollbar]:hidden
              "
            >
              <p className="mb-3 text-[14px] text-[#6C757D]">
                작성한 팀 매칭 글이{" "}
                <span className="font-medium text-[#343A40]">
                  {filteredTeams.length}개
                </span>{" "}
                있어요.
              </p>

              <div className="flex flex-col gap-4">
                {filteredTeams.map((team) => (
                  <TeamCard
                    key={team.teamId}
                    id={team.teamId}
                    image={team.imageUrl}
                    title={team.title}
                    content={team.detail}
                    startDate={new Date(team.startAt)}
                    endDate={new Date(team.endAt)}
                    writerName={team.userName}
                    writerMajor={team.department}
                    writerStatus={team.studentStatus}
                    limitMember={team.maxMember}
                    currentMember={team.maxMember - team.remainingMember}
                    category={team.category}
                    status={team.teamStatus}
                  />
                ))}
              </div>
            </div>
          ) : (
            renderEmptyState("작성한 팀 모집글이 없어요.")
          )}
        </>
      ) : (
        <>
          {myEvents.length > 0 ? (
            <div
              className="
      min-h-0 flex-1
      overflow-y-auto
      px-5 pt-5 pb-8
      [&::-webkit-scrollbar]:hidden
    "
            >
              <div className="flex flex-col gap-4">
                {myEvents.map((event) => (
                  <MyEventCard key={event.noticeId} event={event} />
                ))}
              </div>
            </div>
          ) : (
            renderEmptyState("등록한 행사가 없어요.")
          )}
        </>
      )}
    </main>
  );
};

export default MyActivityPage;
