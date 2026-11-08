import { useRef, useState } from 'react';
import TopBar from '../components/common/TopBar';
import MapIcon from '/src/assets/icons/map.svg?react';
import List from '/src/assets/icons/list.svg?react';
import ListDateDropdown from '../components/EventsPage/List/DateDropDown';
import MapDateDropdown from '../components/EventsPage/Map/DateDropDown';
import SwitchOn from '/src/assets/icons/switch_on.svg?react';
import SwitchOff from '/src/assets/icons/switch_off.svg?react';
import Capybara from '/src/assets/images/capy_face_surprise.svg?react';
import EventCard from '../components/EventsPage/Map/EventCard';
import ExEventImg from '/src/assets/images/event_ex.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import EventListCard from '../components/AddEventPage/EventCard';
import MiniMap from '../components/HomePage/MiniMap';
import { buildingCoordinates } from '../constants/BUILDING_COORDINATES';

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

const mock: Event[] = [
  {
    id: 1,
    recommend: 12,
    unrecommend: 3,
    image: ExEventImg,
    location: '콘서트홀',
    title: '개교 170주년 기념 음악회',
    date: '11월 11일(금) 19시',
    content: '가톨릭대학교 개교 170주년을 기념하는 음악과 현악 합주 콘서트가 진행됩니다. 가톨릭대학교 개교 170주년을 기념하는 음악과 현악 합주 콘서트가 진행됩니다.',
    liked: true,
  },
  {
    id: 2,
    recommend: 12,
    unrecommend: 3,
    image: ExEventImg,
    location: '콘서트홀',
    title: '개교 170주년 기념 음악회',
    date: '11월 11일(화) 19시',
    content: '가톨릭대학교 개교 170주년을 기념하는 음악과 현악 합주 콘서트가 진행됩니다. 가톨릭대학교 개교 170주년을 기념하는 음악과 현악 합주 콘서트가 진행됩니다.',
    disLiked: true,
  },
  {
    id: 3,
    recommend: 12,
    unrecommend: 3,
    image: ExEventImg,
    location: '김수환관',
    title: '개교 170주년 기념 음악회',
    date: '11월 15일(금) 19시',
    content: '가톨릭대학교 개교 170주년을 기념하는 음악과 현악 합주 콘서트가 진행됩니다. 가톨릭대학교 개교 170주년을 기념하는 음악과 현악 합주 콘서트가 진행됩니다.',
  },
];

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

  // 날짜 변환 함수
  const formatEventDate = (date: Date) => {
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 지도 건물명 / 날짜 필터링
  const filteredEvents = mock.filter((event) => {
    const isBuildingMatch = selectedBuilding ? event.location === selectedBuilding : true;

    const isDateMatch = selectedMapDate ? event.date.startsWith(formatEventDate(selectedMapDate)) : true;

    return isBuildingMatch && isDateMatch;
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

  // 목록 날짜 비교
  const isEventInDateRange = (eventDate: string, startDate: Date | null, endDate: Date | null) => {
    if (!startDate) return false;

    const eventMonthDay = eventDate.match(/(\d+)월\s*(\d+)일/);

    if (!eventMonthDay) return false;

    const [, month, day] = eventMonthDay;

    const eventDateObj = new Date(startDate.getFullYear(), Number(month) - 1, Number(day));

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate ?? startDate);
    end.setHours(23, 59, 59, 999);

    return eventDateObj >= start && eventDateObj <= end;
  };

  // 목록 날짜 필터링
  const filteredListEvents = mock.filter((event) => isEventInDateRange(event.date, selectedListDate[0], switchOn ? selectedListDate[1] : selectedListDate[0]));

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
            events={mock.filter((event) => (selectedMapDate ? event.date.startsWith(formatEventDate(selectedMapDate)) : true))}
          />
        </div>
      </div>

      {showEventCard && (
        <div className='fixed bottom-8 left-0 right-0 mx-auto w-full max-w-120 px-5'>
          {filteredEvents.length > 1 ? (
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              className='w-full'
              onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
            >
              {filteredEvents.map((event) => (
                <SwiperSlide key={event.id}>
                  <EventCard
                    id={event.id}
                    title={event.title}
                    recommend={event.recommend}
                    unrecommend={event.unrecommend}
                    image={event.image}
                    location={event.location}
                    date={event.date}
                    content={event.content}
                    setCurrentSlide={setCurrentSlide}
                    currentSlide={currentSlide}
                    eventsNum={filteredEvents.length}
                    onSlideChange={(index) => swiperRef.current?.slideTo(index)}
                    like={likeStates[event.id] ?? false}
                    setLike={(value) =>
                      setLikeStates((prev) => ({
                        ...prev,
                        [event.id]: typeof value === 'function' ? value(prev[event.id] ?? false) : value,
                      }))
                    }
                    disLike={disLikeStates[event.id] ?? false}
                    setDisLike={(value) =>
                      setDisLikeStates((prev) => ({
                        ...prev,
                        [event.id]: typeof value === 'function' ? value(prev[event.id] ?? false) : value,
                      }))
                    }
                    liked={event.liked}
                    disLiked={event.disLiked}
                    onClose={setShowEventCard}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : filteredEvents.length === 1 ? (
            <EventCard
              id={filteredEvents[0].id}
              title={filteredEvents[0].title}
              recommend={filteredEvents[0].recommend}
              unrecommend={filteredEvents[0].unrecommend}
              image={filteredEvents[0].image}
              location={filteredEvents[0].location}
              date={filteredEvents[0].date}
              content={filteredEvents[0].content}
              like={likeStates[filteredEvents[0].id] ?? false}
              setLike={(value) =>
                setLikeStates((prev) => ({
                  ...prev,
                  [filteredEvents[0].id]: typeof value === 'function' ? value(prev[filteredEvents[0].id] ?? false) : value,
                }))
              }
              disLike={disLikeStates[filteredEvents[0].id] ?? false}
              setDisLike={(value) =>
                setDisLikeStates((prev) => ({
                  ...prev,
                  [filteredEvents[0].id]: typeof value === 'function' ? value(prev[filteredEvents[0].id] ?? false) : value,
                }))
              }
              liked={filteredEvents[0].liked}
              disLiked={filteredEvents[0].disLiked}
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
          <div key={event.id} className='mt-6 flex flex-col gap-4'>
            <EventListCard id={event.id} image={event.image} title={event.title} date={event.date} location={event.location} likeCount={event.recommend} dislikeCount={event.unrecommend} />
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
