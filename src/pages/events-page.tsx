import { useEffect, useRef, useState } from 'react';
import TopBar from '../components/common/TopBar';
import MapIcon from '/src/assets/icons/map.svg?react';
import List from '/src/assets/icons/list.svg?react';
import ListDateDropdown from '../components/EventsPage/List/DateDropDown';
import MapDateDropdown from '../components/EventsPage/Map/DateDropDown';
import SwitchOn from '/src/assets/icons/switch_on.svg?react';
import SwitchOff from '/src/assets/icons/switch_off.svg?react';
import Capybara from '/src/assets/images/capy_face_surprise.svg?react';
import EventCard from '../components/EventsPage/Map/EventCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import EventListCard from '../components/AddEventPage/EventCard';
import MiniMap from '../components/HomePage/MiniMap';
import { buildingCoordinates } from '../constants/BUILDING_COORDINATES';
import type { EventLikeResponse, EventRetreiveResponse } from '../types/events';
import { getEventLikes, getEventRetreive, postEventLikes } from '../apis/events';
import LoadingSpinner from '../components/common/LoadingSpinner';

export interface Event {
  id: number;
  recommend: number;
  unrecommend: number;
  image: string;
  location: string;
  title: string;
  date: string;
  content: string;
  liked?: boolean;
  disLiked?: boolean;
}

