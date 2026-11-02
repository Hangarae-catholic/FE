import Calendar from '/src/assets/icons/calendar.svg?react';
import Marker from '/src/assets/icons/marker.svg?react';
import RightArrow from '/src/assets/icons/arrow_right.svg?react';

interface EventCardProps {
  image: string;
  title: string;
  date: string;
  location: string;
}

export default function EventCard({ image, title, date, location }: EventCardProps) {
  return (
    <div className='w-full bg-white p-5 rounded-[20px] flex flex-col gap-1.5'>
      <img src={image} alt={title} className='w-full object-fill rounded-[20px] mb-4.5' />
      <h2 className='font-pretendard font-medium text-base'>{title}</h2>
      <p className='flex gap-2'>
        <Calendar className='text-gray-600 w-4.5 h-4.5' />
        <span className='font-pretendard font-normal text-sm text-gray-700'>{date}</span>
      </p>
      <p className='flex gap-2 pb-2 border-b-[0.5px] text-gray-400'>
        <Marker className='text-gray-600 w-4.5 h-4.5' />
        <span className='font-pretendard font-normal text-sm text-gray-700'>{location}</span>
      </p>

      <button type='button' className='flex justify-between items-center pt-3'>
        <span className='font-pretendard font-normal text-sm text-gray-800'>자세히 보기</span>
        <RightArrow className='text-gray-700 w-2.5' />
      </button>
    </div>
  );
}
