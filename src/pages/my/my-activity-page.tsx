import { useState } from 'react';

import TopBar from '../../components/common/TopBar';
import CategoryGroup from '../../components/TeamMatch/Category/Category';
// import TeamCard from "../../components/TeamMatch/TeamCard";
import EventCard from '../../components/AddEventPage/EventCard';

import Capybara from '../../assets/images/capy_face_surprise.svg?react';
import ExTeamMatching from '../../assets/images/ex_team-matching.png';
import ExEvent from '/src/assets/images/event_ex.png';

type ActivityTab = 'team' | 'event';

interface ActivityItem {
  id: number;
  image: string;
  title: string;
  content: string;
  date: string;
  writerName: string;
  writerMajor: string;
  writerGrage: number;
  category: string;
  limitMember: number;
  currentMember: number;
}

type EventStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface EventItem {
  id: number;
  image?: string | null;
  title: string;
  date: string;
  location: string;
  likeCount: number;
  dislikeCount: number;
  status: EventStatus;
}

// TODO: 실제 내가 작성한 팀 모집글 조회 API로 교체
const mockActivities: ActivityItem[] = [
  {
    id: 1,
    image: ExTeamMatching,
    title: '컴퓨터공학부 학술제',
    content: '학술제 같이 나가실 분 구해요! 성실히 참여하실 분 환영합니다.',
    date: '26.11.04. ~ 26.11.08',
    writerName: '정다민',
    writerMajor: '미디어기술콘텐츠학부',
    writerGrage: 4,
    category: '공모전•대회',
    limitMember: 6,
    currentMember: 2,
  },
  {
    id: 2,
    image: ExTeamMatching,
    title: '컴퓨터공학부 학술제',
    content: '학술제 같이 나가실 분 구해요! 성실히 참여하실 분 환영합니다.',
    date: '26.11.04. ~ 26.11.08',
    writerName: '정다민',
    writerMajor: '미디어기술콘텐츠학부',
    writerGrage: 4,
    category: '교과',
    limitMember: 6,
    currentMember: 6,
  },
  {
    id: 3,
    image: ExTeamMatching,
    title: '코딩테스트 스터디',
    content: '코딩테스트를 함께 준비할 팀원을 모집합니다.',
    date: '26.11.04. ~ 26.11.08',
    writerName: '정다민',
    writerMajor: '미디어기술콘텐츠학부',
    writerGrage: 4,
    category: '스터디',
    limitMember: 6,
    currentMember: 2,
  },
];

// TODO: 실제 내가 등록한 교내 행사 조회 API로 교체
const mockEvents: EventItem[] = [
  {
    id: 1,
    image: ExEvent,
    title: '개교 170주년 기념 음악회',
    date: '11월 21일(금) 19시',
    location: '콘서트홀(CH)',
    likeCount: 23,
    dislikeCount: 2,
    status: 'PENDING',
  },
  {
    id: 2,
    title: '개교 170주년 기념 음악회',
    date: '11월 21일(금) 19시',
    location: '콘서트홀(CH)',
    likeCount: 23,
    dislikeCount: 2,
    status: 'APPROVED',
  },
  {
    id: 3,
    image: ExEvent,
    title: '컴퓨터정보공학부 학술제',
    date: '11월 24일(화) 14시',
    location: '김수환관(K) 컨퍼런스홀',
    likeCount: 23,
    dislikeCount: 2,
    status: 'REJECTED',
  },
];

