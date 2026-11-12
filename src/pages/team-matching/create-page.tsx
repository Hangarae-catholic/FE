import { useState } from 'react';
import TopBar from '../../components/common/TopBar';
import Modal from '../../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import DateDropdown from '../../components/AddEventPage/DatePicker';
import EventCalender from '/src/assets/icons/calendar_event.svg?react';
import Dropdown from 'react-dropdown';
import ArrowDown from '/src/assets/icons/arrow_down.svg?react';
import KakaoTalk from '/src/assets/icons/kakao.svg?react';
import Instagram from '/src/assets/icons/instagram.svg?react';
import Mail from '/src/assets/icons/mail.svg?react';
import Add from '/src/assets/icons/add.svg?react';
import Minus from '/src/assets/icons/minus.svg?react';
import Camera from '/src/assets/icons/camera.svg?react';
import Delete from '/src/assets/icons/delete.svg?react';
import { STUDENT_STATUS } from '../../constants/STUDENT_STATUS';
import { Department } from '../../constants/DEPARTMENT';
import { uploadImageToS3 } from '../../apis/s3';
import type { TeamCreate } from '../../types/team';
import { postTeamCreate } from '../../apis/team';
import { CATEGORIES } from '../../constants/CATEGORY';

export default function TeamCreatePage() {
  const navigate = useNavigate();
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [recruitName, setRecruitName] = useState('');
  const [recruitStartDate, setRecruitStartDate] = useState<Date | null>(new Date());
  const [isRecruitStartDateSelected, setIsRecruitStartDateSelected] = useState(false);
  const [recruitEndDate, setRecruitEndDate] = useState<Date | null>(new Date());
  const [isRecruitEndDateSelected, setIsRecruitEndDateSelected] = useState(false);
  const [recruitNumber, setRecruitNumber] = useState('');
  const [category, setCategory] = useState('');
  const [recruitContent, setRecruitContent] = useState('');
  const [addKakao, setAddKakao] = useState(false);
  const [addInstagram, setAddInstagram] = useState(false);
  const [addMail, setAddMail] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isOpenSubmitModal, setIsOpenSubmitModal] = useState(false);
  const [kakaoUrl, setKakaoUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [mailUrl, setMailUrl] = useState('');

  const options = ['교과', '공모전•대회', '스터디', '기타'];

  const limitLength = (value: string) => {
    return Array.from(value).slice(0, 20).join('');
  };

  const handlerecruitNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecruitName(limitLength(e.target.value));
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    const value = limitLength(e.currentTarget.value);
    setRecruitName(value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...files]);
    }
  };

  // 사용자 정보 불러오기
  const userName = '정다민';
  const userStatus = 'YEAR_4';
  const userDepartment = 'MEDIA_TECHNOLOGY_CONTENTS';

  const handleSubmit = async () => {
    try {
      // 이미지 존재 시 이미지 업로드
      // s3에 업로드한 이미지 url
      const uploadedUrls: string[] = [];

      if (selectedImages) {
        for (const file of selectedImages) {
          const res = await uploadImageToS3(file);

          if (res.httpStatus === '200 OK' && res.data) {
            uploadedUrls.push(res.data?.url);
          } else {
            console.error('이미지 업로드 실패', res.message);
          }
        }
      }

      const postData: TeamCreate = {
        title: recruitName,
        startAt: recruitStartDate,
        endAt: recruitEndDate,
        maxMember: Number(recruitNumber),
        category: CATEGORIES.find((c) => c.type === category)?.id,
        detail: recruitContent,
        contacts: [...(kakaoUrl ? [{ type: 'KAKAO_OPEN_CHAT', url: kakaoUrl }] : []), ...(instagramUrl ? [{ type: 'INSTAGRAM', url: instagramUrl }] : []), ...(mailUrl ? [{ type: 'ETC', url: mailUrl }] : [])],
        imageUrls: uploadedUrls ?? [],
      };

      await postTeamCreate(postData);
      alert('모집글이 등록되었습니다.');
      navigate('/team-match');
    } catch (e) {
      console.error(e);
      alert('게시글 작성을 실패했습니다.');
    }
  };

  return (
    <>
      <TopBar title='팀 매칭 생성' leftOnClick={() => setIsBackModalOpen(true)} />
      {/* 뒤로가기 모달 */}
      {isBackModalOpen && <Modal title='팀 모집을 그만둘까요?' content='지금 나가면 작성 중인 내용이 저장되지 않고 사라져요.' leftBtn='계속 작성' cancel={() => setIsBackModalOpen(false)} rightBtn='나가기' onClick={() => navigate(-1)} />}

      <div className='flex flex-col gap-4.5 px-5'>
        {/* 활동명 */}
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='event-name' className='flex gap-0.5'>
            <span className='font-pretendard font-medium text-base text-gray-800'>활동명</span>
            <span aria-required='true' className='font-pretendard font-medium text-base text-error'>
              *
            </span>
          </label>
          <input type='text' name='event-name' id='event-name' placeholder='활동명을 입력해주세요.' className='font-pretendard placeholder:font-semibold text-base placeholder:text-gray-500 bg-gray-200 px-5 w-full h-13 rounded-xl font-normal text-gray-800' value={recruitName} onChange={handlerecruitNameChange} onCompositionEnd={handleCompositionEnd} maxLength={20} />
          <span className='flex justify-end font-pretendard font-normal text-sm text-gray-600'>{recruitName.length}/20</span>
        </div>

        {/* 모집기간 */}
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='event-name' className='flex gap-0.5'>
            <span className='font-pretendard font-medium text-base text-gray-800'>모집기간</span>
            <span aria-required='true' className='font-pretendard font-medium text-base text-error'>
              *
            </span>
          </label>
          {/* 시작일 */}
          <div className='w-full bg-white border border-gray-300 rounded-xl px-3 py-4 flex items-center gap-4 max-[380px]:gap-0'>
            <div className='flex items-center gap-2 leading-none'>
              <div className='flex items-center leading-none'>
                {/* 캘린더 클릭 시 datepicker */}
                <EventCalender className='w-6 h-6 text-gray-600' />
                <span className='font-pretendard font-normal text-sm text-gray-600 max-[380px]:text-xs'>시작일</span>
              </div>
              <div className='flex items-center gap-2 leading-none'>
                {/* 날짜 선택 */}
                <DateDropdown
                  value={recruitStartDate}
                  onChange={(date) => {
                    setRecruitStartDate(date);
                    setIsRecruitStartDateSelected(true);
                  }}
                  isDateSelected={isRecruitStartDateSelected}
                  showArrow={false}
                />
              </div>
            </div>
            <span className='font-pretendard font-normal text-base text-gray-700'>~</span>
            {/* 종료일 */}
            <div className='flex items-center gap-2 leading-none'>
              <div className='flex items-center leading-none'>
                {/* 캘린더 클릭 시 datepicker */}
                <EventCalender className='w-6 h-6 text-gray-600' />
                <span className='font-pretendard font-normal text-sm text-gray-600 max-[375px]:text-xs'>종료일</span>
              </div>
              <div className='flex items-center gap-2'>
                {/* 날짜 선택 */}
                <DateDropdown
                  value={recruitEndDate}
                  onChange={(date) => {
                    setRecruitEndDate(date);
                    setIsRecruitEndDateSelected(true);
                  }}
                  isDateSelected={isRecruitEndDateSelected}
                  showArrow={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 모집인원 */}
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='event-name' className='flex gap-0.5'>
            <span className='font-pretendard font-medium text-base text-gray-800'>모집인원</span>
            <span aria-required='true' className='font-pretendard font-medium text-base text-error'>
              *
            </span>
          </label>
          <div className='relative'>
            <input type='number' name='event-name' id='event-name' placeholder='모집할 인원을 입력해주세요.' className='font-pretendard placeholder:font-semibold text-base placeholder:text-gray-500 bg-gray-200 px-5 w-full h-13 rounded-xl font-normal text-gray-800' value={recruitNumber} onChange={(e) => setRecruitNumber(e.target.value)} />
            <span className='absolute top-1/2 -translate-y-1/2 right-5 font-pretendard font-semibold text-base text-gray-700'>명</span>
          </div>
        </div>

        {/* 카테고리 */}
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='event-name' className='flex gap-0.5'>
            <span className='font-pretendard font-medium text-base text-gray-800'>카테고리</span>
            <span aria-required='true' className='font-pretendard font-medium text-base text-error'>
              *
            </span>
          </label>
          <Dropdown
            baseClassName='CustomDropdown'
            className='w-full px-5 py-4 rounded-xl border border-gray-300 bg-white relative'
            options={options}
            value={category}
            onChange={(option) => setCategory(option.value.toString())}
            placeholder='카테고리를 선택해주세요.'
            controlClassName='flex items-center w-full flex justify-between'
            placeholderClassName={`'font-pretendard text-base select-none' ${options.some((option) => option === category) ? 'text-gray-800 font-normal' : 'text-gray-500 font-semibold'} `}
            menuClassName='absolute left-0 top-full w-full z-50 overflow-y-auto rounded-xl border border-gray-300 bg-white'
            optionClassName='font-pretendard font-medium text-base text-gray-800 py-3 px-5 border-t border-gray-300 select-none'
            arrowClosed={<ArrowDown className='w-6 h-6 text-gray-700' />}
            arrowOpen={<ArrowDown className='w-6 h-6 text-gray-700 rotate-180' />}
          />
        </div>

        {/* 활동 내용 */}
        <div className='mt-4.5 flex flex-col gap-1.5'>
          <label className='font-pretendard font-medium text-base text-gray-800'>활동 내용</label>
          <div className='flex flex-col gap-1'>
            <textarea name='event-content' id='event-content' className='bg-gray-200 placeholder:font-semibold placeholder:text-gray-500 font-pretendard text-base font-normal text-gray-800 px-5 py-3.5 rounded-xl h-26 resize-none overflow-y-scroll' placeholder='해당 활동에 대해 자세히 작성해주세요.' value={recruitContent} maxLength={500} onChange={(e) => setRecruitContent(e.target.value)} />
            <span className='flex justify-end font-pretendard font-normal text-sm text-gray-600'>{recruitContent.length}/500</span>
          </div>
        </div>

        {/* 연락수단 */}
        <div className='flex flex-col gap-1.5'>
          <div>
            <label htmlFor='event-name' className='flex gap-0.5'>
              <span className='font-pretendard font-medium text-base text-gray-800'>연락 수단</span>
              <span aria-required='true' className='font-pretendard font-medium text-base text-error'>
                *
              </span>
            </label>
            <p className='font-pretendard font-normal text-gray-700 text-sm'>최소 1개 이상의 연락 수단을 등록해주세요.</p>
          </div>

          <div className='flex flex-col w-full gap-2'>
            {addKakao ? (
              <div className='w-full flex justify-between items-center gap-2 px-3.5 py-2.5 bg-white rounded-xl border border-gray-300'>
                <div className='w-full flex gap-2 items-center'>
                  <KakaoTalk className='w-6 h-6' />
                  <input type='text' className='w-full font-pretendard font-normal text-base placeholder:text-gray-500 text-gray-900' placeholder='링크 붙여넣기' value={kakaoUrl} onChange={(e) => setKakaoUrl(e.target.value)}></input>
                </div>
                <button
                  type='button'
                  onClick={() => {
                    setAddKakao(false);
                    setKakaoUrl('');
                  }}
                >
                  <Minus className='w-6 h-6 text-error' />
                </button>
              </div>
            ) : (
              <button type='button' className='flex justify-between items-center px-3.5 py-2.5 bg-white rounded-xl border border-gray-300' onClick={() => setAddKakao(true)}>
                <div className='flex gap-2 items-center'>
                  <KakaoTalk className='w-6 h-6' />
                  <p className='font-pretendard font-normal text-base text-gray-700'>카카오톡 오픈 채팅</p>
                </div>
                <Add className='w-6 h-6 text-gray-700' />
              </button>
            )}
            {addInstagram ? (
              <div className='w-full flex justify-between items-center gap-2 px-3.5 py-2.5 bg-white rounded-xl border border-gray-300'>
                <div className='w-full flex gap-2 items-center'>
                  <Instagram className='w-6 h-6' />
                  <input type='text' className='w-full font-pretendard font-normal text-base placeholder:text-gray-500 text-gray-900' placeholder='아이디 입력' value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)}></input>
                </div>
                <button
                  type='button'
                  onClick={() => {
                    setAddInstagram(false);
                    setInstagramUrl('');
                  }}
                >
                  <Minus className='w-6 h-6 text-error' />
                </button>
              </div>
            ) : (
              <button type='button' className='flex justify-between items-center px-3.5 py-2.5 bg-white rounded-xl border border-gray-300' onClick={() => setAddInstagram(true)}>
                <div className='flex gap-2 items-center'>
                  <Instagram className='w-6 h-6' />
                  <p className='font-pretendard font-normal text-base text-gray-700'>인스타그램</p>
                </div>
                <Add className='w-6 h-6 text-gray-700' />
              </button>
            )}
            {addMail ? (
              <div className='w-full flex justify-between items-center gap-2 px-3.5 py-2.5 bg-white rounded-xl border border-gray-300'>
                <div className='w-full flex gap-2 items-center'>
                  <Mail className='w-6 h-6' />
                  <input type='text' className='w-full font-pretendard font-normal text-base placeholder:text-gray-500 text-gray-900' placeholder='그 외(이메일, 전화 번호 등) 입력' value={mailUrl} onChange={(e) => setMailUrl(e.target.value)}></input>
                </div>
                <button
                  type='button'
                  onClick={() => {
                    setAddMail(false);
                    setMailUrl('');
                  }}
                >
                  <Minus className='w-6 h-6 text-error' />
                </button>
              </div>
            ) : (
              <button type='button' className='flex justify-between items-center px-3.5 py-2.5 bg-white rounded-xl border border-gray-300' onClick={() => setAddMail(true)}>
                <div className='flex gap-2 items-center'>
                  <Mail className='w-6 h-6' />
                  <p className='font-pretendard font-normal text-base text-gray-700'>그 외(이메일, 전화 번호 등)</p>
                </div>
                <Add className='w-6 h-6 text-gray-700' />
              </button>
            )}
          </div>
        </div>

        {/* 이미지 첨부 */}
        <div className='flex flex-col gap-1.5'>
          <div>
            <span className='font-pretendard font-medium text-base text-gray-800'>이미지 첨부</span>
            <p className='font-pretendard font-normal text-sm text-gray-700'>최대 3장까지 가능해요.</p>
          </div>

          <div className='flex items-center'>
            {selectedImages.length > 0 && (
              <div>
                <div className='flex gap-1.5 w-full'>
                  {selectedImages.map((image, idx) => (
                    <div key={idx} className='relative w-25 h-25 shrink-0 flex'>
                      <img src={URL.createObjectURL(image)} alt={`미리보기 ${idx + 1}`} className='w-full h-full object-cover' />
                      <button type='button' onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== idx))}>
                        <Delete className='absolute top-1 right-1 w-5.5 h-5.5' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedImages.length < 3 && (
              <label className='w-25 h-25 flex justify-center items-center bg-gray-200 ml-1.5'>
                <Camera className='w-6 h-6 text-gray-600' />
                <input type='file' accept='image/*' multiple className='hidden' onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        {/* 팀장 정보 */}
        <div>
          <span className='font-pretendard font-medium text-base text-gray-800 leading-6'>담당자 정보</span>
          <p className='font-pretendard font-normal text-sm text-gray-700 leading-5.5'>
            {userName}•{STUDENT_STATUS.find((ss) => ss.id === userStatus)?.name}•{Department.find((d) => d.id === userDepartment)?.name}
          </p>
        </div>

        {/* 완료 버튼 */}
        <button type='button' className={`w-full mt-8.5 bg-main py-3.5 font-pretendard font-semibold text-base text-gray-50 rounded-xl disabled:bg-gray-400`} onClick={() => setIsOpenSubmitModal(true)} disabled={!recruitName || !isRecruitStartDateSelected || !isRecruitEndDateSelected || !recruitNumber || !category || (!kakaoUrl && !instagramUrl && !mailUrl)}>
          완료
        </button>

        {/* 완료 모달 */}
        {isOpenSubmitModal && <Modal title='팀 모집글을 등록할까요?' content='등록한 모집글과 연락 수단이 다른 학생들에게 공개돼요.' leftBtn='취소' cancel={() => setIsOpenSubmitModal(false)} rightBtn='등록하기' onClick={handleSubmit} />}
      </div>
    </>
  );
}
