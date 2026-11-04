import { useState } from 'react';
import More from '/src/assets/icons/more.svg?react';
import RightArrow from '/src/assets/icons/arrow_right.svg?react';
import Search from '/src/assets/icons/search.svg?react';
import CategoryGroup from '../../components/TeamMatch/Category/Category';
import TeamCard from '../../components/TeamMatch/TeamCard';
import ExTeamMatching from '/src/assets/images/ex_team-matching.png';
import { createPortal } from 'react-dom';
import X from '/src/assets/icons/x.svg?react';
import Capybara from '/src/assets/images/capy_face_surprise.svg?react';

// 무한스크롤

const mock = [
  {
    image: ExTeamMatching,
    title: '컴퓨터공학부 학술제',
    content: '학술제 같이 나가실 분 구해요! 성실히 참ㅇㄹㅇ여하실 분으로 구해봅니다. 프로젝트 경험 있으신 분 환영합니다!',
    date: '26.11.04. ~ 26.11.08.',
    writerName: '정다민',
    writerMajor: '미디어기술콘텐츠학부',
    writerGrage: 4,
    category: '공모전•대회',
    limitMember: 6,
    currentMember: 2,
  },
  {
    image: ExTeamMatching,
    title: '미디어콘텐츠학과 학술제',
    content: '학술제 같이 나가실 분 구해요! 성실히 참ㅇㄹㅇ여하실 분으로 구해봅니다. 프로젝트 경험 있으신 분 환영합니다!',
    date: '26.11.04. ~ 26.11.08.',
    writerName: '정다민',
    writerMajor: '미디어기술콘텐츠학부',
    writerGrage: 4,
    category: '기타',
    limitMember: 6,
    currentMember: 6,
  },
  {
    image: ExTeamMatching,
    title: '코딩테스트 스터디',
    content: '학술제 같이 나가실 분 구해요! 성실히 참ㅇㄹㅇ여하실 분으로 구해봅니다. 프로젝트 경험 있으신 분 환영합니다!',
    date: '26.11.04. ~ 26.11.08.',
    writerName: '정다민',
    writerMajor: '미디어기술콘텐츠학부',
    writerGrage: 4,
    category: '스터디',
    limitMember: 6,
    currentMember: 3,
  },
];

export default function TeamMatchingPage() {
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [selected, setSelected] = useState<string>('전체');
  const [searchKeyword, setSearchKeyword] = useState('');

  return (
    <>
      {isMoreModalOpen && <div className='fixed inset-x-0 top-0 bottom-22 z-30 bg-gray-700/23 w-full max-w-120 left-1/2 -translate-x-1/2' onClick={() => setIsMoreModalOpen(false)} aria-hidden='true' />}
      <div className='fixed z-20 flex flex-col w-full left-1/2 -translate-x-1/2 max-w-120 bg-bg px-5'>
        {/* 본문 비활성화 처리 */}
        {/* 상단 문구 */}
        <div className='flex flex-col gap-0.5 relative'>
          <div className='flex justify-between items-center'>
            <h1 className='font-pretendard font-bold text-xl text-gray-800 leading-7.5'>함께할 팀원을 찾아볼까요?</h1>
            <button type='button' onClick={() => setIsMoreModalOpen(true)} className=''>
              <More className='w-6 h-6 text-gray-700' />
            </button>
            {/* 더보기 모달 */}
            {isMoreModalOpen &&
              createPortal(
                <div className='fixed z-50 top-10 right-[calc((100vw-480px)/2+20px)] flex flex-col w-34 px-3 rounded-xl bg-[#fcfbfb]'>
                  <button type='button' className='flex items-center justify-between py-2 border-b border-gray-200'>
                    <span>내 게시물</span>
                    <RightArrow className='w-2.5 h-2.5' />
                  </button>

                  <button type='button' className='flex items-center justify-between py-2'>
                    <span>최근 본</span>
                    <RightArrow className='w-2.5 h-2.5' />
                  </button>
                </div>,
                document.body,
              )}
          </div>
          <p className='font-pretendard font-normal text-sm text-gray-700 leading-5.5'>공모전부터 스터디까지, 같이 할 팀을 구해보세요.</p>
        </div>

        {/* 검색바 */}
        <div className='mt-3 flex w-full min-w-0 gap-3 items-center justify-between py-2.5 px-3 bg-gray-100 rounded-3xl border border-gray-100'>
          <div className='flex gap-3 items-center w-full'>
            <Search className='w-4.5 h-4.5 text-gray-600' />
            <label htmlFor='search' className='hidden'>
              검색창
            </label>
            <input type='text' name='search' id='search' placeholder='관심 있는 행사나 활동 내용을 검색해보세요.' className='flex-1 min-w-0  placeholder:text-gray-700 text-gray-900 font-pretendard font-normal text-[13px]' value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
          </div>
          {searchKeyword && (
            <button type='button' onClick={() => setSearchKeyword('')} className='shrink-0' aria-label='검색어 삭제'>
              <X className='w-6 h-6 text-gray-700' />
            </button>
          )}
        </div>

        {/* 카테고리 필터 */}
        <CategoryGroup selected={selected} setSelected={setSelected} />
      </div>

      {/* 팀매칭 카드 */}
      <div className='mt-46 flex flex-col gap-4'>
        {mock.filter((m) => {
          const matchCategory = selected === '전체' || selected === m.category;

          const keyword = searchKeyword.trim().toLowerCase();

          const matchKeyword = m.title.toLowerCase().includes(keyword) || m.content.toLowerCase().includes(keyword);

          return matchCategory && matchKeyword;
        }).length > 0 ? (
          mock
            .filter((m) => {
              const matchCategory = selected === '전체' || selected === m.category;

              const keyword = searchKeyword.trim().toLowerCase();

              const matchKeyword = m.title.toLowerCase().includes(keyword) || m.content.toLowerCase().includes(keyword);

              return matchCategory && matchKeyword;
            })
            .map((m) => <TeamCard key={m.title} image={m.image} title={m.title} content={m.content} date={m.date} writerName={m.writerName} writerMajor={m.writerMajor} writerGrage={m.writerGrage} category={m.category} limitMember={m.limitMember} currentMember={m.currentMember} />)
        ) : (
          <div className='flex flex-col items-center justify-center py-25 gap-3.5'>
            <Capybara className='w-25' />
            <p className='font-pretendard font-medium text-base text-gray-700'>팀 모집글이 없어요.</p>
          </div>
        )}
      </div>
    </>
  );
}
