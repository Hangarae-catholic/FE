import { useEffect, useRef, useState } from 'react';
import Camera from '/src/assets/icons/camera.svg?react';
import Delete from '/src/assets/icons/delete.svg?react';
import EventCalender from '/src/assets/icons/calendar_event.svg?react';
import DateDropdown from '../components/AddEventPage/DatePicker';
import CurrentTime from '../utils/CurrentTime';
import StartTimePicker from '../components/AddEventPage/TimePicker';
import ArrowDown from '/src/assets/icons/arrow_down.svg?react';

export default function AddEventPage() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<string>(CurrentTime());
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const timePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setIsTimePickerOpen(false);
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

  return (
    <>
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
            <label className='w-25 h-25 flex justify-center items-center bg-gray-200'>
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
        <input type='text' name='event-name' id='event-name' placeholder='담당 기관을 입력해주세요.' className='font-pretendard placeholder:font-semibold text-base placeholder:text-gray-500 bg-gray-200 px-5 w-full h-13 rounded-xl font-normal text-gray-800' />
      </div>

      {/* 행사 일시 및 위치 */}
      <div className='mt-4.5 flex flex-col gap-1.5 justify-between'>
        <label htmlFor='event-name' className='flex gap-0.5'>
          <span className='font-pretendard font-medium text-base text-gray-800'>행사 일시 및 위치</span>
          <span aria-required='true' className='font-pretendard font-medium text-base text-error'>
            *
          </span>
        </label>
        <div className='w-full bg-white border border-gray-300 rounded-xl px-2.5 py-4 flex items-center gap-3'>
          <div className='flex gap-1.5 items-center'>
            <EventCalender className='w-6 h-6 text-gray-600' />
            <span className='font-pretendard font-normal text-[13px] text-gray-600'>시작일시</span>
          </div>
          <div className='flex items-baseline gap-2'>
            {/* 날짜 선택 */}
            <DateDropdown value={eventDate} onChange={setEventDate} />

            {/* 시간 선택 */}
            <div ref={timePickerRef} className='relative'>
              {/* 드롭다운 버튼 */}
              <button type='button' onClick={() => setIsTimePickerOpen((prev) => !prev)} className='flex w-full items-center justify-between gap-1 font-pretendard font-medium text-sm text-gray-500 underline'>
                <span>{startTime}</span>

                <ArrowDown className='w-6 h-6 text-gray-700' />
              </button>

              {/* 버튼 바로 아래에 시간 선택기 표시 */}
              {isTimePickerOpen && (
                <div className='absolute left-1/2 -translate-x-1/2 top-full z-50 mt-2 rounded-xl shadow-lg bg-white p-1'>
                  <StartTimePicker value={startTime} onChange={setStartTime} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 행사 내용 */}

      {/* 담당자 정보 */}
    </>
  );
}
