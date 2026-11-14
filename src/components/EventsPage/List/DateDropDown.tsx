import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import ArrowLeft from '/src/assets/icons/date-arrow_left.svg?react';
import ArrowRight from '/src/assets/icons/date-arrow_right.svg?react';
import ArrowDown from '/src/assets/icons/arrow_down.svg?react';
import { flip, shift } from '@floating-ui/dom';
import Calendar from '/src/assets/icons/calendar_event.svg?react';

type DateButtonProps = {
  displayValue: string;
  onClick?: () => void;
  isToday: boolean;
};

const DateButton = forwardRef<HTMLButtonElement, DateButtonProps>(({ displayValue, onClick, isToday }, ref) => (
  <button ref={ref} type='button' onClick={onClick} aria-label='행사 날짜 선택' className='flex justify-between items-center gap-2 bg-white px-2 py-1.5 border border-gray-50 rounded-lg'>
    <div className='flex items-center gap-1'>
      <Calendar className='w-6 h-6 text-gray-600' />
      <span className='font-pretendard font-normal text-sm text-gray-700 max-[330px]:text-xs'>
        {displayValue}
        &nbsp;
        {isToday && '오늘'}
      </span>
    </div>

    <ArrowDown className='w-6 h-6 text-gray-800' />
  </button>
));

DateButton.displayName = 'DateButton';

type DateDropdownProps = {
  value: Date | null | [Date | null, Date | null];
  onChange: (date: Date | null | [Date | null, Date | null]) => void;
  isDateSelected: boolean;
  isRange?: boolean;
  showArrow?: boolean;
  showCustomInput?: boolean;
};

export default function DateDropdown({ value, onChange, isRange = false }: DateDropdownProps) {
  const rangeValue = Array.isArray(value) ? value : [value, null];

  const [startDate, endDate] = rangeValue;

  const formatDate = (date: Date) => format(date, isRange ? 'M/d' : 'M/d (E)', { locale: ko });

  const displayValue = isRange ? (startDate ? `${formatDate(startDate)} ~ ${formatDate(endDate ?? startDate)}` : `${formatDate(new Date())} ~ ${formatDate(new Date())}`) : formatDate(startDate ?? new Date());

  // 오늘 날짜 포함 일주일 계산
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(today);
  lastDate.setDate(today.getDate() + 6);

  return (
    <DatePicker
      wrapperClassName='w-full'
      calendarClassName='custom-range-calendar'
      selected={startDate}
      onChange={(date: Date | null | [Date | null, Date | null]) => {
        if (isRange) {
          onChange(date as [Date | null, Date | null]);
        } else {
          onChange(date as Date | null);
        }
      }}
      startDate={startDate}
      endDate={endDate}
      selectsRange={isRange ? true : undefined}
      locale={ko}
      dateFormat='yyyy.MM.dd'
      customInput={<DateButton displayValue={displayValue} isToday={!isRange && (!startDate || formatDate(startDate)) === formatDate(today)} />}
      popperClassName='!z-50'
      popperPlacement='bottom-start'
      popperModifiers={[
        flip({
          fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
        }),
        shift({
          padding: 8,
        }),
      ]}
      showPopperArrow={false}
      shouldCloseOnSelect
      isClearable={false}
      filterDate={(date) => {
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        return targetDate >= today && targetDate <= lastDate;
      }}
      renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
        <div className='flex items-center justify-between px-3 pb-3 pt-1'>
          <button type='button' onClick={decreaseMonth} aria-label='이전 달' className='flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100'>
            <ArrowLeft className='w-8 h-8' />
          </button>

          <span className='font-pretendard text-base font-semibold text-gray-800'>
            {date.getMonth() + 1}월 {date.getFullYear()}
          </span>

          <button type='button' onClick={increaseMonth} aria-label='다음 달' className='flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100'>
            <ArrowRight className='w-8 h-8' />
          </button>
        </div>
      )}
    />
  );
}
