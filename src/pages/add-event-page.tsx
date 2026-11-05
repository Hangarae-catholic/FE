import { useEffect, useRef, useState } from 'react';
import Camera from '/src/assets/icons/camera.svg?react';
import Delete from '/src/assets/icons/delete.svg?react';
import EventCalender from '/src/assets/icons/calendar_event.svg?react';
import DateDropdown from '../components/AddEventPage/DatePicker';
import CurrentTime from '../utils/CurrentTime';
import StartTimePicker from '../components/AddEventPage/TimePicker';
import ArrowDown from '/src/assets/icons/arrow_down.svg?react';
import Marker from '/src/assets/icons/marker.svg?react';
import Modal from '../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/common/TopBar';

const mock = [
  {
    name: '정다민',
    grade: '4학년',
    major: '미디어기술콘텐츠학부',
  },
];

export default function AddEventPage() {
  const navigate = useNavigate();

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [eventName, setEventName] = useState('');
  const [eventOrgan, setEventOrgan] = useState('');
  const [startEventDate, setStartEventDate] = useState<Date | null>(new Date());
  const [endEventDate, setEndEventDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<string>(CurrentTime());
  const [endTime, setEndTime] = useState<string>(CurrentTime());
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);
  const startTimePickerRef = useRef<HTMLDivElement>(null);
  const endTimePickerRef = useRef<HTMLDivElement>(null);
  const [isStartDateSelected, setIsStartDateSelected] = useState(false);
  const [isEndDateSelected, setIsEndDateSelected] = useState(false);
  const [isStartTimeSelected, setIsStartTimeSelected] = useState(false);
  const [isEndTimeSelected, setIsEndTimeSelected] = useState(false);
  const [eventContent, setEventContent] = useState('');
  const [isOpenSubmitModal, setIsOpenSubmitModal] = useState(false);
  const [isOpenBackModal, setIsOpenBackModal] = useState(false);

  // 타임 피커 영역 감지
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (startTimePickerRef.current && !startTimePickerRef.current.contains(event.target as Node)) {
        setIsStartTimePickerOpen(false);
      }
      if (endTimePickerRef.current && !endTimePickerRef.current.contains(event.target as Node)) {
        setIsEndTimePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...files]);
    }
  };

  const limitLength = (value: string) => {
    return Array.from(value).slice(0, 20).join('');
  };

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(limitLength(e.target.value));
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    const value = limitLength(e.currentTarget.value);
    setEventName(value);
  };

  const handleSubmit = () => {
    // 문구 수정 또는 알림 기능 수정
    alert('등록이 완료되었습니다. 마이페이지에서 확인 가능합니다.');
    navigate('/home');
  };

  return (
    <>
      <TopBar title='행사 등록' leftOnClick={() => setIsOpenBackModal(true)} />
      {/* 이미지 첨부 */}
      <div className='flex flex-col gap-2.5'>
        <div>
          <span className='font-pretendard font-medium text-base text-gray-800'>이미지 첨부</span>
          <p className='font-pretendard font-normal text-sm text-gray-700'>최대 3장까지 가능해요.</p>
        </div>

        <div className='flex items-center'>
          {selectedImages.length > 0 && (
            <div>
              <div className='flex gap-1.5 w-full'>
                {selectedImages.map((image, idx) => (
                  <div key={idx} className='relative w-25 h-25 shrink-0'>
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

      {/* 행사명 */}
      <div className='mt-4.5 flex flex-col gap-1.5'>
        <label htmlFor='event-name' className='flex gap-0.5'>
          <span className='font-pretendard font-medium text-base text-gray-800'>행사명</span>
          <span aria-required='true' className='font-pretendard font-medium text-base text-error'>
            *
          </span>
        </label>
        <input type='text' name='event-name' id='event-name' placeholder='행사명을 입력해주세요.' className='font-pretendard placeholder:font-semibold text-base placeholder:text-gray-500 bg-gray-200 px-5 w-full h-13 rounded-xl font-normal text-gray-800' value={eventName} onChange={handleEventNameChange} onCompositionEnd={handleCompositionEnd} maxLength={20} />
        <span className='flex justify-end font-pretendard font-normal text-sm text-gray-600'>{eventName.length}/20</span>
      </div>

      {/* 행사 담당 기관 */}
      <div className='mt-4.5 flex flex-col gap-1.5'>
        <label htmlFor='event-name' className='flex gap-0.5'>
          <span className='font-pretendard font-medium text-base text-gray-800'>행사 담당 기관</span>
          <span aria-required='true' className='font-pretendard font-medium text-base text-error'>
            *
          </span>
        </label>
        <input type='text' name='event-name' id='event-name' placeholder='담당 기관을 입력해주세요.' className='font-pretendard placeholder:font-semibold text-base placeholder:text-gray-500 bg-gray-200 px-5 w-full h-13 rounded-xl font-normal text-gray-800' value={eventOrgan} onChange={(e) => setEventOrgan(e.target.value)} />
      </div>

      {/* 행사 일시 및 위치 */}
      <div className='mt-4.5 flex flex-col gap-1.5 justify-between'>
        <label htmlFor='event-name' className='flex gap-0.5'>
          <span className='font-pretendard font-medium text-base text-gray-800'>행사 일시 및 위치</span>
          <span aria-required='true' className='font-pretendard font-medium text-base text-error'>
            *
          </span>
        </label>
        {/* 시작일시 */}
        <div className='w-full bg-white border border-gray-300 rounded-xl px-2.5 py-4 flex items-center gap-3'>
          <div className='flex gap-1.5 items-center leading-none'>
            <EventCalender className='w-6 h-6 text-gray-600' />
            <span className='font-pretendard font-normal text-[13px] text-gray-600'>시작일시</span>
          </div>
          <div className='flex items-center gap-2 leading-none'>
            {/* 날짜 선택 */}
            <DateDropdown
              value={startEventDate}
              onChange={(date) => {
                setStartEventDate(date);
                setIsStartDateSelected(true);
              }}
              isDateSelected={isStartDateSelected}
            />

            {/* 시간 선택 */}
            <div ref={startTimePickerRef} className='relative'>
              <button type='button' onClick={() => setIsStartTimePickerOpen((prev) => !prev)} className={`flex w-full items-center justify-between gap-1 font-pretendard font-medium text-sm underline ${isStartTimeSelected ? 'text-main' : 'text-gray-500'}`}>
                <span>{startTime}</span>
                <ArrowDown className='w-6 h-6 text-gray-700' />
              </button>

              {isStartTimePickerOpen && (
                <div className='absolute left-1/2 -translate-x-1/2 top-full z-50 mt-2 rounded-xl shadow-lg bg-white p-1'>
                  <StartTimePicker
                    value={startTime}
                    onChange={(time) => {
                      setStartTime(time);
                      setIsStartTimeSelected(true);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* 종료일시 */}
        <div className='w-full bg-white border border-gray-300 rounded-xl px-2.5 py-4 flex items-center gap-3'>
          <div className='flex gap-1.5 items-center leading-none'>
            <EventCalender className='w-6 h-6 text-gray-600' />
            <span className='font-pretendard font-normal text-[13px] text-gray-600'>종료일시</span>
          </div>
          <div className='flex items-center gap-2 leading-none'>
            {/* 날짜 선택 */}
            <DateDropdown
              value={endEventDate}
              onChange={(date) => {
                setEndEventDate(date);
                setIsEndDateSelected(true);
              }}
              isDateSelected={isEndDateSelected}
            />

            {/* 시간 선택 */}
            <div ref={endTimePickerRef} className='relative'>
              <button type='button' onClick={() => setIsEndTimePickerOpen((prev) => !prev)} className={`flex w-full items-center justify-between gap-1 font-pretendard font-medium text-sm underline ${isEndTimeSelected ? 'text-main' : 'text-gray-500'}`}>
                <span>{endTime}</span>
                <ArrowDown className='w-6 h-6 text-gray-700' />
              </button>

              {isEndTimePickerOpen && (
                <div className='absolute left-1/2 -translate-x-1/2 top-full z-50 mt-2 rounded-xl shadow-lg bg-white p-1'>
                  <StartTimePicker
                    value={endTime}
                    onChange={(time) => {
                      setEndTime(time);
                      setIsEndTimeSelected(true);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* 행사 위치 */}
        {/* 클릭하면 바텀시트 */}
        <button type='button' className='w-full bg-white border border-gray-300 rounded-xl px-2.5 py-4 flex items-center gap-3'>
          <div className='flex gap-1.5 items-center'>
            <Marker className='w-4 h-4 text-gray-600' />
            <span className='font-pretendard font-normal text-[13px] text-gray-600'>행사 위치를 입력해주세요</span>
          </div>
        </button>
      </div>

      {/* 행사 내용 */}
      <div className='mt-4.5 flex flex-col gap-1.5'>
        <label className='font-pretendard font-medium text-base text-gray-800'>행사 내용</label>
        <textarea name='event-content' id='event-content' className='bg-gray-200 placeholder:font-semibold placeholder:text-gray-500 font-pretendard text-base font-normal text-gray-800 px-5 py-3.5 rounded-xl h-26 resize-none overflow-y-scroll' placeholder='행사 내용을 자세히 작성해주세요.' value={eventContent} maxLength={500} onChange={(e) => setEventContent(e.target.value)} />
        <span className='flex justify-end font-pretendard font-normal text-sm text-gray-600'>{eventContent.length}/500</span>
      </div>

      {/* 담당자 정보 */}
      <div className='mt-4.5'>
        <span className='font-pretendard font-medium text-base text-gray-800 leading-6'>담당자 정보</span>
        <p className='font-pretendard font-normal text-sm text-gray-700 leading-5.5'>
          {mock[0].name}•{mock[0].grade}•{mock[0].major}
        </p>
      </div>

      {/* 완료 버튼 */}
      <button type='button' className={`w-full mt-8.5 bg-main py-3.5 font-pretendard font-semibold text-base text-gray-50 rounded-xl disabled:bg-gray-400`} onClick={() => setIsOpenSubmitModal(true)} disabled={!eventName || !eventOrgan || !isEndDateSelected || !isStartDateSelected || !isEndTimeSelected || !isStartTimeSelected}>
        완료
      </button>

      {/* 뒤로가기 모달 */}
      {isOpenBackModal && <Modal title='행사 등록을 그만둘까요?' content='지금 나가면 작성 중인 내용이 저장되지 않고 사라져요.' leftBtn='계속 작성' cancel={() => setIsOpenBackModal(false)} rightBtn='나가기' onClick={() => navigate(-1)} />}

      {/* 완료 모달 */}
      {isOpenSubmitModal && <Modal title='행사를 등록하시겠어요?' content='등록한 행사 정보는 관리자의 승인 후 사용자들에게 공개돼요. 허위 또는 부적절한 내용은 관리자에 의해 수정되거나 삭제될 수 있어요.' leftBtn='취소' cancel={() => setIsOpenSubmitModal(false)} rightBtn='등록하기' onClick={handleSubmit} />}
    </>
  );
}
