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
// import ExEventImg from '/src/assets/images/event_ex.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import EventListCard from '../components/AddEventPage/EventCard';
import MiniMap from '../components/HomePage/MiniMap';
import { buildingCoordinates } from '../constants/BUILDING_COORDINATES';
import type { EventRetreiveResponse } from '../types/events';
import { getEventRetreive } from '../apis/events';

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
  const [likeStates, setLikeStates] = useState<Record<number, boolean>>({});
  const [disLikeStates, setDisLikeStates] = useState<Record<number, boolean>>({});
  const [showEventCard, setShowEventCard] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  const [Events, setEvents] = useState<EventRetreiveResponse>();
  const [eventLoading, setEventLoading] = useState(true);

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

  // 지도 건물명 / 날짜 필터링
  // 선택한 날짜에 해당하는 전체 행사
  const filteredEvents = Events?.data?.filter((event) => isEventInDateRange(event.startAt, event.endAt, selectedMapDate, selectedMapDate)) ?? [];

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

  // 로딩 스피너
  if (eventLoading) {
    return <div>loading...</div>;
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
            clickMarker={(buildingName) => {
              setSelectedBuilding(buildingName);
              setShowEventCard(true);
              setCurrentSlide(1);
            }}
            events={filteredEvents}
          />
        </div>
      </div>

      {showEventCard && (
        <div className='fixed bottom-8 left-0 right-0 mx-auto w-full max-w-120 px-5'>
          {selectedBuildingEvents.length > 1 ? (
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              className='w-full'
              onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
            >
              {selectedBuildingEvents.map((event) => (
                <SwiperSlide key={event.noticeId}>
                  <EventCard
                    id={event.noticeId}
                    title={event.name}
                    // recommend={event.}
                    // unrecommend={event.unrecommend}
                    // image={event.}
                    location={buildingCoordinates.find((bc) => bc.id === event.location)?.name}
                    startDate={event.startAt}
                    endDate={event.endAt}
                    content={event.summary}
                    setCurrentSlide={setCurrentSlide}
                    currentSlide={currentSlide}
                    eventsNum={selectedBuildingEvents.length}
                    onSlideChange={(index) => swiperRef.current?.slideTo(index)}
                    like={likeStates[event.noticeId] ?? false}
                    setLike={(value) =>
                      setLikeStates((prev) => ({
                        ...prev,
                        [event.noticeId]: typeof value === 'function' ? value(prev[event.noticeId] ?? false) : value,
                      }))
                    }
                    disLike={disLikeStates[event.noticeId] ?? false}
                    setDisLike={(value) =>
                      setDisLikeStates((prev) => ({
                        ...prev,
                        [event.noticeId]: typeof value === 'function' ? value(prev[event.noticeId] ?? false) : value,
                      }))
                    }
                    // liked={event.liked}
                    // disLiked={event.disLiked}
                    onClose={setShowEventCard}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : selectedBuildingEvents.length === 1 ? (
            <EventCard
              id={selectedBuildingEvents[0].noticeId}
              title={selectedBuildingEvents[0].name}
              // recommend={selectedBuildingEvents[0]}
              // unrecommend={selectedBuildingEvents[0].unrecommend}
              // image={filteredselectedBuildingEventsEvents[0].image}
              location={buildingCoordinates.find((bc) => bc.id === selectedBuildingEvents[0].location)?.name}
              startDate={selectedBuildingEvents[0].startAt}
              endDate={selectedBuildingEvents[0].endAt}
              content={selectedBuildingEvents[0].summary}
              like={likeStates[selectedBuildingEvents[0].noticeId] ?? false}
              setLike={(value) =>
                setLikeStates((prev) => ({
                  ...prev,
                  [selectedBuildingEvents[0].noticeId]: typeof value === 'function' ? value(prev[selectedBuildingEvents[0].noticeId] ?? false) : value,
                }))
              }
              disLike={disLikeStates[selectedBuildingEvents[0].noticeId] ?? false}
              setDisLike={(value) =>
                setDisLikeStates((prev) => ({
                  ...prev,
                  [selectedBuildingEvents[0].noticeId]: typeof value === 'function' ? value(prev[selectedBuildingEvents[0].noticeId] ?? false) : value,
                }))
              }
              // liked={filteredEvents[0].liked}
              // disLiked={filteredEvents[0].disLiked}
              onClose={setShowEventCard}
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
            <EventListCard
              id={event.noticeId}
              //  image={event.image}
              title={event.name}
              location={buildingCoordinates.find((bc) => bc.id === event.location)?.name}
              startDate={event.startAt}
              endDate={event.endAt}
              // likeCount={event.recommend}
              // dislikeCount={event.unrecommend}
            />
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
