import { useEffect, useState } from 'react';
import TopBar from '../../components/common/TopBar';
import More from '/src/assets/icons/more.svg?react';
import RightArrow from '/src/assets/icons/arrow_right.svg?react';
import Calendar from '/src/assets/icons/calendar_event.svg?react';
import Member from '/src/assets/icons/member.svg?react';
import Modal from '../../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import ExTeamMatching from '/src/assets/images/ex_team-matching.png';
import KakaoTalk from '/src/assets/icons/kakao.svg?react';
import Instagram from '/src/assets/icons/instagram.svg?react';
import Mail from '/src/assets/icons/mail.svg?react';

const user = '정다민';

const mock = [
  {
    writerName: '정다민',
    writerGrade: 4,
    writerMajor: '미디어기술콘텐츠학과',
    writerProfile: ExTeamMatching,
    title: '컴퓨터공학부 학술제',
    content: '학술제 같이 나가실 분 구해요! 성실히 참여하실 분으로 구해봅니다. 프로젝트 경험 있으신 분 환영합니다! 프로젝트 경험 있으신 분 환영합니다!',
    category: '공모전•대회',
    term: '2026.11.04. ~ 2026.11.29.',
    limitMember: 4,
    currentMember: 2,
    image: ExTeamMatching,
    contact: [
      {
        kakao: 'https://open.kakao.com/o/dfdfdffdfdfdfdfdf',
      },
      {
        instagram: 'https://instagram.com/o/dfdfdffdfdfdfdfdf',
      },
      {
        etc: '010-1234-5678',
      },
    ],
  },
];

