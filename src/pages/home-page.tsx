import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import EventCard from '../components/HomePage/EventCard';
import ExEvent from '/src/assets/images/event_ex.png';
import WinkCapy from '/src/assets/images/capy_wink.png';
import Map from '/src/assets/images/map.png';
import MiniMapMarker from '/src/assets/icons/minimap-marker.svg?react';
import MegaPhone from '/src/assets/icons/mega-phone.svg?react';
import ProfileCard from '../components/HomePage/ProfileCard';
import { useNavigate } from 'react-router-dom';

const mock = [
  { id: 1, image: ExEvent, title: '[개교 170주년 기념] 음악과 현악합주', date: '11월 21일(금) 19시', location: '콘서트홀' },
  { id: 2, title: '[개교 170주년 기념] 음악과 현악합주', date: '11월 21일(금) 19시', location: '콘서트홀' },
];

const mockInterests = ['IT•소프트웨어', 'AI•데이터', 'AI•데이터', '취업•창업•대외활동'];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* 상단 내용 */}
      <div className='flex justify-between'>
        <div className='mb-3'>
          <p className='font-pretendard font-light text-2xl text-white leading-8.5 max-[425px]:text-xl'>10월 14일 수요일</p>
          <span className='flex gap-1 items-center font-pretendard font-normal text-2xl text-white leading-8.5 max-[425px]:text-xl'>
            <span className='font-bold'>아이브</span>님
          </span>
          <p className='flex flex-col font-pretendard font-light text-2xl text-white leading-8.5 max-[425px]:text-xl'>
            캠퍼스 곳곳의 <span>행사를 만나봐요!</span>
          </p>
        </div>
        <img src={WinkCapy} alt='카피바라' className='mt-6 h-51 max-[425px]:w-42 w-52 max-[370px]:w-32' />
      </div>

      {/* 카드 스와이퍼 */}
      <div className='-mt-14.5'>
        <Swiper loop={true} pagination={{ el: '.custom-pagination', type: 'bullets', clickable: true }} spaceBetween={10} autoplay={{ delay: 5000 }} modules={[Pagination, Autoplay]}>
          <>
            <SwiperSlide>
              <ProfileCard interests={mockInterests} />
            </SwiperSlide>
            {mock.map((m, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <EventCard image={m.image} title={m.title} date={m.date} location={m.location} id={m.id} />
                </SwiperSlide>
              );
            })}
          </>
        </Swiper>
        <div className='custom-pagination w-full max-w-120 flex justify-center gap-1.5 mt-3'></div>
      </div>

      {/* 지도 영역 */}
      <div className='mt-4'>
        <div className='flex justify-between items-center'>
          <span className='font-pretendard font-normal text-base text-white leading-6'>교내 행사 미니맵</span>
          <span className='font-pretendard font-normal text-[13px] text-white leading-5'>3개 진행중</span>
        </div>

        <div className='relative w-full h-44 overflow-hidden rounded-[18px]'>
          <img src={Map} alt='지도 미리보기' className='w-full h-full object-cover' />

          <MiniMapMarker className='absolute w-8.5 h-8.5 top-[30%] left-[50%] z-10' />
          <MiniMapMarker className='absolute w-8.5 h-8.5 top-[50%] left-[20%] z-10' />
        </div>
      </div>

      {/* 팀매칭 카드 */}
      <div className='flex flex-col gap-2 mt-5 select-none cursor-pointer' onClick={() => navigate('/team-match')}>
        <p className='font-pretendard font-normal text-base text-white'>행가래에서 만나는 새로운 기회</p>
        <div className='rounded-[18px] bg-[#ffa45b] flex px-5 py-4 gap-4 items-center'>
          <MegaPhone className='w-15 h-15' />
          <div>
            <div className='flex flex-col gap-0.5'>
              <span className='font-pretendard font-medium text-xs bg-linear-to-r from-[#FF99B2] to-[#DE4736] bg-clip-text text-transparent'>TEAM MATCHING</span>
              <div>
                <p className='font-pretendard font-semibold text-base text-white leading-6 max-[325px]:text-sm'>나와 함께할 팀을 찾아보세요!</p>
                <p className='font-pretendard font-normal text-xs text-gray-50 leading-4.5 break-keep'>관심 있는 모집글을 확인하고 새로운 활동을 시작해봐요</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
