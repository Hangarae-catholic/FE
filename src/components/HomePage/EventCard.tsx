import Calendar from '/src/assets/icons/calendar.svg?react';
import Marker from '/src/assets/icons/marker.svg?react';
import RightArrow from '/src/assets/icons/arrow_right.svg?react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/FormatDate';
import { buildingCoordinates } from '../../constants/BUILDING_COORDINATES';

interface EventCardProps {
  id: number;
  image?: string[];
  title: string;
  startDate?: Date;
  endDate?: Date;
  location: string;
}

export default function EventCard({ image, title, startDate, endDate, location, id }: EventCardProps) {
  const navigate = useNavigate();

  return image && image?.length > 0 ? (
    <div className='w-full bg-white rounded-[18px] flex gap-2.5 p-4 break-keep'>
      <img src={image?.[0]} alt={title} className='w-19 h-26.5 object-fill rounded-sm' />

      <div className='flex flex-col w-full gap-1'>
        <h2 className='font-pretendard font-medium text-base'>{title}</h2>

        <div className='flex flex-col flex-1 justify-between'>
          <div className='flex flex-col gap-1'>
            <p className='flex gap-2'>
              <Calendar className='text-gray-600 w-4.5 h-4.5' />
              <span className='font-pretendard font-normal text-sm text-gray-700'>
                {formatDate(startDate)}~{formatDate(endDate)}
              </span>
            </p>
            <div className='flex gap-1.5 items-center'>
              <p className='flex gap-2'>
                <Marker className='text-gray-600 w-4.5 h-4.5' />
                <span className='font-pretendard font-normal text-sm text-gray-700'>{location}</span>
              </p>
              <button type='button' className='font-pretendard font-normal text-xs text-main bg-sub px-2 py-0.5 rounded-full'>
                지도
              </button>
            </div>
          </div>

          <button type='button' className='flex justify-between items-center' onClick={() => navigate(`/event-detail/${id}`)}>
            <span className='font-pretendard font-normal text-sm text-gray-800'>자세히 보기</span>
            <RightArrow className='text-gray-700 w-2.5' />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className='w-full bg-white rounded-[18px] flex gap-2.5 p-4 break-keep'>
      <div className='flex flex-col w-full gap-1'>
        <h2 className='font-pretendard font-medium text-base'>{title}</h2>

        <div className='flex flex-col flex-1 justify-between'>
          <div className='flex flex-col gap-1'>
            <p className='flex gap-2'>
              <Calendar className='text-gray-600 w-4.5 h-4.5' />
              <span className='font-pretendard font-normal text-sm text-gray-700'>
                {formatDate(startDate)}~{formatDate(endDate)}
              </span>
            </p>
            <div className='flex gap-1.5 items-center pb-2 border-b-[0.5px] border-gray-400'>
              <p className='flex gap-2'>
                <Marker className='text-gray-600 w-4.5 h-4.5' />
                <span className='font-pretendard font-normal text-sm text-gray-700'>{buildingCoordinates.find((bc) => bc.id === location)?.name ?? location}</span>
              </p>
              {/* 지도 위치 이동 기능 추가 */}
              {/* <button type='button' className='font-pretendard font-normal text-xs text-main bg-sub px-2 py-0.5 rounded-full'>
                지도
              </button> */}
            </div>
          </div>

          <button type='button' className='flex justify-between items-center pt-3 ' onClick={() => navigate(`/event-detail/${id}`)}>
            <span className='font-pretendard font-normal text-sm text-gray-800'>자세히 보기</span>
            <RightArrow className='text-gray-700 w-2.5' />
          </button>
        </div>
      </div>
    </div>
  );
}