export default function TeamMatchDetailPage() {
  const navigate = useNavigate();
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleDelete = () => {
    // 삭제 후 알림
    alert('삭제되었습니다.');
    navigate('/team-match');
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setIsMoreModalOpen(false);
  };

  return (
    <>
      {/* 본문 비활성화 처리 */}
      {isMoreModalOpen && <div className='h-full fixed inset-x-0 top-0 bottom-22 z-40 bg-gray-700/23 w-full max-w-120 left-1/2 -translate-x-1/2' onClick={() => setIsMoreModalOpen(false)} aria-hidden='true' />}
      {/* 상단바 */}
      <div className='relative'>
        {user === mock[0].writerName ? <TopBar title='팀 매칭 상세' rightIcon={More} rightOnClick={() => setIsMoreModalOpen(true)} /> : <TopBar title='팀 매칭 상세' />}

        {isMoreModalOpen && (
          <div className='absolute z-50 -top-5 right-2 flex flex-col w-34 px-3 rounded-xl bg-[#fcfbfb]'>
            <button type='button' className='flex items-center justify-between py-2 border-b border-gray-200'>
              <span className='font-pretendard font-normal text-sm text-gray-800'>글 수정하기</span>
              <RightArrow className='w-2.5 h-2.5' />
            </button>

            <button type='button' className='flex items-center justify-between py-2' onClick={() => setIsDeleteModalOpen(true)}>
              <span className='font-pretendard font-normal text-sm text-gray-800'>글 삭제하기</span>
              <RightArrow className='w-2.5 h-2.5' />
            </button>
          </div>
        )}

        {isDeleteModalOpen && <Modal title='팀 모집글을 삭제할까요?' content='삭제한 모집글은 복구할 수 없어요.' leftBtn='취소' cancel={handleCancel} rightBtn='삭제하기' rightBtnColor='RED' onClick={handleDelete} />}
      </div>

      {/* 본문 내용 */}
      <img src={mock[0].image} alt='이미지' className='w-full max-h-37.5 object-fill rounded-t-xl' />

      <div className='px-5'>
        <div className='flex gap-1.5 items-center justify-between mt-5'>
          <span className='font-pretendard font-normal text-[13px] bg-white text-gray-800 py-1 px-3 rounded-3xl border border-orange-300'>{mock[0].category}</span>
          <span className={`font-pretendard font-normal text-[13px] py-1 px-3 rounded-3xl ${mock[0].limitMember === mock[0].currentMember ? 'text-gray-600 bg-gray-300' : 'bg-[#DAF6DF] text-[#0D8D3D]'}`}>{mock[0].limitMember === mock[0].currentMember ? '모집완료' : '모집중'}</span>
        </div>

        <div className='mt-3'>
          <h1 className='font-pretendard font-semibold text-lg text-gray-800 leading-7'>{mock[0].title}</h1>
          <p className='font-pretendard font-normal text-sm text-gray-700 leading-5.5 line-clamp-2'>{mock[0].content}</p>
        </div>

        <div>
          <div className='flex gap-2 items-center mt-4.5'>
            <img src={mock[0].writerProfile} alt={`${mock[0].writerName}의 프로필`} className='w-10.5 h-10.5 rounded-full object-fill' />
            <div className='flex flex-col'>
              <span className='font-pretendard font-normal text-[13px] text-gray-800'>{mock[0].writerName}</span>
              <span className='font-pretendard font-normal text-sm text-gray-600'>
                {mock[0].writerMajor} • {mock[0].writerGrade}학년
              </span>
            </div>
          </div>

          <div className='mt-4.5 flex flex-col gap-4'>
            <div className='flex gap-3 items-center'>
              <Calendar className='w-6.5 h-6.5 text-gray-600' />
              <div className='flex flex-col'>
                <span className='font-pretendard font-normal text-sm text-gray-700'>모집 기간</span>
                <span className='font-pretendard font-medium text-base text-gray-800'>{mock[0].term}</span>
              </div>
            </div>
            <div className='flex gap-3 items-center pb-4.5 border-b border-gray-300'>
              <Member className='w-6.5 h-6.5 text-gray-600' />
              <div className='flex flex-col'>
                <span className='font-pretendard font-normal text-sm text-gray-700'>모집 인원</span>
                <span className='font-pretendard font-medium text-base text-gray-800'>
                  <span className='text-main'>{mock[0].currentMember}</span> / {mock[0].limitMember}명
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-4.5 flex flex-col gap-2 px-5'>
        <span className='font-pretendard font-medium text-sm text-gray-800'>연락수단</span>
        <p className='font-pretendard font-normal text-[13px] text-gray-700'>관심 있는 팀인가요? 팀장에게 직접 연락해 참여 의사를 전해 보세요</p>
        {mock[0].contact[0].kakao && (
          <div className='flex gap-2 px-3.5 py-2.5 bg-white rounded-xl border border-gray-300'>
            <KakaoTalk className='w-6 h-6' />
            <a href={mock[0].contact[0].kakao} target='_blank' rel='noopener noreferrer' className='font-pretendard font-normal text-base text-gray-700 underline truncate'>
              {mock[0].contact[0].kakao}
            </a>
          </div>
        )}
        {mock[0].contact[1].instagram && (
          <div className='flex gap-2 px-3.5 py-2.5 bg-white rounded-xl border border-gray-300'>
            <Instagram className='w-6 h-6' />
            <a href={mock[0].contact[1].instagram} target='_blank' rel='noopener noreferrer' className='font-pretendard font-normal text-base text-gray-700 underline truncate'>
              {mock[0].contact[1].instagram}
            </a>
          </div>
        )}
        {mock[0].contact[2].etc && (
          <div className='flex gap-2 px-3.5 py-2.5 bg-white rounded-xl border border-gray-300'>
            <Mail className='w-6 h-6' />
            <a href={mock[0].contact[2].etc} target='_blank' rel='noopener noreferrer' className='font-pretendard font-normal text-base text-gray-700 underline truncate'>
              {mock[0].contact[2].etc}
            </a>
          </div>
        )}
      </div>

      <div className='mt-4 px-5 flex flex-col gap-2'>
        <span className='font-pretendard font-medium text-sm text-gray-800'>활동 소개</span>
        <p className='font-pretendard font-normal text-sm text-gray-700'>{mock[0].content}</p>
      </div>
    </>
  );
}
