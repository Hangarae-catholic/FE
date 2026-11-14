import ThumbUp from '/src/assets/icons/thumb-up.svg?react';
import ThumbDown from '/src/assets/icons/thumb-down.svg?react';
import X from '/src/assets/icons/x.svg?react';
import Calendar from '/src/assets/icons/calendar.svg?react';
import Location from '/src/assets/icons/marker.svg?react';
import RightArrow from '/src/assets/icons/arrow_right.svg?react';
import LeftArrow from '/src/assets/icons/arrow_left.svg?react';
import { useNavigate } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';
import { formatDate } from '../../../utils/FormatDate';
import CardLoadingSpinner from '../../common/CardLoadingSpinner';

interface EventCardProps {
  id: number;
  recommend?: number;
  unrecommend?: number;
  image?: string[];
  location: string | undefined;
  title: string;
  startDate: Date;
  endDate: Date;
  content: string;
  currentSlide?: number;
  setCurrentSlide?: Dispatch<SetStateAction<number>>;
  eventsNum?: number;
  onSlideChange?: (index: number) => void;
  onClose?: Dispatch<SetStateAction<boolean>>;
  userReaction: 'LIKE' | 'DISLIKE' | null;
  onReact: (reaction: 'LIKE' | 'DISLIKE') => void;
  isLoading?: boolean;
}

export default function EventCard({ id, recommend, unrecommend, image, location, title, startDate, endDate, content, currentSlide, eventsNum, onSlideChange, onClose, userReaction, onReact, isLoading }: EventCardProps) {
  const navigate = useNavigate();

  // 서버에서 받은 사용자 반응
  const isLiked = userReaction === 'LIKE';
  const isDisLiked = userReaction === 'DISLIKE';

  // 로딩 스피너
  if (isLoading) {
    return (
      <div className='w-full h-50 px-5 py-4 flex items-center justify-center flex-col gap-2 rounded-[20px] bg-[#FEFEFE]'>
        <CardLoadingSpinner />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3 z-30'>
      {/* 추천 / 비추천 버튼 */}
      <div className='flex items-center gap-2'>
        {/* 추천 버튼 */}
        <button type='button' className={`flex items-center gap-1 px-2 py-1.5 rounded-full ${isLiked ? 'bg-main' : 'bg-gray-50'}`} disabled={userReaction !== null || isLoading} onClick={() => onReact('LIKE')}>
          <ThumbUp className={`w-5.5 h-5.5 ${isLiked ? 'text-bg' : 'text-orange-600'}`} />

          <span className={`font-pretendard font-normal text-[13px] ${isLiked ? 'text-bg' : 'text-gray-700'}`}>추천해요 {recommend ?? 0}</span>
        </button>

        {/* 비추천 버튼 */}
        <button type='button' className={`flex items-center gap-1 px-2 py-1.5 rounded-full ${isDisLiked ? 'bg-gray-800' : 'bg-gray-50'}`} disabled={userReaction !== null || isLoading} onClick={() => onReact('DISLIKE')}>
          <ThumbDown className={`w-5.5 h-5.5 ${isDisLiked ? 'text-bg' : 'text-gray-600'}`} />

          <span className={`font-pretendard font-normal text-[13px] ${isDisLiked ? 'text-bg' : 'text-gray-700'}`}>비추천해요 {unrecommend ?? 0}</span>
        </button>
      </div>

      {/* 카드 내용 */}
      <div className='w-full px-5 py-4 flex flex-col gap-2 rounded-[20px] bg-[#FEFEFE]'>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <span className='font-pretendard font-normal text-[13px] text-orange-600'>콘서트홀</span>
            <button type='button' className='flex items-center justify-end' onClick={() => onClose?.(false)}>
              <X className='w-6 h-6 text-gray-700' />
            </button>
          </div>

          {image && image.length > 0 ? (
            <div className='flex items-center gap-3'>
              <img src={image?.[0]} alt={title} className='w-19.5 h-30.5 object-fill rounded-lg' />
              <div className='flex flex-col gap-1.5'>
                <span className='font-pretendard font-medium text-base text-gray-800 break-keep'>{title}</span>

                <div className='flex flex-col gap-1.5'>
                  <div className='flex items-center gap-1'>
                    <Calendar className='w-4.5 h-4.5 text-gray-600' />
                    <span className='font-pretendard font-normal text-[13px] text-gray-700'>
                      {formatDate(startDate)}~{formatDate(endDate)}
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Location className='w-4.5 h-4.5 text-gray-600' />
                    <span className='font-pretendard font-normal text-[13px] text-gray-700'>{location}</span>
                  </div>
                </div>

                <p className='font-pretendard font-normal text-xs text-gray-600 line-clamp-2'>{content}</p>
              </div>
            </div>
          ) : (
            <div>
              <span className='font-pretendard font-medium text-base text-gray-800 break-keep'>{title}</span>

              <div className='flex flex-col gap-1.5'>
                <div className='flex items-center gap-1'>
                  <Calendar className='w-4.5 h-4.5 text-gray-600' />
                  <span className='font-pretendard font-normal text-[13px] text-gray-700'>
                    {formatDate(startDate)}~{formatDate(endDate)}
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <Location className='w-4.5 h-4.5 text-gray-600' />
                  <span className='font-pretendard font-normal text-[13px] text-gray-700'>{location}</span>
                </div>
              </div>

              <p className='font-pretendard font-normal text-xs text-gray-600 line-clamp-2'>{content}</p>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <button type='button' className='flex items-center leading-none gap-1.5 justify-end w-full cursor-pointer' onClick={() => navigate(`/event-detail/${id}`)}>
          <span className='font-pretendard font-normal text-[13px] text-gray-700'>자세히 보기</span>
          <RightArrow className='text-gray-700' />
        </button>

        {/* 페이지네이션 버튼 */}
        {eventsNum && (
          <div className='w-full flex justify-between items-center leading-none mt-2'>
            <button type='button' className={`flex items-center justify-center w-7 h-7 rounded-full cursor-pointer ${currentSlide === 1 ? 'bg-gray-50' : 'bg-orange-100'}`} onClick={() => onSlideChange?.((currentSlide ?? 1) - 2)} disabled={currentSlide === 1}>
              <LeftArrow className={`${currentSlide === 1 ? 'text-gray-600' : 'text-orange-600'}`} />
            </button>
            <div className='font-pretendard font-normal text-[13px]'>
              <span className='text-gray-700'>{currentSlide} </span>
              <span className='text-gray-600'>/ {eventsNum}</span>
            </div>
            <button type='button' className={`flex items-center justify-center w-7 h-7 rounded-full cursor-pointer ${currentSlide === eventsNum ? 'bg-gray-50' : 'bg-orange-100'}`} onClick={() => onSlideChange?.(currentSlide ?? 0)} disabled={currentSlide === eventsNum}>
              <RightArrow className={`w-3.5 h-3.5 ${currentSlide === eventsNum ? 'text-gray-600' : 'text-orange-600'}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
