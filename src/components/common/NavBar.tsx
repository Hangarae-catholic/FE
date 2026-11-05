import { useLocation, Link, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/NAV_ITEMS';
import { useEffect, useState } from 'react';
import RightArrow from '/src/assets/icons/arrow_right.svg?react';

export default function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    if (!isOpenModal) return;

    // 기존 스크롤 상태 저장
    const prevOverflow = document.body.style.overflow;

    // 배경 스크롤 비활성화
    document.body.style.overflow = 'hidden';

    return () => {
      // 모달이 닫히면 기존 상태로 복구
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpenModal]);

  const handleClickAddEvent = () => {
    navigate('/add-event');
    setIsOpenModal(false);
  };

  const handleClickCreateTeam = () => {
    navigate('/team-match/create');
    setIsOpenModal(false);
  };

  return (
    <>
      {/* 본문 비활성화 처리 */}
      {isOpenModal && <div className='h-full fixed inset-x-0 top-0 bottom-22 z-30 bg-gray-800/25 w-full max-w-120 left-1/2 -translate-x-1/2' onClick={() => setIsOpenModal(false)} aria-hidden='true' />}

      <nav aria-label='하단 내비게이션' className='fixed bottom-0 left-0 right-0 mx-auto z-30 w-full max-w-120 h-22 bg-white'>
        <ul className='flex items-center justify-around h-full'>
          {NAV_ITEMS.map((item, index) => {
            // plus button
            if (!item.path) {
              return (
                <li key={`plus-${index}`} className='relative flex items-center justify-center -translate-y-1/2'>
                  {/* 모달 */}
                  {isOpenModal && (
                    <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-3 flex flex-col w-34 px-3 rounded-xl bg-[#fcfbfb]'>
                      <button type='button' className='flex items-center justify-between py-2 border-b border-gray-200' onClick={handleClickAddEvent}>
                        <span className='font-pretendard font-normal text-sm text-gray-800'>행사 추가</span>
                        <RightArrow className='w-2.5 h-2.5 text-gray-700' />
                      </button>

                      <button type='button' className='flex items-center justify-between py-2' onClick={handleClickCreateTeam}>
                        <span className='font-pretendard font-normal text-sm text-gray-800'>팀 매칭 생성</span>
                        <RightArrow className='w-2.5 h-2.5 text-gray-700' />
                      </button>
                    </div>
                  )}

                  {/* Plus 버튼 */}
                  <div className='bg-white rounded-full p-1'>
                    <button type='button' aria-label='추가 메뉴' aria-expanded={isOpenModal} onClick={() => setIsOpenModal((prev) => !prev)} className='flex items-center justify-center w-14 h-14 rounded-full bg-main text-white'>
                      <item.icon className={`w-6 h-6 transition-transform duration-200 ${isOpenModal ? 'rotate-45' : 'rotate-0'}`} />
                    </button>
                  </div>
                </li>
              );
            }

            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(`${item.path}/`));

            return (
              <li key={item.path} className='flex-1 h-full'>
                <Link to={item.path} aria-current={isActive ? 'page' : undefined} className='flex flex-col items-center justify-center w-full h-full gap-1'>
                  <item.icon className={`${isActive ? 'text-gray-800' : 'text-gray-600'} w-6 h-6`} />
                  <span className={`${isActive ? 'text-gray-800' : 'text-gray-600'} font-pretendard font-medium text-xs`}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
