import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import EventCard from '../components/HomePage/EventCard';
import ExEvent from '/src/assets/images/event_ex.png';
import MiniMap from '../components/HomePage/MiniMap';

const mock = [
  { image: ExEvent, title: '[개교 170주년 기념] 음악과 현악합주', date: '11월 21일(금) 19시', location: '콘서트홀' },
  { image: ExEvent, title: '[개교 170주년 기념] 음악과 현악합주', date: '11월 21일(금) 19시', location: '콘서트홀' },
  { image: ExEvent, title: '[개교 170주년 기념] 음악과 현악합주', date: '11월 21일(금) 19시', location: '콘서트홀' },
];

export default function Home() {
  return (
    <>
      <div className='mb-3'>
        <p className='font-pretendard font-normal text-base text-gray-700 leading-6'>10월 14일 수요일</p>
        <h1 className='font-pretendard font-bold text-xl text-gray-800 leading-7.5'>지금 주목할 캠퍼스 행사</h1>
      </div>

      {/* 카드 스와이퍼 */}
      <div>
        <Swiper loop={true} pagination={{ el: '.custom-pagination', type: 'bullets', clickable: true }} spaceBetween={10} autoplay={{ delay: 5000 }} modules={[Pagination, Autoplay]}>
          {mock.map((m) => {
            return (
              <SwiperSlide>
                <EventCard image={m.image} title={m.title} date={m.date} location={m.location} />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className='custom-pagination w-full max-w-120 flex justify-center gap-1.5 mt-3'></div>
      </div>

      {/* 지도 영역 */}
      <div className='mt-4'>
        <h2 className='font-pretendard font-semibold text-lg text-gray-800 leading-7'>교내 행사 미니맵</h2>
        <div className='flex justify-between items-center'>
          <p className='font-pretendard font-normal text-sm text-gray-700 leading-5'>오늘 우리 학교, 어디가 핫할까?</p>
          <span className='font-pretendard font-normal text-sm text-orange-600 leading-5'>3개 진행중</span>
        </div>

        <div className='mt-3'>
          <MiniMap />
        </div>
      </div>
    </>
  );
}