const MyActivityPage = () => {
  const [activeTab, setActiveTab] = useState<ActivityTab>(() => {
    const savedTab = sessionStorage.getItem('myActivityTab');

    return savedTab === 'event' ? 'event' : 'team';
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const filteredActivities = mockActivities.filter((activity) => selectedCategory === '전체' || activity.category === selectedCategory);

  const handleTabChange = (tab: ActivityTab) => {
    setActiveTab(tab);
    sessionStorage.setItem('myActivityTab', tab);
    setSelectedCategory('전체');
  };

  return (
    <main
      className='
        relative flex flex-none flex-col
        w-[calc(100%+40px)] -mx-5 -mt-15
        h-dvh min-h-0 overflow-hidden
        bg-bg font-pretendard
      '
    >
      <TopBar title='나의 활동' />

      <div className='shrink-0 pt-15'>
        <div
          role='tablist'
          aria-label='나의 활동 종류'
          className='
            grid grid-cols-2
            w-full h-[50px]
            border-b border-[#DEE2E6]
          '
        >
          <button
            type='button'
            role='tab'
            aria-selected={activeTab === 'team'}
            onClick={() => handleTabChange('team')}
            className={`
              relative
              flex items-center justify-center
              h-full
              text-[17px] font-semibold
              cursor-pointer
              ${activeTab === 'team' ? 'text-main' : 'text-[#868E96]'}
            `}
          >
            팀 매칭
            {activeTab === 'team' && (
              <span
                className='
                  absolute bottom-[-1px] left-0
                  w-full h-[2px] bg-main
                '
              />
            )}
          </button>

          <button
            type='button'
            role='tab'
            aria-selected={activeTab === 'event'}
            onClick={() => handleTabChange('event')}
            className={`
              relative
              flex items-center justify-center
              h-full
              text-[17px] font-semibold
              cursor-pointer
              ${activeTab === 'event' ? 'text-main' : 'text-[#868E96]'}
            `}
          >
            교내 행사
            {activeTab === 'event' && (
              <span
                className='
                  absolute bottom-[-1px] left-0
                  w-full h-[2px] bg-main
                '
              />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'team' ? (
        <>
          <div className='shrink-0 px-5'>
            <CategoryGroup selected={selectedCategory} setSelected={setSelectedCategory} />
          </div>

          {filteredActivities.length > 0 ? (
            <div
              className='
                min-h-0 flex-1
                overflow-y-auto
                px-5 pb-8
                [&::-webkit-scrollbar]:hidden
              '
            >
              <p className='mb-3 text-[14px] text-[#6C757D]'>
                작성한 팀 매칭 글이 <span className='font-medium text-[#343A40]'>{filteredActivities.length}개</span> 있어요.
              </p>

              <div className='flex flex-col gap-4'>
                {/* 에러나서 주석처리해둠... 컴포넌트 데이터 타입에 맞춰서 변경햇슴ㅠ */}
                {/* {filteredActivities.map((activity) => (
                  <TeamCard key={activity.id} {...activity} />
                ))} */}
              </div>
            </div>
          ) : (
            <div
              className='
                flex min-h-0 flex-1
                flex-col items-center justify-center
                gap-4 px-5 pb-12
              '
            >
              <Capybara className='w-[110px] h-auto' aria-hidden='true' />

              <p className='text-center text-[16px] font-medium text-[#5C636A]'>작성한 팀 모집글이 없어요.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {mockEvents.length > 0 ? (
            <div
              className='
                min-h-0 flex-1
                overflow-y-auto
                px-5 pt-5 pb-8
                [&::-webkit-scrollbar]:hidden
              '
            >
              <div className='flex flex-col gap-4'>
                {mockEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    // image={event.image}
                    title={event.title}
                    // startDate={event.date}
                    // endDate={event.date}
                    location={event.location}
                    likeCount={event.likeCount}
                    dislikeCount={event.dislikeCount}
                    status={event.status}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div
              className='
                flex min-h-0 flex-1
                flex-col items-center justify-center
                gap-4 px-5 pb-12
              '
            >
              <Capybara className='w-[110px] h-auto' aria-hidden='true' />

              <p
                className='
                  text-center
                  text-[16px] font-medium
                  text-[#5C636A]
                '
              >
                등록한 행사가 없어요.
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default MyActivityPage;
