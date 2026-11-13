import { useEffect, useState } from 'react';
import More from '/src/assets/icons/more.svg?react';
import RightArrow from '/src/assets/icons/arrow_right.svg?react';
import Search from '/src/assets/icons/search.svg?react';
import CategoryGroup from '../../components/TeamMatch/Category/Category';
import TeamCard from '../../components/TeamMatch/TeamCard';
import { createPortal } from 'react-dom';
import X from '/src/assets/icons/x.svg?react';
import Capybara from '/src/assets/images/capy_face_surprise.svg?react';
import ArrowDown from '/src/assets/icons/arrow_down.svg?react';
import Dropdown from 'react-dropdown';
import { getTeamPosts } from '../../apis/team';
import type { TeamPostRetrieveResponse } from '../../types/team';
import { CATEGORIES } from '../../constants/CATEGORY';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export default function TeamMatchingPage() {
  const navigate = useNavigate();
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [selected, setSelected] = useState<string>('전체');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const [isKeywordSubmitted, setIsKeywordSubmitted] = useState(false);

  const options = ['최신 순', '오래된 순'];
  const [latestFirst, setLatestFirst] = useState(true);

  const [teamPosts, setTeamPosts] = useState<TeamPostRetrieveResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamPosts = async () => {
      try {
        setLoading(true);

        const category = selected === '전체' ? undefined : CATEGORIES.find((c) => c.type === selected)?.id;

        const keyword = submittedKeyword.trim() || undefined;

        const data = await getTeamPosts(category, keyword, latestFirst);

        setTeamPosts(data);
        if (submittedKeyword) {
          setIsKeywordSubmitted(true);
        }
      } catch (error) {
        console.error('팀 모집글 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamPosts();
  }, [selected, submittedKeyword, latestFirst]);

  useEffect(() => {
    if (!isMoreModalOpen) return;

    // 기존 스크롤 상태 저장
    const prevOverflow = document.body.style.overflow;

    // 배경 스크롤 비활성화
    document.body.style.overflow = 'hidden';

    return () => {
      // 모달이 닫히면 기존 상태로 복구
      document.body.style.overflow = prevOverflow;
    };
  }, [isMoreModalOpen]);

  // 로딩스피너
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* 본문 비활성화 처리 */}
      {isMoreModalOpen && <div className='fixed inset-x-0 top-0 bottom-22 z-30 mx-auto w-full max-w-120 bg-gray-700/23' onClick={() => setIsMoreModalOpen(false)} aria-hidden='true' />}
      <div className='pt-1 top-0 fixed z-20 flex flex-col w-full left-1/2 -translate-x-1/2 max-w-120 bg-bg px-5'>
        {/* 상단 문구 */}
        <div className='relative flex flex-col gap-0.5'>
          <div className='flex items-center justify-between'>
            <h1 className='font-pretendard text-xl font-bold leading-7.5 text-gray-800'>함께할 팀원을 찾아볼까요?</h1>

            <button type='button' onClick={() => setIsMoreModalOpen(true)}>
              <More className='h-6 w-6 text-gray-700' />
            </button>
            {/* 더보기 모달 */}
            {isMoreModalOpen &&
              createPortal(
                <div className='fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-120'>
                  <div className='absolute right-5 top-10 flex w-34 flex-col rounded-xl bg-[#fcfbfb] px-3'>
                    <button type='button' className='flex items-center justify-between border-b border-gray-200 py-2' onClick={() => navigate(`/my/activity`)}>
                      <span className='font-pretendard text-sm font-normal text-gray-800'>내 게시물</span>
                      <RightArrow className='h-2.5 w-2.5' />
                    </button>
                  </div>
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
            <input
              type='text'
              name='search'
              id='search'
              placeholder='관심 있는 행사나 활동 내용을 검색해보세요.'
              className='flex-1 min-w-0 placeholder:text-gray-700 text-gray-900 font-pretendard font-normal text-[13px]'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSubmittedKeyword(searchKeyword.trim());
                }
              }}
            />
          </div>
          {searchKeyword && (
            <button
              type='button'
              onClick={() => {
                setSearchKeyword('');
                setSubmittedKeyword('');
                setIsKeywordSubmitted(false);
              }}
              className='shrink-0'
              aria-label='검색어 삭제'
            >
              <X className='w-6 h-6 text-gray-700' />
            </button>
          )}
        </div>

        {/* 카테고리 필터 */}
        <CategoryGroup selected={selected} setSelected={setSelected} />

        {/* 정렬 드롭다운 */}
        <div className={`mb-3 flex items-center ${isKeywordSubmitted ? 'justify-between ' : 'justify-end'}`}>
          {isKeywordSubmitted && (
            <p className='font-pretendard font-normal text-sm flex items-center gap-1.5 text-gray-800'>
              '{submittedKeyword}'<span className='text-gray-700'>검색 결과</span>
              {teamPosts?.data?.length}개
            </p>
          )}

          <Dropdown
            baseClassName='CustomDropdown'
            className='w-fit px-2 py-1 rounded-sm border border-gray-300 bg-white relative'
            options={options}
            value={latestFirst ? '최신 순' : '오래된 순'}
            onChange={(option) => setLatestFirst(option.value === '최신 순')}
            controlClassName='flex items-center w-full flex justify-between'
            placeholderClassName='font-pretendard font-normal text-[13px] text-gray-800 select-none'
            menuClassName='absolute left-0 top-full w-full z-50 overflow-y-auto rounded-sm border border-gray-300 bg-white'
            optionClassName='font-pretendard font-normal text-[13px] text-gray-800 py-1 px-2 border-t border-gray-300 select-none'
            arrowClosed={<ArrowDown className='w-6 h-6 text-gray-600' />}
            arrowOpen={<ArrowDown className='w-6 h-6 text-gray-600 rotate-180' />}
          />
        </div>
      </div>

      {/* 팀매칭 카드 */}
      <div className='mt-55 flex flex-col gap-4'>
        {teamPosts?.data && teamPosts.data.length > 0 ? (
          teamPosts.data.map((tp) => <TeamCard key={tp.teamId} title={tp.title} startDate={tp.startAt} endDate={tp.endAt} writerName={tp.userName} writerMajor={tp.department} writerStatus={tp.studentStatus} category={tp.category} limitMember={tp.maxMember} currentMember={tp.maxMember - tp.remainingMember} status={tp.teamStatus} id={tp.teamId} image={tp.imageUrl} content={tp.detail} />)
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