export default function EventsPage() {
  const [isMap, setIsMap] = useState(true);
  const [selectedListDate, setSelectedListDate] = useState<[Date | null, Date | null]>([new Date(), null]);
  const [selectedMapDate, setSelectedMapDate] = useState<Date | null>(new Date());
  const [switchOn, setSwitchOn] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showEventCard, setShowEventCard] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  const [Events, setEvents] = useState<EventRetreiveResponse>();
  const [eventLoading, setEventLoading] = useState(true);

  const [eventsLikes, setEventLikes] = useState<EventLikeResponse>();
  const [eventLikesLoading, setEventLikesLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventLoading(true);

        const data = await getEventRetreive();

        setEvents(data);
      } catch (error) {
        console.error('행사 목록 조회 실패:', error);
      } finally {
        setEventLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });
  }, []);

  // 목록 날짜 비교
  // 선택한 날짜가 행사 시작일 ~ 종료일 사이에 포함되는지 확인
  const isEventInDateRange = (eventStartAt: Date | string, eventEndAt: Date | string, selectedStartDate: Date | null, selectedEndDate: Date | null) => {
    if (!selectedStartDate) return true;

    const eventStart = new Date(eventStartAt);
    eventStart.setHours(0, 0, 0, 0);

    const eventEnd = new Date(eventEndAt);
    eventEnd.setHours(23, 59, 59, 999);

    const selectedStart = new Date(selectedStartDate);
    selectedStart.setHours(0, 0, 0, 0);

    const selectedEnd = new Date(selectedEndDate ?? selectedStartDate);
    selectedEnd.setHours(23, 59, 59, 999);

    // 행사 기간과 선택한 날짜 범위가 겹치는지 확인
    return eventStart <= selectedEnd && eventEnd >= selectedStart;
  };

  // 승인된 행사만 필터링
  const approvedEvents = Events?.data?.filter((event) => event.approved === true) ?? [];

  // 지도 건물명 / 날짜 필터링
  // 선택한 날짜에 해당하는 전체 행사
  const filteredEvents = approvedEvents?.filter((event) => isEventInDateRange(event.startAt, event.endAt, selectedMapDate, selectedMapDate)) ?? [];

  // 클릭한 건물에 해당하는 행사
  const selectedBuildingEvents = filteredEvents.filter((event) => {
    if (!selectedBuilding) return false;

    const buildingId = buildingCoordinates.find((building) => building.name === selectedBuilding)?.id;

    return event.location === buildingId;
  });

  const swiperRef = useRef<SwiperType | null>(null);

  const handleSwitch = () => {
    setSwitchOn((prev) => {
      const next = !prev;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (next) {
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 6);

        setSelectedListDate([today, endDate]);
      } else {
        setSelectedListDate([today, today]);
      }

      return next;
    });
  };

  // 목록 날짜 필터링
  const filteredListEvents = Events?.data?.filter((event) => isEventInDateRange(event.startAt, event.endAt, selectedListDate[0], switchOn ? selectedListDate[1] : selectedListDate[0])) ?? [];

  const fetchEventLikes = async (noticeId: number) => {
    try {
      setEventLikesLoading(true);

      const data = await getEventLikes(noticeId);

      setEventLikes(data);
    } catch (error) {
      console.error('행사 추천수 조회 실패:', error);
    } finally {
      setEventLikesLoading(false);
    }
  };

  const handleEventReaction = async (noticeId: number, type: 'LIKE' | 'DISLIKE') => {
    try {
      setEventLikesLoading(true);

      // 1. 추천 / 비추천 등록
      await postEventLikes(noticeId, type);

      // 2. 등록 성공 후 최신 추천 정보 조회
      const data = await getEventLikes(noticeId);

      // 3. 최신 정보 반영
      setEventLikes(data);
    } catch (error) {
      console.error('행사 추천/비추천 등록 실패:', error);
    } finally {
      setEventLikesLoading(false);
    }
  };

  // 로딩 스피너
  if (eventLoading) {
    return <LoadingSpinner />;
  }

  return isMap ? (
    <>
      <div className='flex h-dvh flex-col overflow-hidden'>
        <TopBar title='행사 지도' rightIcon={List} rightBtnName='목록' rightOnClick={() => setIsMap(false)} />

        <div className='relative flex-1 min-h-0 w-full'>
          <div className='absolute top-4 left-5 z-20'>
            <MapDateDropdown
              value={selectedMapDate}
              onChange={(date: Date | null) => {
                setSelectedMapDate(date);
              }}
              isDateSelected={!!selectedMapDate}
            />
          </div>

          <MiniMap
            buildingNames={buildingCoordinates.map((bc) => bc.name)}
            // 마커 클릭
            clickMarker={(buildingName) => {
              const buildingId = buildingCoordinates.find((building) => building.name === buildingName)?.id;

              const selectedEvents = filteredEvents.filter((event) => event.location === buildingId);

              setSelectedBuilding(buildingName);
              setCurrentSlide(1);
              setShowEventCard(true);

              if (selectedEvents.length > 0) {
                fetchEventLikes(selectedEvents[0].noticeId);
              } else {
                setEventLikes(undefined);
              }
            }}
            events={filteredEvents}
          />
        </div>
      </div>

      {showEventCard && (
        <div className='fixed bottom-8 left-0 right-0 mx-auto w-full max-w-120 px-5'>
          {selectedBuildingEvents.length > 1 ? (
            <Swiper
              key={selectedBuilding}
              initialSlide={0}
              spaceBetween={10}
              slidesPerView={1}
              className='w-full'
              onSlideChange={(swiper) => {
                setCurrentSlide(swiper.realIndex + 1);

                const currentEvent = selectedBuildingEvents[swiper.realIndex];

                if (currentEvent) {
                  fetchEventLikes(currentEvent.noticeId);
                }
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
            >
              {selectedBuildingEvents.map((event) => {
                return (
                  <SwiperSlide key={event.noticeId}>
                    <EventCard
                      id={event.noticeId}
                      title={event.name}
                      recommend={eventsLikes?.data?.likeCount}
                      unrecommend={eventsLikes?.data?.dislikeCount}
                      image={event.imageUrls}
                      location={buildingCoordinates.find((bc) => bc.id === event.location)?.name}
                      startDate={event.startAt}
                      endDate={event.endAt}
                      content={event.summary}
                      setCurrentSlide={setCurrentSlide}
                      currentSlide={currentSlide}
                      eventsNum={selectedBuildingEvents.length}
                      onSlideChange={(index) => swiperRef.current?.slideTo(index)}
                      userReaction={eventsLikes?.data?.userReaction ?? null}
                      onReact={(reaction) => handleEventReaction(event.noticeId, reaction)}
                      onClose={setShowEventCard}
                      isLoading={eventLikesLoading}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : selectedBuildingEvents.length === 1 ? (
            <EventCard
              id={selectedBuildingEvents[0].noticeId}
              title={selectedBuildingEvents[0].name}
              recommend={eventsLikes?.data?.likeCount}
              unrecommend={eventsLikes?.data?.dislikeCount}
              image={selectedBuildingEvents[0].imageUrls}
              location={buildingCoordinates.find((bc) => bc.id === selectedBuildingEvents[0].location)?.name}
              startDate={selectedBuildingEvents[0].startAt}
              endDate={selectedBuildingEvents[0].endAt}
              content={selectedBuildingEvents[0].summary}
              userReaction={eventsLikes?.data?.userReaction ?? null}
              onReact={(reaction) => handleEventReaction(selectedBuildingEvents[0].noticeId, reaction)}
              onClose={setShowEventCard}
              isLoading={eventLikesLoading}
            />
          ) : null}
        </div>
      )}
    </>
  ) : (
    <div className='px-5'>
      <TopBar title='행사 목록' rightIcon={MapIcon} rightBtnName='지도' rightOnClick={() => setIsMap(true)} />
      {/* 날짜 선택 버튼 */}
      <div className='flex gap-2.5 items-center w-full flex-1 min-w-0'>
        <ListDateDropdown
          value={selectedListDate}
          onChange={(date) => {
            if (Array.isArray(date)) {
              setSelectedListDate(date);
            } else {
              setSelectedListDate([date, date]);
            }
          }}
          isDateSelected={!!selectedListDate[0]}
          isRange={switchOn}
        />

        <div className='flex shrink-0 items-center gap-1.5'>
          <span className='font-pretendard font-normal text-sm text-gray-800'>1주일 내 행사</span>
          <button type='button' onClick={handleSwitch}>
            {switchOn ? <SwitchOn className='rounded-full' /> : <SwitchOff className='border border-gray-300 rounded-full' />}
          </button>
        </div>
      </div>

      {filteredListEvents.length > 0 ? (
        filteredListEvents.map((event) => (
          <div key={event.noticeId} className='mt-6 flex flex-col gap-4'>
            <EventListCard id={event.noticeId} image={event.imageUrls} title={event.name} location={buildingCoordinates.find((bc) => bc.id === event.location)?.name} startDate={event.startAt} endDate={event.endAt} likeCount={eventsLikes?.data?.likeCount} dislikeCount={eventsLikes?.data?.dislikeCount} />
          </div>
        ))
      ) : (
        <div className='flex flex-col items-center justify-center py-25 gap-3.5'>
          <Capybara className='w-25' />
          <p className='font-pretendard font-medium text-base text-gray-700'>선택한 날짜에 등록된 행사가 없어요.</p>
        </div>
      )}
    </div>
  );
}
