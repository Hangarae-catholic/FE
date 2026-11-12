import { useEffect, useState } from 'react';
import TopBar from '../components/common/TopBar';
import { Swiper, SwiperSlide } from 'swiper/react';
// import ExEventDetail from '/src/assets/images/event-detail_ex.png';
import Picture from '/src/assets/icons/picture.svg?react';
import Calendar from '/src/assets/icons/calendar_event.svg?react';
import Location from '/src/assets/icons/marker.svg?react';
import Member from '/src/assets/icons/member.svg?react';
import { useParams } from 'react-router-dom';
import { getEventDetail } from '../apis/events';
import type { EventDetailResponse } from '../types/events';
import { formatDate } from '../utils/FormatDate';
import { buildingCoordinates } from '../constants/BUILDING_COORDINATES';
import LoadingSpinner from '../components/common/LoadingSpinner';

// const mock = [
//   {
//     image: [ExEventDetail, ExEventDetail, ExEventDetail],
//     title: '컴퓨터정보공학부 학술제',
//     time: '26.11.24(화) 14시',
//     location: '김수환관(K) 컨퍼런스홀',
//     organ: '컴퓨터정보공학부',
//     content: `안녕하세요! 컴퓨터정보공학부 학생회 연아입니다!\n이번 2026 학술제는 COMA, UMC, 멋쟁이사자처럼과 함꼐 진행합니다!  많은 관심 부탁드립니다!<br /><br />학술제 일정은 다음과 같습니다.\n12:00 - 14:00 본선 진출 팀 부스 세팅\n14:00 - 18:00 팀별 성과와 소개 발표\n18:30 시상자 발표 및 폐회<br /><br />자세한 내용 확인: https://csie.catholic.ac.kr/csie/community/notice.do `,
//   },
// ];

export default function EventDetailPage() {
  const { id: noticeId } = useParams();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [eventDetail, setEventDetail] = useState<EventDetailResponse>();
  const [eventDetailLoading, setEventDetailLoading] = useState(false);

  console.log(noticeId);

  useEffect(() => {
    const fetchEventDetail = async (noticeId: number) => {
      try {
        setEventDetailLoading(true);

        const data = await getEventDetail(noticeId);

        setEventDetail(data);
      } catch (error) {
        console.error('행사 상세 조회 실패:', error);
      } finally {
        setEventDetailLoading(false);
      }
    };

    fetchEventDetail(Number(noticeId));
  }, [noticeId]);

  // 로딩스피너
  if (eventDetailLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <TopBar title='행사 상세' />

      {/* 이미지 */}
      {eventDetail?.data?.imageUrls && eventDetail?.data?.imageUrls.length > 0 ? (
        <div className='relative'>
          <Swiper loop={true} spaceBetween={10} slidesPerView={1} className='w-full' onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}>
            {eventDetail?.data?.imageUrls.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img src={img} alt={`${eventDetail?.data?.name} 모집글의 이미지 ${idx + 1}`} className='w-full h-37.5 object-fill rounded-t-xl' />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='absolute bottom-2 right-2 z-10 bg-gray-600/80 px-2.5 py-1.5 rounded-full flex items-center'>
            <span className='font-pretendard font-medium text-xs text-white'>
              {currentSlide} / {eventDetail?.data?.imageUrls.length}
            </span>
          </div>
        </div>
      ) : (
        <div className='w-full h-37.5 rounded-t-xl flex justify-center items-center bg-gray-400'>
          <Picture className='w-9 h-9 text-gray-600' />
        </div>
      )}

      <div className='px-5 mt-5'>
        {/* 행사 정보 */}
        <div className='flex flex-col gap-3 pb-5 border-b border-gray-300'>
          <span className='font-pretendard font-semibold text-lg text-gray-800'>{eventDetail?.data?.name}</span>

          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
              <Calendar className='w-7 h-7 text-gray-600' />
              <div className='flex flex-col'>
                <span className='font-pretendard font-normal text-sm text-gray-700'>헹사 일시</span>
                <span className='font-pretendard font-medium text-base text-gray-800'>
                  {formatDate(eventDetail?.data?.startAt)}~{formatDate(eventDetail?.data?.endAt)}
                </span>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Location className='w-7 h-7 text-gray-600' />
              <div className='flex flex-col'>
                <span className='font-pretendard font-normal text-sm text-gray-700'>행사 장소</span>
                <span className='font-pretendard font-medium text-base text-gray-800'>{buildingCoordinates.find((bc) => eventDetail?.data?.location === bc.id)?.name}</span>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Member className='w-7 h-7 text-gray-600' />
              <div className='flex flex-col'>
                <span className='font-pretendard font-normal text-sm text-gray-700'>담당 기관</span>
                <span className='font-pretendard font-medium text-base text-gray-800'>{eventDetail?.data?.responsible}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 행사 내용 */}
        <div className='flex flex-col gap-2 mt-5'>
          <span className='font-pretendard font-medium text-sm text-gray-800'>행사 내용</span>
          <p className='whitespace-pre-line font-pretendard font-normal text-sm text-gray-700 leading-5.5'>{eventDetail?.data?.information.replace(/<br\s*\/?>/gi, '\n')}</p>
        </div>
      </div>
    </>
  );
}
