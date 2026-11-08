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
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useMemo, useRef, useState } from 'react';
import { buildingCoordinates } from '../constants/BUILDING_COORDINATES';

const mock = [
  { id: 1, image: ExEvent, title: '[개교 170주년 기념] 음악과 현악합주', date: '11월 21일(금) 19시', location: '약학관' },
  { id: 2, title: '[개교 170주년 기념] 음악과 현악합주', date: '11월 21일(금) 19시', location: '다솔관' },
];

const mockInterests = ['IT•소프트웨어', 'AI•데이터', 'AI•데이터', '취업•창업•대외활동'];

export default function HomePage() {
  const navigate = useNavigate();

  // 행사 장소 중복 제거
  const eventLocations = useMemo(() => [...new Set(mock.map((event) => event.location))], []);

  // 좌표 데이터가 존재하는 장소만 추출
  const markers = useMemo(() => buildingCoordinates.filter((location) => eventLocations.includes(location.name)), [eventLocations]);

  // 마커 중 하나를 랜덤으로 선택
  const [focusLocation] = useState(() => {
    if (markers.length === 0) return null;

    return markers[Math.floor(Math.random() * markers.length)];
  });

  // 지도 프레임과 지도 레이어 참조
  const frameRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // 지도 이동 위치
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

  // 선택된 마커가 프레임 내부에 오도록 지도 이동
  useEffect(() => {
    const frame = frameRef.current;
    const map = mapRef.current;

    if (!frame || !map || !focusLocation) return;

    const updateMapPosition = () => {
      const frameWidth = frame.clientWidth;
      const frameHeight = frame.clientHeight;

      const mapWidth = map.clientWidth;
      const mapHeight = map.clientHeight;

      // 확대된 지도 레이어의 기본 위치
      const baseLeft = (frameWidth - mapWidth) / 2;
      const baseTop = (frameHeight - mapHeight) / 2;

      // 마커의 지도 레이어 내부 좌표
      const markerX = (focusLocation.x / 100) * mapWidth;
      const markerY = (focusLocation.y / 100) * mapHeight;

      const padding = 21;

      let x = 0;
      let y = 0;

      // 마커가 프레임 왼쪽 또는 오른쪽을 벗어나는 경우에만 이동
      const markerScreenX = baseLeft + markerX;

      if (markerScreenX < padding) {
        x = padding - markerScreenX;
      } else if (markerScreenX > frameWidth - padding) {
        x = frameWidth - padding - markerScreenX;
      }

      // 마커가 프레임 위쪽 또는 아래쪽을 벗어나는 경우에만 이동
      const markerScreenY = baseTop + markerY;

      if (markerScreenY < padding) {
        y = padding - markerScreenY;
      } else if (markerScreenY > frameHeight - padding) {
        y = frameHeight - padding - markerScreenY;
      }

      // 지도 이미지가 프레임 밖으로 벗어나지 않도록 이동 범위 제한
      const minX = frameWidth - mapWidth - baseLeft;
      const maxX = -baseLeft;

      const minY = frameHeight - mapHeight - baseTop;
      const maxY = -baseTop;

      x = Math.max(minX, Math.min(maxX, x));
      y = Math.max(minY, Math.min(maxY, y));

      setMapOffset({ x, y });
    };

    updateMapPosition();

    const observer = new ResizeObserver(updateMapPosition);
    observer.observe(frame);

    return () => observer.disconnect();
  }, [focusLocation]);

  // 오늘 날짜 포맷팅 'm월 d일 e요일'
  const today = format(new Date(), 'M월 d일 EEEE', { locale: ko });

  return (
    <>
      {/* 상단 내용 */}
      <div className='flex justify-between'>
        <div className='mb-3'>
          <p className='font-pretendard font-light text-2xl text-white leading-8.5 max-[425px]:text-xl'>{today}</p>
          <span className='flex gap-1 items-center font-pretendard font-normal text-2xl text-white leading-8.5 max-[425px]:text-xl'>
            <span className='font-bold'>아이브</span>님
          </span>
          <p className='flex flex-col font-pretendard font-light text-2xl text-white leading-8.5 max-[425px]:text-xl'>
            캠퍼스 곳곳의 <span>행사를 만나봐요!</span>
          </p>
        </div>
        <img
          src={WinkCapy}
          alt='카피바라'
          className='mt-6 w-1/2 h-[clamp(270px,38vh,380px)]
          shrink-0
          pointer-events-none'
        />
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

          <span className='font-pretendard font-normal text-[13px] text-white leading-5'>{mock.length}개 진행중</span>
        </div>

        {/* 지도 프레임 */}
        <div ref={frameRef} className='relative w-full h-44 overflow-hidden rounded-[18px]' onClick={() => navigate('/events')}>
          <div
            ref={mapRef}
            className='absolute w-[140%] h-auto aspect-square'
            style={{
              left: `calc(50% + ${mapOffset.x}px)`,
              top: `calc(50% + ${mapOffset.y}px)`,
              transform: 'translate(-50%, -50%)',
              transition: 'left 0.5s ease, top 0.5s ease',
            }}
          >
            <img src={Map} alt='지도 미리보기' className='w-full h-full object-fill' />

            {markers.map((marker) => (
              <MiniMapMarker
                key={marker.name}
                className='absolute w-8.5 h-8.5 z-10'
                style={{
                  left: `${marker.x}%`,
                  top: `${marker.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </div>
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
