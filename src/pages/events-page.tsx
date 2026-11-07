import { useRef, useState } from 'react';
import TopBar from '../components/common/TopBar';
import Map from '/src/assets/icons/map.svg?react';
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

interface Event {
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
    date: '11월 21일(금) 19시',
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
    date: '11월 21일(금) 19시',
    content: '가톨릭대학교 개교 170주년을 기념하는 음악과 현악 합주 콘서트가 진행됩니다. 가톨릭대학교 개교 170주년을 기념하는 음악과 현악 합주 콘서트가 진행됩니다.',
    disLiked: true,
  },
  {
    id: 3,
    recommend: 12,
    unrecommend: 3,
    image: ExEventImg,
    location: '콘서트홀',
    title: '개교 170주년 기념 음악회',
    date: '11월 21일(금) 19시',
    content: '가톨릭대학교 개교 170주년을 기념하는 음악과 현악 합주 콘서트가 진행됩니다. 가톨릭대학교 개교 170주년을 기념하는 음악과 현악 합주 콘서트가 진행됩니다.',
  },
];

export default function EventsPage() {
  const [isMap, setIsMap] = useState(true);
  const [selectedListDate, setSelectedListDate] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedMapDate, setSelectedMapDate] = useState<Date | null>(null);
  const [switchOn, setSwitchOn] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [likeStates, setLikeStates] = useState<Record<number, boolean>>({});
  const [disLikeStates, setDisLikeStates] = useState<Record<number, boolean>>({});

  const swiperRef = useRef<SwiperType | null>(null);

  const handleSwitch = () => {
    setSwitchOn((prev) => {
      const next = !prev;

      if (next) {
        const today = new Date();
        const endDate = new Date(today);

        endDate.setDate(today.getDate() + 6);

        setSelectedListDate([today, endDate]);
      } else {
        setSelectedListDate([null, null]);
      }

      return next;
    });
  };

  return isMap ? (
    <>
      <TopBar title='행사 지도' rightIcon={List} rightBtnName='목록' rightOnClick={() => setIsMap(false)} />
      <MapDateDropdown
        value={selectedMapDate}
        onChange={(date: Date | null) => {
          setSelectedMapDate(date);
        }}
        isDateSelected={!!selectedMapDate}
      />

      <div className='fixed bottom-8 left-0 right-0 mx-auto w-full max-w-120 px-5'>
        {mock.length > 1 ? (
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            className='w-full'
            onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {mock.map((event) => (
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
                  eventsNum={mock.length}
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
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <EventCard
            id={mock[0].id}
            title={mock[0].title}
            recommend={mock[0].recommend}
            unrecommend={mock[0].unrecommend}
            location={mock[0].location}
            date={mock[0].date}
            image={mock[0].image}
            content={mock[0].content}
            like={likeStates[mock[0].id] ?? false}
            setLike={(value) =>
              setLikeStates((prev) => ({
                ...prev,
                [mock[0].id]: typeof value === 'function' ? value(prev[mock[0].id] ?? false) : value,
              }))
            }
            disLike={disLikeStates[mock[0].id] ?? false}
            setDisLike={(value) =>
              setDisLikeStates((prev) => ({
                ...prev,
                [mock[0].id]: typeof value === 'function' ? value(prev[mock[0].id] ?? false) : value,
              }))
            }
            liked={mock[0].liked}
            disLiked={mock[0].disLiked}
          />
        )}
      </div>
    </>
  ) : (
    <>
      <TopBar title='행사 목록' rightIcon={Map} rightBtnName='지도' rightOnClick={() => setIsMap(true)} />
      {/* 날짜 선택 버튼 */}
      <div className='flex gap-2.5 items-center w-full flex-1 min-w-0'>
        <ListDateDropdown
          value={selectedListDate}
          onChange={(dates) => {
            if (Array.isArray(dates)) {
              setSelectedListDate(dates);
            }
          }}
          isDateSelected={!!selectedListDate[0]}
        />

        <div className='flex shrink-0 items-center gap-1.5'>
          <span className='font-pretendard font-normal text-sm text-gray-800'>7일 간</span>
          <button type='button' onClick={handleSwitch}>
            {switchOn ? <SwitchOn className='rounded-full' /> : <SwitchOff className='border border-gray-300 rounded-full' />}
          </button>
        </div>
      </div>

      <div className='flex flex-col items-center justify-center py-25 gap-3.5'>
        <Capybara className='w-25' />
        <p className='font-pretendard font-medium text-base text-gray-700'>등록된 행사가 없어요.</p>
      </div>
    </>
  );
}
