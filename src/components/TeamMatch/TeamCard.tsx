import Calendar from '/src/assets/icons/calendar.svg?react';
import Writer from '/src/assets/icons/writer.svg?react';
import Member from '/src/assets/icons/member.svg?react';
import RightArrow from '/src/assets/icons/arrow_right.svg?react';
import { useNavigate } from 'react-router-dom';
import { STUDENT_STATUS } from '../../constants/STUDENT_STATUS';

interface TeamCardProps {
  id: number;
  image?: string;
  title: string;
  content?: string;
  startDate: Date;
  endDate: Date;
  writerName: string;
  writerMajor: string;
  writerStatus: string;
  limitMember: number;
  currentMember: number;
  category: string;
  status: string;
}

export default function TeamCard({ id, image, title, content, startDate, endDate, writerName, writerMajor, writerStatus, limitMember, currentMember, category, status }: TeamCardProps) {
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col gap-3 px-5 py-3.5 rounded-[20px] ${status === 'CLOSED' ? 'bg-gray-200' : 'bg-white'}`}>
      <div className='flex gap-2 items-center'>
        <img src={image} alt={title} className='w-20 h-29 object-fill rounded-sm' />
        <div className='flex flex-col gap-1.5'>
          <div className='flex gap-1.5 items-center'>
            <span className={`font-pretendard font-normal text-xs py-0.5 px-2 rounded-3xl ${status === 'CLOSED' ? 'text-gray-600 bg-gray-300' : 'bg-[#DAF6DF] text-[#0D8D3D]'}`}>{status === 'CLOSED' ? '모집완료' : '모집중'}</span>
            <span className='font-pretendard font-normal text-xs bg-white text-gray-700 py-0.5 px-2 rounded-3xl border border-orange-300'>{category}</span>
          </div>

          <div>
            <h1 className='font-pretendard font-medium text-base text-gray-800 leading-6'>{title}</h1>
            <p className='font-pretendard font-normal text-[13px] text-gray-700 line-clamp-1 leading-5'>{content}</p>
          </div>

          <div>
            <div className='flex gap-1.5'>
              <Calendar className='w-4 h-4 text-gray-600' />
              <time className='font-pretendard font-normal text-xs text-gray-700'>
                {startDate.toDateString()} ~ {endDate.toDateString()}
              </time>
            </div>
            <div className='flex gap-1.5'>
              <Writer className='w-4 h-4 text-gray-600' />
              <time className='font-pretendard font-normal text-xs text-gray-700'>
                {writerName}•{writerMajor}•{STUDENT_STATUS.find((ss) => ss.id === writerStatus)?.name}
              </time>
            </div>
          </div>
        </div>
      </div>

      <button
        type='button'
        className={`w-full flex items-center justify-between rounded-xl px-1 py-0.5 ${status === 'CLOSED' ? 'bg-gray-300' : 'bg-orange-100'}`}
        onClick={() => {
          navigate(`/team-match/${id}`);
        }}
      >
        <div className='flex gap-0.5 items-center'>
          <Member className={`w-5 h-5 ${status === 'CLOSED' ? 'text-gray-600' : 'text-orange-500'}`} />
          <span className={`font-pretendard font-normal text-[13px] ${status === 'CLOSED' ? 'text-gray-600' : 'text-main'}`}>
            <span className={`${status === 'CLOSED' ? 'text-gray-800' : 'text-orange-600'}`}>{currentMember}/</span> {limitMember}명
          </span>
        </div>
        <RightArrow className='w-2.5 h-2.5 text-gray-700' />
      </button>
    </div>
  );
}
